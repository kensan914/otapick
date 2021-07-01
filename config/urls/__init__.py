from django.contrib import admin
from django.urls import path, include, re_path
import dist.views
from config import settings
from config.urls import default_urls, ogp_urls, swagger_urls


"""
URL routing for otapick.com or 192.168.11.46:8000(debug)
"""


# カスタム500エラー・slackへの通知
handler500 = dist.views.server_error


urlpatterns = [
    path("", include(default_urls)),
    path("", include(ogp_urls)),
]

# only Debugging
if settings.DEBUG:
    urlpatterns += [
        path("", include(swagger_urls)),
        path("admin/", admin.site.urls),
        path("maintenance-mode/", include("maintenance_mode.urls")),
    ]

# catch all other URL
urlpatterns += [re_path(r"^.*/$", dist.views.indexView, name="indexView")]
urlpatterns += [path("", dist.views.indexView, name="indexView")]
