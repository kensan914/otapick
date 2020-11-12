from django.contrib import admin
from django.urls import path, include, re_path
from . import urls


def set_admin_env():
    admin.site.site_header = 'ヲタピック管理サイト'
    admin.site.site_title = 'ヲタピック管理サイト'
    admin.site.index_title = 'ホーム'

set_admin_env()
urlpatterns = [
    path('', urls),
    path('admin/', admin.site.urls, name='admin'),
    path('maintenance-mode/', include('maintenance_mode.urls')),
]
