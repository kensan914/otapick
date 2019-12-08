from django.urls import path

from . import views

app_name = 'blogSearch'
urlpatterns = [
    path('', views.byBlogs, name='searchByBlogs'),
    path('member/', views.byMembers, name='searchByMembers'),
]
