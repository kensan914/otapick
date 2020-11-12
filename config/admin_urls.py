from django.contrib import admin
from django.urls import path, include, re_path
from . import urls


admin.site.site_header = 'ヲタピック管理サイト'
admin.site.site_title = 'ヲタピック管理サイト'
admin.site.index_title = 'ホーム'

urlpatterns = [
    path('', include(urls)),
    path('admin/', admin.site.urls, name='admin'),
    path('maintenance-mode/', include('maintenance_mode.urls')),
]
