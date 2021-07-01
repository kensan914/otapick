from django.urls import path, include, re_path
import dist.redirect
from config import settings
from django.views.static import serve


urlpatterns = [
    path("api/", include("api.urls")),
    path("accounts/", include("api.urls.account_urls")),
    # past URL
    path(
        "search/group/blog/<int:group_id>/",
        dist.redirect.redirectBlogsGView,
        name="redirectBlogsGView",
    ),
    path(
        "search/member/blog/<int:group_id>/<str:ct>/",
        dist.redirect.redirectBlogsMView,
        name="redirectBlogsMView",
    ),
    path(
        "download/<int:group_id>/<int:blog_ct>/<int:order>/",
        dist.redirect.redirectImageView,
        name="redirectImageView",
    ),
    path(
        "search/member/",
        dist.redirect.redirectMembersView,
        name="redirectMembersView",
    ),
    re_path(r"^media/(?P<path>.*)$", serve, {"document_root": settings.MEDIA_ROOT}),
]
