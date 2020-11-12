from django.contrib import admin
from django.urls import path


def set_admin_env():
    admin.site.site_header = 'ヲタピック管理サイト'
    admin.site.site_title = 'ヲタピック管理サイト'
    admin.site.index_title = 'ホーム'

set_admin_env()
urlpatterns = [
    path('', admin.site.urls),
]
