from django.http.response import HttpResponseServerError
import otapick
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from config import settings
from django.views import View


class BaseView(View):
    html_path = 'frontend/index.html'
    context = {'version': otapick.VERSION, 'version_query_string': '?{}'.format(
        otapick.VERSION), 'debug': settings.env.bool('DEBUG')}


class IndexView(BaseView):
    index_context = dict(**BaseView.context, **{'fqdn': otapick.OTAPICK_FQDN})

    def get(self, request, *args, **kwargs):
        return render(request, self.html_path, self.index_context)


indexView = IndexView.as_view()


class IndexAdminView(IndexView):
    index_context = dict(**BaseView.context, **
                         {'fqdn': 'admin.{}'.format(otapick.OTAPICK_FQDN)})


indexAdminView = IndexAdminView.as_view()


class MaintenanceView(BaseView):
    def get(self, request, *args, **kwargs):
        isMaintaining = otapick.checkIsMaintaining(settings.BASE_DIR)
        if isMaintaining:
            return HttpResponse(loader.render_to_string('503.html'), status=503)
        else:
            return redirect('/')


maintenanceView = MaintenanceView.as_view()


def server_error(request, template_name='500.html'):
    import requests
    import json
    import traceback
    requests.post(
        otapick.SLACK_WEBHOOKS_OTAPICK_BOT_URL,
        data=json.dumps({
            'text': '\n'.join([
                f':x: *500 ERROR ALERT* :x:',
                f'Request URL: {request.build_absolute_uri()}',
                f'↓↓↓',
                f'```{traceback.format_exc()}```',
            ]),
        })
    )
    return HttpResponseServerError('<h1>申し訳ございません。只今不具合が発生しております。復旧まで今しばらくお待ちください。</h1>')
