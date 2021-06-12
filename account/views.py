from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from allauth.account.signals import user_signed_up, user_logged_in
from django.dispatch import receiver
from django.shortcuts import redirect
from django.views import View
from rest_auth.registration.views import SocialLoginView
from rest_auth.social_serializers import TwitterLoginSerializer
from rest_framework import views, permissions, status
from rest_framework.response import Response
import otapick
from account.models import Account
from account.serializers import FavMembersSerializer, MeSerializer, UserSerializer
from urllib.parse import urljoin
import urllib.request
import json
import ssl
from config.settings import (
    CLIENT_SSL_CERT_PATH,
    CLIENT_SSL_KEY_PATH,
    CLIENT_SSL_PASSWORD,
)


class TwitterLoginAPIView(SocialLoginView):
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter


twitterLoginAPIView = TwitterLoginAPIView.as_view()


class TwitterLoginCallbackView(views.APIView):
    def get(self, request, *args, **kwargs):
        if "denied" in self.request.GET:
            # TODO error handle
            return redirect("/")

        oauth_token = self.request.GET.get("oauth_token")
        oauth_verifier = self.request.GET.get("oauth_verifier")
        result = otapick.get_access_token(oauth_token, oauth_verifier)
        q_params = otapick.parse_qsl(result.decode("utf-8"))

        url = urljoin(request._current_scheme_host, "/accounts/rest-auth/twitter/")

        if q_params is None:
            # TODO error handle (result.decode('utf-8'): '現在この機能は一時的にご利用いただけません' ☚アクセスしすぎた？)
            return redirect("/")
        data = {
            "access_token": q_params["oauth_token"],
            "token_secret": q_params["oauth_token_secret"],
        }

        # admin.otapick.com用にクライアント認証
        is_exist_ssl = (
            CLIENT_SSL_CERT_PATH and CLIENT_SSL_KEY_PATH and CLIENT_SSL_PASSWORD
        )
        ssl_ctx = ssl.create_default_context()
        if is_exist_ssl:
            ssl_ctx.load_cert_chain(
                CLIENT_SSL_CERT_PATH, CLIENT_SSL_KEY_PATH, password=CLIENT_SSL_PASSWORD
            )
        req = urllib.request.Request(
            url,
            json.dumps(data).encode(),
            {
                "Content-Type": "application/json",
            },
        )
        try:
            # TODO:admin.otapick.comでアクセスするとなぜか503(メンテ)エラーになる。↓
            with urllib.request.urlopen(
                req, context=ssl_ctx if is_exist_ssl else None
            ) as res:
                res_json = json.loads(res.read())
                status_code = res.getcode()
                if status_code == 200:
                    response = redirect("/")
                    response.set_cookie("token", res_json["token"])
                    return response
        except:
            return redirect("/")

        return redirect("/")


twitterLoginCallbackView = TwitterLoginCallbackView.as_view()


class LoginView(View):
    def get(self, request, *args, **kwargs):
        authorize_uri = otapick.get_authorize_uri(
            scheme_host=otapick.genes_scheme_host_from_host(
                request.META.get("HTTP_HOST")
            )
        )
        if authorize_uri is None:
            return redirect("/")
        return redirect(authorize_uri)


loginView = LoginView.as_view()


@receiver(user_logged_in)
@receiver(user_signed_up)
def retrieve_social_data(request, user, **kwargs):
    """Signal, that gets extra data from social login and put it to profile."""
    social_accounts = SocialAccount.objects.filter(user=user, provider="twitter")
    if social_accounts.exists():
        social_account = social_accounts.first()
        extra_data = social_account.extra_data
        # register name
        user.name = extra_data["name"] if "name" in extra_data else None
        # register profile image uri
        profile_image_uri_collection = otapick.gene_twitter_profile_uri(
            extra_data["profile_image_url_https"]
            if "profile_image_url_https" in extra_data
            else ""
        )
        user.profile_image_uri = profile_image_uri_collection["profile_image_uri"]
        user.profile_image_thumbnail_uri = profile_image_uri_collection[
            "profile_image_thumbnail_uri"
        ]
        user.profile_image_large_uri = profile_image_uri_collection[
            "profile_image_large_uri"
        ]
        user.save()


class MeAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = MeSerializer(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


meAPIView = MeAPIView.as_view()


class UserAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        username = self.kwargs.get("username")
        users = Account.objects.filter(username=username)
        if users.exists():
            user = users.first()
            user_data = UserSerializer(user).data
            return Response(data=user_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


userAPIView = UserAPIView.as_view()


class FavMembersAPIView(views.APIView):
    """
    put data: { groups: int[], members: { group_id: int, ct: str }[], }
    未入力の場合(例えば, 日向のメンバーを指定しなかった場合), nullがsetされ箱推しとなる.
    """

    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        fav_members_serializer = FavMembersSerializer(data=request.data)
        if fav_members_serializer.is_valid():
            fav_members_data = fav_members_serializer.save()
            me_serializer = MeSerializer(
                request.user, data=fav_members_data, partial=True
            )
            if me_serializer.is_valid():
                me_serializer.save()
                return Response(data=me_serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    data=me_serializer.errors, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                data=fav_members_serializer.errors, status=status.HTTP_404_NOT_FOUND
            )


favMembersAPIView = FavMembersAPIView.as_view()
