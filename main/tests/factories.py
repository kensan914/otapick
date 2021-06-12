from django.utils import timezone
from factory.django import DjangoModelFactory
import factory
from factory.fuzzy import FuzzyInteger, FuzzyText, FuzzyFloat

from main.models import Member, Group, MemberKeyword, Blog


class GroupFactory(DjangoModelFactory):
    class Meta:
        model = Group

    group_id = factory.Sequence(int)
    name = FuzzyText(length=30)
    domain = FuzzyText(length=100)
    key = FuzzyText(length=30)
    is_active = True
    blog_list_paginate_by = FuzzyInteger(low=0, high=20)
    blog_list_paginate_by_mobile = FuzzyInteger(low=0, high=20)
    latest_list_paginate_by = FuzzyInteger(low=0, high=12)
    latest_list_paginate_by_mobile = FuzzyInteger(low=0, high=12)
    blog_url_format = FuzzyText(length=200)
    member_url_format = FuzzyText(length=200)


class MemberFactory(DjangoModelFactory):
    class Meta:
        model = Member

    ct = FuzzyText(length=10)
    last_kanji = FuzzyText(length=10)
    first_kanji = FuzzyText(length=10)
    full_kanji = FuzzyText(length=20)
    last_kana = FuzzyText(length=20)
    first_kana = FuzzyText(length=20)
    full_kana = FuzzyText(length=40)
    last_eng = FuzzyText(length=30)
    first_eng = FuzzyText(length=30)
    full_eng = FuzzyText(length=50)
    belonging_group = factory.SubFactory(GroupFactory)
    graduate = True
    independence = True
    temporary = False
    is_other = False
    generation = FuzzyInteger(low=0, high=10)
    image = factory.django.ImageField()


class MemberKeywordFactory(DjangoModelFactory):
    class Meta:
        model = MemberKeyword

    keyword = FuzzyText(length=100)
    member = factory.SubFactory(MemberFactory)


class BlogFactory(DjangoModelFactory):
    class Meta:
        model = Blog

    blog_ct = factory.Sequence(int)
    title = FuzzyText(length=1000)
    text = FuzzyText(length=1000000)
    post_date = timezone.now()
    order_for_simul = 0
    writer = factory.SubFactory(MemberFactory)
    publishing_group = factory.SubFactory(GroupFactory)
    num_of_downloads = FuzzyInteger(low=0)
    num_of_most_downloads = FuzzyInteger(low=0)
    num_of_views = FuzzyInteger(low=0)
    v1_per_day = FuzzyInteger(low=0)
    v2_per_day = FuzzyInteger(low=0)
    v3_per_day = FuzzyInteger(low=0)
    score = FuzzyFloat(low=0)
    changed = False
    recommend_score = FuzzyFloat(low=0)
