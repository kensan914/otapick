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
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include, re_path
import main.views
import main.redirect
from config import settings
from django.views.static import serve

urlpatterns = [
    path('api/', include('api.urls')),
    # past URL
    path('search/group/blog/<int:group_id>/', main.redirect.redirectBlogsGView, name="redirectBlogsGView"),
    path('search/member/blog/<int:group_id>/<str:ct>/', main.redirect.redirectBlogsMView, name="redirectBlogsMView"),
    path('download/<int:group_id>/<int:blog_ct>/<int:order>/', main.redirect.redirectImageView, name="redirectImageView"),
    path('search/member/', main.redirect.redirectMembersView, name="redirectMembersView"),

    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

#Debug=Falseでもadminへアクセスできてしまうため、対処
if settings.DEBUG:
    urlpatterns += [path('admin/', admin.site.urls)]

# catch all other URL
urlpatterns += [re_path(r'^.*/$', main.views.indexView, name='indexView')]
urlpatterns += [path('', main.views.indexView, name='indexView')]
