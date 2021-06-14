from django.urls import path

from api.views import main_views, image_views, account_views, survey_views

app_name = "api"
urlpatterns = [
    path("members/", main_views.memberListAPIView, name="memberListAPI"),
    path(
        "blog/<int:group_id>/<int:blog_ct>/",
        main_views.blogDetailAPIView,
        name="blogDetailAPI",
    ),
    path("blogs/", main_views.blogListAPIView, name="blogListAPI"),
    path("blogs/<int:group_id>/", main_views.blogListAPIView, name="blogList_G_API"),
    path(
        "blogs/<int:group_id>/<str:ct>/",
        main_views.blogListAPIView,
        name="blogList_M_API",
    ),
    path("blogs/info/", main_views.blogListInfoAPIView, name="blogListInfo_R_API"),
    path(
        "blogs/info/<int:group_id>/",
        main_views.blogListInfoAPIView,
        name="blogListInfo_G_API",
    ),
    path(
        "blogs/info/<int:group_id>/<str:ct>/",
        main_views.blogListInfoAPIView,
        name="blogListInfo_M_API",
    ),
    path(
        "search-suggestions/",
        main_views.searchSuggestionsAPIView,
        name="searchSuggestionsAPI",
    ),
    path(
        "search-suggestions/init/",
        main_views.searchSuggestionsInitAPIView,
        name="searchSuggestionsInitAPI",
    ),
    path("search/", main_views.searchAPIView, name="searchAPI"),
    path("images/", image_views.imageListAPIView, name="imageListAPI"),
    path(
        "images/<int:group_id>/",
        image_views.imageListAPIView,
        name="imageList_G_API",
    ),
    path(
        "images/<int:group_id>/<str:ct>/",
        image_views.imageListAPIView,
        name="imageList_M_API",
    ),
    path(
        "images/info/",
        image_views.imageListInfoAPIView,
        name="imageListInfo_R_API",
    ),
    path(
        "images/info/<int:group_id>/",
        image_views.imageListInfoAPIView,
        name="imageListInfo_G_API",
    ),
    path(
        "images/info/<int:group_id>/<str:ct>/",
        image_views.imageListInfoAPIView,
        name="imageListInfo_M_API",
    ),
    path(
        "image/<int:group_id>/<int:blog_ct>/<int:order>/",
        image_views.imageDetailAPIView,
        name="imageDetailAPI",
    ),
    path(
        "relatedImages/<int:group_id>/<int:blog_ct>/<int:order>/",
        image_views.relatedImageListAPIView,
        name="relatedImageListAPI",
    ),
    path("home/", image_views.homeAPIView, name="homeAPI"),
    path(
        "home/additional/",
        image_views.homeAdditionalAPIView,
        name="homeAdditionalAPI",
    ),
    path("me/", account_views.meAPIView, name="meAPI"),
    path("users/<str:username>/", account_views.userAPIView, name="userAPI"),
    path(
        "favorites/<int:group_id>/<int:blog_ct>/<int:order>/",
        image_views.favoriteAPIView,
        name="favoriteAPI",
    ),
    path("favorites/", image_views.favoriteListAPIView, name="favoriteListAPI"),
    path(
        "favorites/info/",
        image_views.favoriteListInfoAPIView,
        name="favoriteListInfoAPI",
    ),
    path("fav-members/", account_views.favMembersAPIView, name="favMembersAPI"),
    path(
        "survey/pro-plan/", survey_views.proPlanSurveyAPIView, name="proPlanSurveyAPI"
    ),
]
