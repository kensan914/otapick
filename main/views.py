from django.shortcuts import render
import otapick
from config import settings
from django.views import View


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'static_update': '?{}'.format(otapick.VERSION), 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.context.update({'fqdn': 'otapick.com'}))


indexView = IndexView.as_view()
