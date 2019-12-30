from django.urls import path

from . import views

app_name = 'search'
urlpatterns = [
    path('latest/<int:group_id>/', views.searchByLatest, name='searchByLatest'),
    path('list/<int:group_id>/<int:page>/', views.searchByBlogs, name='searchByBlogs'),
    path('list/unjust/', views.searchUnjustURL, name='searchUnjustURL'),
    path('member/blog/<int:group_id>/<str:ct>/', views.searchByMembers, name='searchByMembers'),
    path('member/', views.memberList, name='memberList'),
    path('member/<str:searchText>/', views.searchMember, name='searchMember'),
    path('autocomplete_name/', views.autocomplete, name='autocomplete'),
]
