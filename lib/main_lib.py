from django.shortcuts import HttpResponse, redirect
from django.conf import settings


class RenderView:
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

    @staticmethod
    def parameters_to_dict(params):
        return dict(params)#result

    @classmethod
    def to_view(cls, method_name, login_required, method_type):
        if method_type.upper() == 'GET':
            return lambda request: cls.response(method_name=method_name, init_params=request.GET.dict(),
                         logged=(request.user.is_authenticated() if login_required else True), request=request)

        else:
            return lambda request: cls.response(method_name=method_name, init_params=request.POST.dict(),
                 logged=(request.user.is_authenticated() if login_required else True), request=request)
