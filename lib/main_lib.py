from django.shortcuts import HttpResponse, redirect
from django.conf import settings
import json
from django.core.exceptions import ValidationError
from django.db.models import BooleanField, ImageField, FileField
import os


class RenderView(object):

    def SetValue(self, obj, key, value):
        setattr(obj, key, value)

    def SaveObject(self, obj):
        obj.save()

    def SaveModel(self, model, parametros, msg, files=None):

        if 'id' in parametros:
            if parametros['id']:
                obj = model.objects.get(pk=parametros['id'])
            else:
                obj = model()
        else:
            obj = model()

        for key in parametros:
            if key.upper() != 'ID' and hasattr(obj, key):
                if obj._meta.get_field(key).__class__ in(FileField, ImageField):
                    continue

                if obj._meta.get_field(key).__class__ == BooleanField:
                    if parametros[key] in ('true', 'false', 'TRUE', 'FALSE', 'True', 'False'):
                        parametros[key] = eval(parametros[key].lower().capitalize())

                #setattr(obj, key, parametros[key])
                self.SetValue(obj=obj, key=key, value=parametros[key])

        if files:
            for key in files:
                if hasattr(obj, key):
                    getattr(obj, key).delete(False)
                    setattr(obj, key, files.get(key))
        try:
            obj.full_clean()
        except ValidationError as e:
            return json.dumps({"msg": json.dumps(e.message_dict), "ok": False})

        try:
            self.SaveObject(obj=obj)
            return json.dumps(
                {"msg": msg, "ok": True, "key": getattr(obj, 'id')})
        except Exception as e:
            return str(e)

    @staticmethod
    def parameters_to_dict(params):
        return dict(params)

    @classmethod
    def response(cl, method_name, init_params=None, logged=True, request=None):
        if not logged:
            return redirect(settings.LOGIN_URL)

        if hasattr(cl, 'request'):
            cl.request = request

        if init_params:
            obj = cl(**init_params)
        else:
            obj = cl()
        return HttpResponse(getattr(obj, method_name)())

    @classmethod
    def to_view(cls, method_name, login_required, method_type):
        if method_type.upper() == 'GET':
            return lambda request: cls.response(method_name=method_name, init_params=request.GET.dict(),
                                                logged=(request.user.is_authenticated() if login_required else True),
                                                request=request)

        else:
            return lambda request: cls.response(method_name=method_name, init_params=request.POST.dict(),
                                                logged=(request.user.is_authenticated() if login_required else True),
                                                request=request)
