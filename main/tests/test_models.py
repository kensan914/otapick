from django.test import TestCase
from main.models import Group, Member, MemberKeyword, Blog
from main.tests import factories


class TestGroupModel(TestCase):
    def setUp(self):
        self.group_factory = factories.GroupFactory.create()

    def assertGroupModel(self, group1, group2):
        self.assertEquals(group1.group_id, group2.group_id, msg="group_idが正常である")
        self.assertEquals(group1.name, group2.name, msg="nameが正常である")
        self.assertEquals(group1.domain, group2.domain, msg="domainが正常である")
        self.assertEquals(
            group1.key,
            group2.key,
            msg="keyが正常である",
        )
        self.assertEquals(
            group1.is_active,
            group2.is_active,
            msg="is_activeが正常である",
        )
        self.assertEquals(
            group1.blog_list_paginate_by,
            group2.blog_list_paginate_by,
            msg="blog_list_paginate_byが正常である",
        )
        self.assertEquals(
            group1.blog_list_paginate_by_mobile,
            group2.blog_list_paginate_by_mobile,
            msg="blog_list_paginate_by_mobileが正常である",
        )
        self.assertEquals(
            group1.latest_list_paginate_by,
            group2.latest_list_paginate_by,
            msg="latest_list_paginate_byが正常である",
        )
        self.assertEquals(
            group1.latest_list_paginate_by_mobile,
            group2.latest_list_paginate_by_mobile,
            msg="latest_list_paginate_by_mobileが正常である",
        )
        self.assertEquals(
            group1.blog_url_format,
            group2.blog_url_format,
            msg="blog_url_formatが正常である",
        )
        self.assertEquals(
            group1.member_url_format,
            group2.member_url_format,
            msg="member_url_formatが正常である",
        )

    def test_create(self):
        """Groupのcreateをテスト"""
        self.assertEquals(Group.objects.all().count(), 1, msg="作成されている")

        created_group = Group.objects.first()
        self.assertGroupModel(created_group, self.group_factory)

    def test_update(self):
        """Groupのupdateをテスト"""
        created_group = Group.objects.first()
        group_factory2 = factories.GroupFactory.build(
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
        self.assertGroupModel(update_group, group_factory2)


class TestMemberModel(TestCase):
    def setUp(self):
        self.member_factory = factories.MemberFactory.create()

    def assertMemberModel(self, member1, member2):
        self.assertEquals(member1.ct, member2.ct, msg="ctが正常である")
        self.assertEquals(
            member1.last_kanji, member2.last_kanji, msg="last_kanjiが正常である"
        )
        self.assertEquals(
            member1.first_kanji, member2.first_kanji, msg="first_kanjiが正常である"
        )
        self.assertEquals(
            member1.full_kanji, member2.full_kanji, msg="full_kanjiが正常である"
        )
        self.assertEquals(member1.last_kana, member2.last_kana, msg="last_kanaが正常である")
        self.assertEquals(
            member1.first_kana, member2.first_kana, msg="first_kanaが正常である"
        )
        self.assertEquals(member1.full_kana, member2.full_kana, msg="full_kanaが正常である")
        self.assertEquals(member1.last_eng, member2.last_eng, msg="last_engが正常である")
        self.assertEquals(member1.first_eng, member2.first_eng, msg="first_engが正常である")
        self.assertEquals(member1.full_eng, member2.full_eng, msg="full_engが正常である")
        self.assertEquals(
            member1.belonging_group.group_id,
            member2.belonging_group.group_id,
            msg="belonging_groupが正常である",
        )
        self.assertEquals(member1.graduate, member2.graduate, msg="graduateが正常である")
        self.assertEquals(
            member1.independence, member2.independence, msg="independenceが正常である"
        )
        self.assertEquals(member1.temporary, member2.temporary, msg="temporaryが正常である")
        self.assertEquals(member1.is_other, member2.is_other, msg="is_otherが正常である")
        self.assertEquals(
            member1.generation, member2.generation, msg="generationが正常である"
        )
        self.assertEquals(member1.image, member2.image, msg="imageが正常である")

    def test_create(self):
        """Memberのcreateをテスト"""
        self.assertEquals(Member.objects.all().count(), 1, msg="作成されている")

        created_member = Member.objects.first()
        self.assertMemberModel(created_member, self.member_factory)

    def test_update(self):
        """Memberのupdateをテスト"""
        created_member = Member.objects.first()
        # MemberFactory.buildでbelonging_groupが作成されないため
        group_factory2 = factories.GroupFactory.create()
        member_factory2 = factories.MemberFactory.build(
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
        self.assertMemberModel(update_member, member_factory2)


class TestMemberKeywordModel(TestCase):
    def setUp(self):
        self.member_keyword_factory = factories.MemberKeywordFactory.create()

    def assertMemberKeywordModel(self, memberKeyword1, memberKeyword2):
        self.assertEquals(
            memberKeyword1.keyword, memberKeyword2.keyword, msg="keywordが正常である"
        )
        self.assertEquals(
            memberKeyword1.member.ct, memberKeyword2.member.ct, msg="memberが正常である"
        )

    def test_create(self):
        """MemberKeywordのcreateをテスト"""
        self.assertEquals(MemberKeyword.objects.all().count(), 1, msg="作成されている")

        created_member_keyword = MemberKeyword.objects.first()
        self.assertMemberKeywordModel(
            created_member_keyword, self.member_keyword_factory
        )

    def test_update(self):
        """MemberKeywordのupdateをテスト"""
        created_member_keyword = MemberKeyword.objects.first()

        member_factory2 = factories.MemberFactory.create()
        member_keyword_factory2 = factories.MemberKeywordFactory.build(
            member=member_factory2,
        )

        created_member_keyword.keyword = member_keyword_factory2.keyword
        created_member_keyword.member = member_keyword_factory2.member
        created_member_keyword.save()

        update_member_keyword = MemberKeyword.objects.first()
        self.assertMemberKeywordModel(update_member_keyword, member_keyword_factory2)


class TestBlogModel(TestCase):
    def setUp(self):
        self.blog_factory = factories.BlogFactory.create()

    def assertBlogModel(self, blog1, blog2):
        self.assertEquals(blog1.blog_ct, blog2.blog_ct, msg="blog_ctが正常である")
        self.assertEquals(blog1.title, blog2.title, msg="titleが正常である")
        self.assertEquals(blog1.text, blog2.text, msg="textが正常である")
        self.assertEquals(blog1.post_date, blog2.post_date, msg="post_dataが正常である")
        self.assertEquals(
            blog1.order_for_simul, blog2.order_for_simul, msg="order_for_simulが正常である"
        )
        self.assertEquals(blog1.writer.ct, blog2.writer.ct, msg="writerが正常である")
        self.assertEquals(
            blog1.publishing_group.group_id,
            blog2.publishing_group.group_id,
            msg="publishing_groupが正常である",
        )
        self.assertEquals(
            blog1.num_of_downloads, blog2.num_of_downloads, msg="num_of_downloadsが正常である"
        )
        self.assertEquals(
            blog1.num_of_most_downloads,
            blog2.num_of_most_downloads,
            msg="num_of_most_downloadsが正常である",
        )
        self.assertEquals(
            blog1.num_of_views, blog2.num_of_views, msg="num_of_viewsが正常である"
        )
        self.assertEquals(blog1.v1_per_day, blog2.v1_per_day, msg="v1_per_dayが正常である")
        self.assertEquals(blog1.v2_per_day, blog2.v2_per_day, msg="v2_per_dayが正常である")

        self.assertEquals(blog1.v3_per_day, blog2.v3_per_day, msg="v3_per_dayが正常である")
        self.assertEquals(blog1.score, blog2.score, msg="scoreが正常である")
        self.assertEquals(blog1.changed, blog2.changed, msg="changedが正常である")
        self.assertEquals(
            blog1.recommend_score, blog2.recommend_score, msg="recommend_scoreが正常である"
        )

    def test_create(self):
        """Blogのcreateをテスト"""
        self.assertEquals(Blog.objects.all().count(), 1, msg="作成されている")

        created_blog = Blog.objects.first()
        self.assertBlogModel(created_blog, self.blog_factory)

    def test_update(self):
        """Blogのupdateをテスト"""
        created_blog = Blog.objects.first()

        member_factory2 = factories.MemberFactory.create()
        group_factory2 = factories.GroupFactory.create()
        blog_factory2 = factories.BlogFactory.build(
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
        self.assertBlogModel(update_blog, blog_factory2)
