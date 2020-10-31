import requests
from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.twitter.views import TwitterOAuthAdapter
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.shortcuts import redirect
from django.views import View
from rest_auth.registration.views import SocialLoginView
from rest_auth.social_serializers import TwitterLoginSerializer
from rest_framework import views, permissions, status
from rest_framework.response import Response
import otapick
from account.models import Account
from account.serializers import MeSerializer, UserSerializer


class TwitterLoginAPIView(SocialLoginView):
    serializer_class = TwitterLoginSerializer
    adapter_class = TwitterOAuthAdapter


twitterLoginAPIView = TwitterLoginAPIView.as_view()


class TwitterLoginCallbackView(views.APIView):
    def get(self, request, *args, **kwargs):
        if 'denied' in self.request.GET:
            # TODO error
            return redirect('indexView')

        oauth_token = self.request.GET.get('oauth_token')
        oauth_verifier = self.request.GET.get('oauth_verifier')

        result = otapick.get_access_token(oauth_token, oauth_verifier)
        q_params = otapick.parse_qsl(result.decode('utf-8'))

        url = otapick.OTAPICK_URL + '/accounts/rest-auth/twitter/'
        data = {'access_token': q_params['oauth_token'], 'token_secret': q_params['oauth_token_secret']}
        res_twitterLoginAPI = requests.post(url, json=data)

        if res_twitterLoginAPI.status_code == 200:
            response = redirect('indexView')
            response.set_cookie('token', res_twitterLoginAPI.json()['token'])
            return response
        else:
            # TODO error
            return redirect('indexView')


twitterLoginCallbackView = TwitterLoginCallbackView.as_view()


class LoginView(View):
    def get(self, request, *args, **kwargs):
        authorize_uri = otapick.get_authorize_uri()
        if authorize_uri is None:
            return redirect('indexView')
        return redirect(authorize_uri)


loginView = LoginView.as_view()


@receiver(user_signed_up)
def retrieve_social_data(request, user, **kwargs):
    """Signal, that gets extra data from social login and put it to profile."""
    social_accounts = SocialAccount.objects.filter(user=user, provider='twitter')
    if social_accounts.exists():
        social_account = social_accounts.first()
        extra_data = social_account.extra_data
        # register name
        user.name = extra_data['name'] if 'name' in extra_data else None
        # register profile image uri
        user.profile_image_uri = extra_data['profile_image_url_https'] if 'profile_image_url_https' in extra_data else None
        user.save()


class MeAPIView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = MeSerializer(request.user)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


meAPIView = MeAPIView.as_view()


class UserAPIView(views.APIView):
    def get(self, request, *args, **kwargs):
        username = self.kwargs.get('username')
        users = Account.objects.filter(username=username)
        if users.exists():
            user = users.first()
            user_data = UserSerializer(user).data
            return Response(data=user_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)


userAPIView = UserAPIView.as_view()
