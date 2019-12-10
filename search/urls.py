from django.urls import path

from . import views

app_name = 'search'
urlpatterns = [
    path('', views.searchByBlogs, name='searchByBlogs'),
    path('member/', views.searchByMembers, name='searchByMembers'),
]
