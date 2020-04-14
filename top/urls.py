from django.urls import path
from top import views

app_name = 'top'
urlpatterns = [
    path('', views.top, name='top'),
    path('support/', views.support, name='support'),
]
