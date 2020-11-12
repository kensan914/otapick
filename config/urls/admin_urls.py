from django.contrib import admin
from django.urls import path, include, re_path
import main.views
from config.urls import default_urls


admin.site.site_header = 'ヲタピック管理サイト'
admin.site.site_title = 'ヲタピック管理サイト'
admin.site.index_title = 'ホーム'

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('maintenance-mode/', include('maintenance_mode.urls')),
    path('', include(default_urls)),
]

# catch all other URL
urlpatterns += [re_path(r'^.*/$', main.views.indexAdminView, name='indexAdminView')]
urlpatterns += [path('', main.views.indexAdminView, name='indexAdminView')]
