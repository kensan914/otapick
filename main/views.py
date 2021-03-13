import otapick
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from config import settings
from django.views import View


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'static_update': '?{}'.format(
        otapick.VERSION), 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    index_context = dict(
        **BaseView.context, **{'fqdn': otapick.OTAPICK_FQDN if settings.DEBUG else 'otapick.com'})

    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.index_context)


indexView = IndexView.as_view()


class IndexAdminView(IndexView):
    index_context = dict(**BaseView.context, **{'fqdn': 'admin.otapick.com'})


indexAdminView = IndexAdminView.as_view()


class MaintenanceView(BaseView):
    def get(self, request, *args, **kwargs):
        isMaintaining = otapick.checkIsMaintaining(settings.BASE_DIR)
        if isMaintaining:
            return HttpResponse(loader.render_to_string('503.html'), status=503)
        else:
            return redirect('/')


maintenanceView = MaintenanceView.as_view()
