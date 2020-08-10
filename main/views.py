from django.shortcuts import render
from config import settings
from django.views import View


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'static_update': '?4.0.15', 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.context)


indexView = IndexView.as_view()
