from django.urls import path
from api.views.account_views import (
    twitterLoginCallbackView,
    loginView,
    twitterLoginAPIView,
)


app_name = "account"
urlpatterns = [
    path("rest-auth/twitter/", twitterLoginAPIView, name="twitterLoginAPI"),
    path(
        "twitter/login/callback/",
        twitterLoginCallbackView,
        name="twitterLoginCallbackView",
    ),
    path("login/", loginView, name="loginView"),
]
