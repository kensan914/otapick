from django.urls import path

from . import views

app_name = 'imgSaver'
urlpatterns = [
    path('', views.save, name='download'),
]
