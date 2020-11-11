from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include, re_path
from config import settings
from django.views.static import serve

urlpatterns = [
    path('', admin.site.urls),
]
