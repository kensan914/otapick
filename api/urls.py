from django.urls import path
from . import views
from account import views as account_views


app_name = 'api'
urlpatterns = [
    path('members/', views.memberListAPIView, name='memberListAPI'),
    path('blog/<int:group_id>/<int:blog_ct>/', views.blogDetailAPIView, name='blogDetailAPI'),
    path('blogs/', views.blogListAPIView, name='blogListAPI'),
    path('blogs/<int:group_id>/', views.blogListAPIView, name='blogList_G_API'),
    path('blogs/<int:group_id>/<str:ct>/', views.blogListAPIView, name='blogList_M_API'),
    path('blogs/info/', views.blogListInfoAPIView, name='blogListInfo_R_API'),
    path('blogs/info/<int:group_id>/', views.blogListInfoAPIView, name='blogListInfo_G_API'),
    path('blogs/info/<int:group_id>/<str:ct>/', views.blogListInfoAPIView, name='blogListInfo_M_API'),
    path('searchSuggestions/', views.searchSuggestionsAPIView, name='searchSuggestionsAPI'),
    path('searchSuggestions/init/', views.searchSuggestionsInitAPIView, name='searchSuggestionsInitAPI'),
    path('search/', views.searchAPIView, name='searchAPI'),
    path('images/', views.imageListAPIView, name='imageListAPI'),
    path('images/<int:group_id>/', views.imageListAPIView, name='imageList_G_API'),
    path('images/<int:group_id>/<str:ct>/', views.imageListAPIView, name='imageList_M_API'),
    path('images/info/', views.imageListInfoAPIView, name='imageListInfo_R_API'),
    path('images/info/<int:group_id>/', views.imageListInfoAPIView, name='imageListInfo_G_API'),
    path('images/info/<int:group_id>/<str:ct>/', views.imageListInfoAPIView, name='imageListInfo_M_API'),
    path('image/<int:group_id>/<int:blog_ct>/<int:order>/', views.imageDetailAPIView, name='imageDetailAPI'),
    path('relatedImages/<int:group_id>/<int:blog_ct>/<int:order>/', views.relatedImageListAPIView, name='relatedImageListAPI'),
    path('home/', views.homeAPIView, name='homeAPI'),
    path('home/additional/', views.homeAdditionalAPIView, name='homeAdditionalAPI'),
    path('me/', account_views.meAPIView, name='meAPI'),
    path('users/<str:username>/', account_views.userAPIView, name='userAPI'),
]
