from django.shortcuts import render
import otapick
from config import settings
from django.views import View


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'static_update': '?{}'.format(otapick.VERSION), 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    index_context = dict(**BaseView.context, **{'fqdn': '127.0.0.1:8000' if settings.DEBUG else 'otapick.com'})

    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.index_context)


indexView = IndexView.as_view()


class IndexAdminView(IndexView):
    index_context = dict(**BaseView.context, **{'fqdn': 'admin.otapick.com'})


indexAdminView = IndexAdminView.as_view()
