from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('member/<int:group_id>/<str:ct>/', views.memberRetrieveAPIView, name='image'),
]
