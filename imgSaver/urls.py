from django.urls import path

from . import views

app_name = 'imgSaver'
urlpatterns = [
    path('/<int:group_id>/<int:detail>', views.save, name='download'),
]
