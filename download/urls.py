from django.urls import path
from . import views

app_name = 'download'
urlpatterns = [
    path('<int:group_id>/<int:blog_ct>/', views.download, name='download'),
    path('inform_of_download/', views.inform_of_download, name='inform_of_download')
]
