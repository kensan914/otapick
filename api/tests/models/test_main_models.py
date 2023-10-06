from api.models.main.factories import (
    GroupFactory,
    MemberFactory,
    MemberKeywordFactory,
    BlogFactory,
)
from api.models.main.models import Group, Member, MemberKeyword, Blog
from api.tests.models.helpers.ModelTestCase import ModelTestCase


class TestGroupModel(ModelTestCase):
    def __init_Model__(self):
        return Group

    def __init_Factory__(self):
        return GroupFactory

    def __init_test_fields__(self):
        return [
            "group_id",
            "name",
            "domain",
            "key",
            "is_active",
            "blog_list_paginate_by",
            "blog_list_paginate_by_mobile",
            "latest_list_paginate_by",
            "latest_list_paginate_by_mobile",
            "blog_url_format",
            "member_url_format",
        ]

    def test_update(self):
        created_group = GroupFactory()
        group_factory2 = GroupFactory.build(
            is_active=False,
        )

        created_group.group_id = group_factory2.group_id
        created_group.name = group_factory2.name
        created_group.domain = group_factory2.domain
        created_group.key = group_factory2.key
        created_group.is_active = group_factory2.is_active
        created_group.blog_list_paginate_by = group_factory2.blog_list_paginate_by
        created_group.blog_list_paginate_by_mobile = (
            group_factory2.blog_list_paginate_by_mobile
        )
        created_group.latest_list_paginate_by = group_factory2.latest_list_paginate_by
        created_group.latest_list_paginate_by_mobile = (
            group_factory2.latest_list_paginate_by_mobile
        )
        created_group.blog_url_format = group_factory2.blog_url_format
        created_group.member_url_format = group_factory2.member_url_format
        created_group.save()

        update_group = Group.objects.first()
        self.assertModel(update_group, group_factory2)


class TestMemberModel(ModelTestCase):
    def __init_Model__(self):
        return Member

    def __init_Factory__(self):
        return MemberFactory

    def __init_test_fields__(self):
        return [
            "ct",
            "last_kanji",
            "first_kanji",
            "full_kanji",
            "last_kana",
            "first_kana",
            "full_kana",
            "last_eng",
            "first_eng",
            "full_eng",
            "belonging_group",
            "graduate",
            "independence",
            "temporary",
            "is_other",
            "generation",
            "image",
        ]

    def test_update(self):
        created_member = MemberFactory()
        # MemberFactory.buildでbelonging_groupが作成されないため
        group_factory2 = GroupFactory.create()
        member_factory2 = MemberFactory.build(
            belonging_group=group_factory2,
            graduate=False,
            independence=False,
            temporary=True,
            is_other=True,
        )

        created_member.ct = member_factory2.ct
        created_member.last_kanji = member_factory2.last_kanji
        created_member.first_kanji = member_factory2.first_kanji
        created_member.full_kanji = member_factory2.full_kanji
        created_member.last_kana = member_factory2.last_kana
        created_member.first_kana = member_factory2.first_kana
        created_member.full_kana = member_factory2.full_kana
        created_member.last_eng = member_factory2.last_eng
        created_member.first_eng = member_factory2.first_eng
        created_member.full_eng = member_factory2.full_eng
        created_member.belonging_group = member_factory2.belonging_group
        created_member.graduate = member_factory2.graduate
        created_member.independence = member_factory2.independence
        created_member.temporary = member_factory2.temporary
        created_member.is_other = member_factory2.is_other
        created_member.generation = member_factory2.generation
        created_member.image = member_factory2.image
        created_member.save()

        update_member = Member.objects.first()
        self.assertModel(update_member, member_factory2)


class TestMemberKeywordModel(ModelTestCase):
    def __init_Model__(self):
        return MemberKeyword

    def __init_Factory__(self):
        return MemberKeywordFactory

    def __init_test_fields__(self):
        return [
            "keyword",
            "member",
        ]

    def test_update(self):
        created_member_keyword = MemberKeywordFactory()

        member_factory2 = MemberFactory.create()
        member_keyword_factory2 = MemberKeywordFactory.build(
            member=member_factory2,
        )

        created_member_keyword.keyword = member_keyword_factory2.keyword
        created_member_keyword.member = member_keyword_factory2.member
        created_member_keyword.save()

        update_member_keyword = MemberKeyword.objects.first()
        self.assertModel(
            update_member_keyword,
            member_keyword_factory2,
        )


class TestBlogModel(ModelTestCase):
    def __init_Model__(self):
        return Blog

    def __init_Factory__(self):
        return BlogFactory

    def __init_test_fields__(self):
        return [
            "blog_ct",
            "title",
            "text",
            "post_date",
            "order_for_simul",
            "writer",
            "publishing_group",
            "num_of_downloads",
            "num_of_most_downloads",
            "num_of_views",
            "v1_per_day",
            "v2_per_day",
            "v3_per_day",
            "score",
            "changed",
            "recommend_score",
        ]

    def test_update(self):
        created_blog = BlogFactory()

        member_factory2 = MemberFactory.create()
        group_factory2 = GroupFactory.create()
        blog_factory2 = BlogFactory.build(
            writer=member_factory2,
            publishing_group=group_factory2,
            order_for_simul=1,
            changed=True,
        )

        created_blog.blog_ct = blog_factory2.blog_ct
        created_blog.title = blog_factory2.title
        created_blog.text = blog_factory2.text
        created_blog.post_date = blog_factory2.post_date
        created_blog.order_for_simul = blog_factory2.order_for_simul
        created_blog.writer = blog_factory2.writer
        created_blog.publishing_group = blog_factory2.publishing_group
        created_blog.num_of_downloads = blog_factory2.num_of_downloads
        created_blog.num_of_most_downloads = blog_factory2.num_of_most_downloads
        created_blog.num_of_views = blog_factory2.num_of_views
        created_blog.v1_per_day = blog_factory2.v1_per_day
        created_blog.v2_per_day = blog_factory2.v2_per_day
        created_blog.v3_per_day = blog_factory2.v3_per_day
        created_blog.score = blog_factory2.score
        created_blog.changed = blog_factory2.changed
        created_blog.recommend_score = blog_factory2.recommend_score
        created_blog.save()

        update_blog = Blog.objects.first()
        self.assertModel(update_blog, blog_factory2)
