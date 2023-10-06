from django.urls import path
import dist.views

# for OGP
urlpatterns = [
    path(
        "blog/<int:group_id>/<int:blog_ct>/",
        dist.views.indexBlogDetailView,
        name="indexBlogDetailAPI",
    ),
    path(
        "image/<int:group_id>/<int:blog_ct>/<int:order>/",
        dist.views.indexImageDetailView,
        name="indexImageDetailAPI",
    ),
]
