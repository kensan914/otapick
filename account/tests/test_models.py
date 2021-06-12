from django.test import TestCase

from account.models import Account
from account.tests import factories as account_factories
from main.tests import factories as main_factories


class TestMemberKeywordModel(TestCase):
    def setUp(self):
        self.account_factory = account_factories.AccountFactory.create()

    def assertAccountModel(self, account1, account2):
        self.assertEquals(account1.id, account2.id, msg="idが正常である")
        self.assertEquals(account1.username, account2.username, msg="usernameが正常である")
        self.assertEquals(account1.email, account2.email, msg="emailが正常である")
        self.assertEquals(account1.name, account2.name, msg="nameが正常である")
        self.assertEquals(
            account1.profile_image_uri,
            account2.profile_image_uri,
            msg="profile_image_uriが正常である",
        )
        self.assertEquals(
            account1.profile_image_thumbnail_uri,
            account2.profile_image_thumbnail_uri,
            msg="profile_image_thumbnail_uriが正常である",
        )
        self.assertEquals(
            account1.profile_image_large_uri,
            account2.profile_image_large_uri,
            msg="profile_image_large_uriが正常である",
        )
        self.assertEquals(
            account1.fav_groups, account2.fav_groups, msg="fav_groupsが正常である"
        )
        self.assertEquals(
            account1.fav_member_sakura,
            account2.fav_member_sakura,
            msg="fav_member_sakuraが正常である",
        )
        self.assertEquals(
            account1.fav_member_hinata,
            account2.fav_member_hinata,
            msg="fav_member_hinataが正常である",
        )
        self.assertEquals(
            account1.max_favorite_images_num,
            account2.max_favorite_images_num,
            msg="max_favorite_images_numが正常である",
        )
        self.assertEquals(account1.is_active, account2.is_active, msg="is_activeが正常である")
        self.assertEquals(account1.is_staff, account2.is_staff, msg="is_staffが正常である")
        self.assertEquals(
            account1.is_superuser, account2.is_superuser, msg="is_superuserが正常である"
        )
        self.assertEquals(
            account1.date_joined, account2.date_joined, msg="date_joinedが正常である"
        )

    def test_create(self):
        """Accountのcreateをテスト"""
        self.assertEquals(Account.objects.all().count(), 1, msg="作成されている")

        created_account = Account.objects.first()
        self.assertAccountModel(created_account, self.account_factory)

    def test_update(self):
        """Accountのupdateをテスト"""
        created_account = Account.objects.first()

        group_factory2 = main_factories.GroupFactory.create()
        member_factory2 = main_factories.MemberFactory.create()
        account_factory2 = account_factories.AccountFactory.build(
            # fav_groups=[group_factory2],
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
        self.assertAccountModel(update_account, account_factory2)
