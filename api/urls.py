from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    path('member/<int:group_id>/<str:ct>/', views.memberRetrieveAPIView, name='memberRetrieveAPI'),
    path('member/<int:group_id>/', views.memberListAPIView, name='memberListAPI'),
    path('blogs/<int:group_id>/', views.blogListAPIView, name='blogList_G_API'),
    path('blogs/<int:group_id>/<str:ct>/', views.blogListAPIView, name='blogList_M_API'),
    path('blogs/info/<int:group_id>/', views.blogListInfoAPIView, name='blogListInfo_G_API'),
    path('blogs/info/<int:group_id>/<str:ct>/', views.blogListInfoAPIView, name='blogListInfo_M_API'),
    path('searchSuggestions/', views.searchSuggestionsAPIView, name='searchSuggestionsAPI'),
    path('searchSuggestions/init/', views.searchSuggestionsInitAPIView, name='searchSuggestionsInitAPI'),
]
