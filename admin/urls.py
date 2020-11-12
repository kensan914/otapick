from django.contrib import admin
from django.urls import path, include


def set_admin_env():
    admin.site.site_header = 'ヲタピック管理サイト'
    admin.site.site_title = 'ヲタピック管理サイト'
    admin.site.index_title = 'ホーム'

set_admin_env()
# app_name = 'admin'
urlpatterns = [
    # path('maintenance-mode/', include('maintenance_mode.urls')),
    path('', admin.site.urls),
]
