from django.shortcuts import HttpResponse, redirect
from django.conf import settings


class RenderView:
    @classmethod
    def response(cl, method_name, init_params=None, logged=True):
        if not logged:
            return redirect(settings.LOGIN_URL)

        if init_params:
            obj = cl(**init_params)
        else:
            obj = cl()
        return HttpResponse(getattr(obj, method_name)())

    @staticmethod
    def parameters_to_dict(params):
        result = {}
        for p in params.items():
            result.update({p[0]: p[1][0]})
        return result

    @classmethod
    def to_view(cls, method_name, login_required, method_type):
        if method_type.upper() == 'GET':
            return lambda request: cls.response(method_name=method_name, init_params=cls.parameters_to_dict(request.GET),
                         logged=(request.user.is_authenticated() if login_required else True))

        else:
            return lambda request: cls.response(method_name=method_name, init_params=cls.parameters_to_dict(request.POST),
                 logged=(request.user.is_authenticated() if login_required else True))
