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
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path

import main.views
from config import settings
from django.views.static import serve

urlpatterns = [
    path('', main.views.top, name='top'),
    path('support/', main.views.support, name='support'),
    path('search/', include('main.urls')),
    path('download/', include('image.urls')),
    path('api/', include('api.urls')),
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),

    path('react/', main.views.react, name='react'),

]

#Debug=Falseでもadminへアクセスできてしまうため、対処
if settings.DEBUG:
    urlpatterns += [path('admin/', admin.site.urls)]