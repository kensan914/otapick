from api.models.account.factories import AccountFactory
from api.serializers.account_serializers import (
    AuthSerializer,
    UserSerializer,
    MeSerializer,
)
from api.serializers.main_serializers import GroupSerializer, MemberSerializer
from api.tests.serializers.helpers.SerializerTestCase import SerializerTestCase


class TestAuthSerializer(SerializerTestCase):
    def test_output_data(self):
        account_factory = AccountFactory.create()
        serializer_data = AuthSerializer(account_factory).data

        expected_output_data = {
            "username": account_factory.username,
            "email": account_factory.email,
        }

        self.assertSerializerData(serializer_data, expected_output_data)


class TestUserSerializer(SerializerTestCase):
    def test_output_data(self):
        account_factory = AccountFactory.create()
        serializer_data = UserSerializer(account_factory).data

        expected_output_data = {
            "id": str(account_factory.id),
            "username": account_factory.username,
            "name": account_factory.name,
            "image": account_factory.profile_image_uri,
            "image_thumbnail": account_factory.profile_image_thumbnail_uri,
            "image_large": account_factory.profile_image_large_uri,
            "fav_groups": GroupSerializer(account_factory.fav_groups, many=True).data,
            "fav_member_sakura": MemberSerializer(
                account_factory.fav_member_sakura
            ).data,
            "fav_member_hinata": MemberSerializer(
                account_factory.fav_member_hinata
            ).data,
        }

        self.assertSerializerData(serializer_data, expected_output_data)


class TestMeSerializer(SerializerTestCase):
    def test_output_data(self):
        account_factory = AccountFactory.create()
        serializer_data = MeSerializer(account_factory).data

        expected_output_data = {
            "id": str(account_factory.id),
            "username": account_factory.username,
            "email": account_factory.email,
            "name": account_factory.name,
            "image": account_factory.profile_image_uri,
            "image_thumbnail": account_factory.profile_image_thumbnail_uri,
            "image_large": account_factory.profile_image_large_uri,
            "me": True,
            "fav_groups": GroupSerializer(account_factory.fav_groups, many=True).data,
            "fav_member_sakura": MemberSerializer(
                account_factory.fav_member_sakura
            ).data,
            "fav_member_hinata": MemberSerializer(
                account_factory.fav_member_hinata
            ).data,
        }

        self.assertSerializerData(serializer_data, expected_output_data)


class TestFavMembersSerializer(SerializerTestCase):
    pass
