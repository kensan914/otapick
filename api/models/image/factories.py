import factory
from django.utils import timezone
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyInteger, FuzzyFloat
from api.models.account.factories import AccountFactory
from api.models.image.models import Image, Favorite
from api.models.main.factories import BlogFactory


class ImageFactory(DjangoModelFactory):
    class Meta:
        model = Image

    order = FuzzyInteger(low=0)
    picture = factory.django.ImageField()
    picture_250x = factory.django.ImageField()
    picture_500x = factory.django.ImageField()
    width = FuzzyInteger(low=0)
    height = FuzzyInteger(low=0)
    upload_date = timezone.now()
    publisher = factory.SubFactory(BlogFactory)
    num_of_downloads = FuzzyInteger(low=0)
    d1_per_day = FuzzyInteger(low=0)
    num_of_views = FuzzyInteger(low=0)
    v1_per_day = FuzzyInteger(low=0)
    v2_per_day = FuzzyInteger(low=0)
    v3_per_day = FuzzyInteger(low=0)
    score = FuzzyFloat(low=0)
    changed = False
    recommend_score = FuzzyFloat(low=0)


class FavoriteFactory(DjangoModelFactory):
    class Meta:
        model = Favorite

    image = factory.SubFactory(ImageFactory)
    user = factory.SubFactory(AccountFactory)
    created_at = timezone.now()
