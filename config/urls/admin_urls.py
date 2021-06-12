from django.contrib import admin
from django.urls import path, include, re_path
import main.views
from config.urls import default_urls


# admin.site.site_header = 'OTAPICK ADMIN🌸🌈🌳'
admin.site.site_title = "ヲタピック管理サイト"
admin.site.index_title = "HOME🏠"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("maintenance-mode/", include("maintenance_mode.urls")),
    path("", include(default_urls)),
]


# catch all other URL
urlpatterns += [re_path(r"^.*/$", main.views.indexView, name="indexAdminView")]
urlpatterns += [path("", main.views.indexView, name="indexAdminView")]
