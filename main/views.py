from django.shortcuts import render, redirect
from config import settings
from django.views import View
import otapick


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'static_update': '?4.2.1', 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    index_context = dict(**BaseView.context, **{'fqdn': '127.0.0.1:8000' if settings.DEBUG else 'otapick.com'})

    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.index_context)


indexView = IndexView.as_view()


class IndexAdminView(IndexView):
    index_context = dict(**BaseView.context, **{'fqdn': 'admin.otapick.com'})


indexAdminView = IndexAdminView.as_view()


class MaintenanceView(BaseView):
    def get(self, request, *args, **kwargs):
        f = open('{}/config/maintenance_mode_state.txt'.format(settings.BASE_DIR))
        mode_state = otapick.clean_text(f.read())
        f.close()
        print(mode_state)
        if mode_state == '0':
            redirect('/')
        else:
            return render(request, '503.html')



maintenanceView = MaintenanceView.as_view()