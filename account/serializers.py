from rest_framework import serializers
from account.models import Account


class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username', 'email')
        read_only_fields = ('email', )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'username', 'name', 'image')

    image = serializers.URLField(source='profile_image_uri')


class MeSerializer(UserSerializer):
    class Meta:
        model = Account
        fields = ('id', 'username', 'email', 'name', 'image', 'me')

    me = serializers.BooleanField(default=True)
