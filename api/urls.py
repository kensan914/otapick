from django.urls import path
from . import views

app_name = 'api'
urlpatterns = [
    # path('member/<int:group_id>/<str:ct>/', views.memberRetrieveAPIView, name='memberRetrieveAPI'),
    path('members/', views.memberListAPIView, name='memberListAPI'),
    path('blog/<int:group_id>/<int:blog_ct>/', views.blogDetailAPIView, name='blogDetailAPI'),
    path('blogs/<int:group_id>/', views.blogListAPIView, name='blogList_G_API'),
    path('blogs/<int:group_id>/<str:ct>/', views.blogListAPIView, name='blogList_M_API'),
    path('blogs/info/<int:group_id>/', views.blogListInfoAPIView, name='blogListInfo_G_API'),
    path('blogs/info/<int:group_id>/<str:ct>/', views.blogListInfoAPIView, name='blogListInfo_M_API'),
    path('searchSuggestions/', views.searchSuggestionsAPIView, name='searchSuggestionsAPI'),
    path('searchSuggestions/init/', views.searchSuggestionsInitAPIView, name='searchSuggestionsInitAPI'),
    path('search/', views.searchAPIView, name='searchAPI'),
    # path('blog/view/<int:group_id>/<int:blog_ct>/', views.blogViewAPIView, name='blogViewAPI'),
    # path('blog/download/<int:group_id>/<int:blog_ct>/', views.blogDownloadAPIView, name='blogDownloadAPI'),
]
