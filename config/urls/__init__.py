"""config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
import main.views
import main.redirect
from config import settings
from config.urls import default_urls

# カスタム500エラー・slackへの通知
handler500 = main.views.server_error

urlpatterns = [
    path('', include(default_urls)),
    path('admin/', admin.site.urls if settings.DEBUG else main.views.maintenanceView),
]

if settings.DEBUG:
    urlpatterns += [
        path('maintenance-mode/', include('maintenance_mode.urls')),
    ]

# catch all other URL
urlpatterns += [ # for OGP
    path('blog/<int:group_id>/<int:blog_ct>/', main.views.indexBlogDetailView, name='indexBlogDetailAPI'),
    path('image/<int:group_id>/<int:blog_ct>/<int:order>/', main.views.indexImageDetailView, name='indexImageDetaillAPI'),
]
urlpatterns += [re_path(r'^.*/$', main.views.indexView, name='indexView')]
urlpatterns += [path('', main.views.indexView, name='indexView')]
