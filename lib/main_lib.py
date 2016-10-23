from django.shortcuts import HttpResponse, redirect, render_to_response, render
from django.conf import settings
import json
from django.core.exceptions import ValidationError
from django.db.models import BooleanField, ImageField, FileField
from django.db.models.fields.files import ImageFieldFile
from PIL import Image
import os
from django.template import loader

class RenderView(object):

    def CheckBoolean(self, value):
        if value in ('true', 'false', 'TRUE', 'FALSE', 'True', 'False'):
            return eval(value.lower().capitalize())
        else:
            return False

    def SetValue(self, obj, key, value):
        if obj._meta.get_field(key).__class__ == BooleanField:
            value = self.CheckBoolean(value)

        setattr(obj, key, value)

    def SaveObject(self, obj):
        obj.save()


    def __ReduceImageFields(self, model_instance):

        fields = model_instance.__class__._meta.get_fields()

        for f in fields:
            if not f.__class__ in (ImageField, ImageFieldFile):
                continue

            key = f.name
            field = getattr(model_instance, key)
            file = field.path

            img = Image.open(file)
            img.thumbnail((400, 400), Image.ANTIALIAS)

            fname, ext = os.path.splitext(file)
            new_ext = ext.upper()[1:]
            if new_ext == 'JPG':
                new_ext = 'JPEG'

            img.save(fname + ext, new_ext)

    def __GetModelInstance(self, parameters, model_class):
        if 'id' in parameters:
            if parameters['id']:
                return model_class.objects.get(pk=parameters['id'])
            else:
                return model_class()
        else:
            return model_class()


    def __SetFilesToModelObject(self, files, model_instance):
        if files:
            for key in files:
                if hasattr(model_instance, key):
                    getattr(model_instance, key).delete(False)
                    setattr(model_instance, key, files.get(key))


    def __SetValuesToModelObject(self, parameters, model_instance):
        for key in parameters:
            if key.upper() != 'ID' and hasattr(model_instance, key):
                if model_instance._meta.get_field(key).__class__ in(FileField, ImageField):
                    continue

                self.SetValue(obj=model_instance, key=key, value=parameters[key])


    def __MakeTheModelValidation(self, model_instance):
        try:
            model_instance.full_clean()
        except ValidationError as e:
            return json.dumps({"msg": json.dumps(e.message_dict), "ok": False})

        return None

    def __GetValuesToReturn(self, fields, model_instance):
        fr = {}
        if fields:
            for f in fields:
                fr.update({f: getattr(model_instance, f)})

        return fr

    def SaveModel(self, model, parametros, msg, files=None, fields_to_return = ()):

        obj = self.__GetModelInstance(parameters=parametros, model_class=model)
        self.__SetValuesToModelObject(parameters=parametros, model_instance=obj)
        self.__SetFilesToModelObject(files=files, model_instance=obj)
        validation = self.__MakeTheModelValidation(model_instance=obj)

        if validation:
            return validation

        try:
            self.SaveObject(obj=obj)
            if files:
                self.__ReduceImageFields(model_instance=obj)

            return json.dumps(
                {"msg": msg, "ok": True, "key": getattr(obj, 'id'),
                 "data":self.__GetValuesToReturn(fields=fields_to_return, model_instance=obj)})
        except Exception as e:
            return json.dumps(
                {"msg": str(e), "ok": False, "key": "",
                 "data":{}})



    @staticmethod
    def parameters_to_dict(params):
        return dict(params)

    @classmethod
    def response(cl, method_name, init_params=None, logged=True, request=None, content_type="application/json"):
        if not logged:
            return redirect(settings.LOGIN_URL)

        if hasattr(cl, 'request'):
            cl.request = request

        if init_params:
            obj = cl(**init_params)
        else:
            obj = cl()
        return HttpResponse(getattr(obj, method_name)() , content_type=content_type)

    @classmethod
    def to_view(cls, method_name, login_required, method_type, return_content_type = "application/json"):
        if method_type.upper() == 'GET':
            return lambda request: cls.response(method_name=method_name, init_params=request.GET.dict(),
                                                logged=(request.user.is_authenticated() if login_required else True),
                                                request=request, content_type=return_content_type)

        else:
            return lambda request: cls.response(method_name=method_name, init_params=request.POST.dict(),
                                                logged=(request.user.is_authenticated() if login_required else True),
                                                request=request, content_type=return_content_type)

    @classmethod
    def get_template(cls, template):
        return lambda request: render_to_response(template_name=template)