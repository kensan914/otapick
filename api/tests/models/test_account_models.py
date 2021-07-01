from api.models.account.factories import AccountFactory
from api.models.account.models import Account
from api.models.main.factories import MemberFactory, GroupFactory
from api.tests.models.helpers.ModelTestCase import ModelTestCase


class TestAccountModel(ModelTestCase):
    def __init_Model__(self):
        return Account

    def __init_Factory__(self):
        return AccountFactory

    def __init_test_fields__(self):
        return [
            "id",
            "username",
            "email",
            "name",
            "profile_image_uri",
            "profile_image_thumbnail_uri",
            "profile_image_large_uri",
            "fav_groups",
            "fav_member_sakura",
            "fav_member_hinata",
            "max_favorite_images_num",
            "is_active",
            "is_staff",
            "is_superuser",
            "date_joined",
        ]

    def test_update(self):
        created_account = AccountFactory()

        group_factory2 = GroupFactory.create()
        member_factory2 = MemberFactory.create()
        account_factory2 = AccountFactory.build(
            fav_member_sakura=member_factory2,
            fav_member_hinata=member_factory2,
            is_active=False,
            is_staff=True,
            is_superuser=True,
        )
        account_factory2.fav_groups.set([group_factory2])

        created_account.id = account_factory2.id
        created_account.username = account_factory2.username
        created_account.email = account_factory2.email
        created_account.name = account_factory2.name
        created_account.profile_image_uri = account_factory2.profile_image_uri
        created_account.profile_image_thumbnail_uri = (
            account_factory2.profile_image_thumbnail_uri
        )
        created_account.profile_image_large_uri = (
            account_factory2.profile_image_large_uri
        )
        created_account.fav_groups.set([group_factory2])
        created_account.fav_member_sakura = account_factory2.fav_member_sakura
        created_account.fav_member_hinata = account_factory2.fav_member_hinata
        created_account.max_favorite_images_num = (
            account_factory2.max_favorite_images_num
        )
        created_account.is_active = account_factory2.is_active
        created_account.is_staff = account_factory2.is_staff
        created_account.is_superuser = account_factory2.is_superuser
        created_account.date_joined = account_factory2.date_joined
        created_account.save()

        update_account = Account.objects.first()
        self.assertModel(update_account, account_factory2)
