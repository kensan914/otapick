from django.urls import path

from . import views

app_name = 'search'
urlpatterns = [
    path('latest/', views.searchByLatest, name='searchByLatest'),
    path('list/<int:group_id>/', views.searchByBlogs, name='searchByBlogs'),
    path('member/blog/<int:group_id>/<str:ct>/', views.searchByMembers, name='searchByMembers'),
    path('member/<str:searchText>', views.searchMember, name='searchMember'),
]
