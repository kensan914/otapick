import uuid
import factory
from django.utils import timezone
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyText, FuzzyInteger
from api.models.account.models import Account
from api.models.main.factories import MemberFactory


class AccountFactory(DjangoModelFactory):
    class Meta:
        model = Account

    id = factory.LazyFunction(uuid.uuid4)
    username = factory.Sequence(lambda n: "%15d" % n)
    email = factory.Sequence(lambda n: "%15d@example.com" % n)
    name = FuzzyText(length=50)
    profile_image_uri = FuzzyText(length=50)
    profile_image_thumbnail_uri = FuzzyText(length=50)
    profile_image_large_uri = FuzzyText(length=50)

    @factory.post_generation
    def fav_groups(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for _fav_group in extracted:
                self.fav_groups.add(_fav_group)

    fav_member_sakura = factory.SubFactory(MemberFactory)
    fav_member_hinata = factory.SubFactory(MemberFactory)
    max_favorite_images_num = FuzzyInteger(low=0)
    is_active = True
    is_staff = False
    is_superuser = False
    date_joined = factory.LazyFunction(timezone.now)
