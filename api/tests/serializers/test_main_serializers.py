from api.models.image.factories import ImageFactory
from api.models.main.factories import GroupFactory, MemberFactory, BlogFactory
from api.serializers.main_serializers import (
    GroupSerializer,
    MemberSerializer,
    BlogSerializer,
    MemberSerializerMin,
)
from api.tests.serializers.helpers.SerializerTestCase import SerializerTestCase


class TestGroupSerializer(SerializerTestCase):
    def test_output_data(self):
        group_factory = GroupFactory.create()
        serializer_data = GroupSerializer(group_factory).data

        expected_output_data = {
            "group_id": group_factory.group_id,
            "name": group_factory.name,
            "domain": group_factory.domain,
            "key": group_factory.key,
            "is_active": group_factory.is_active,
        }

        self.assertSerializerData(serializer_data, expected_output_data)


class TestMemberSerializer(SerializerTestCase):
    def test_output_data(self):
        member_factory = MemberFactory.create()
        serializer_data = MemberSerializer(member_factory).data

        expected_output_data = {
            "ct": member_factory.ct,
            "last_kanji": member_factory.last_kanji,
            "first_kanji": member_factory.first_kanji,
            "full_kanji": member_factory.full_kanji,
            "last_kana": member_factory.last_kana,
            "first_kana": member_factory.first_kana,
            "full_kana": member_factory.full_kana,
            "last_eng": member_factory.last_eng,
            "first_eng": member_factory.first_eng,
            "full_eng": member_factory.full_eng,
            "belonging_group": member_factory.belonging_group.group_id,
            "graduate": member_factory.graduate,
            "independence": member_factory.independence,
            "temporary": member_factory.temporary,
            "is_other": member_factory.is_other,
            "generation": member_factory.generation,
            "image": member_factory.image.url,
            "url": {
                "blogs": f"/blogs/{member_factory.belonging_group.group_id}/{member_factory.ct}/",
                "images": f"/images/{member_factory.belonging_group.group_id}/{member_factory.ct}/",
            },
            "official_url": member_factory.belonging_group.member_url_format.format(
                member_factory.ct
            ),
        }

        self.assertSerializerData(serializer_data, expected_output_data)


class TestBlogSerializer(SerializerTestCase):
    def test_output_data(self):
        blog_factory = BlogFactory.create()
        thumbnail = ImageFactory.create(publisher=blog_factory, order=0)
        serializer_data = BlogSerializer(blog_factory).data

        expected_output_data = {
            "group_id": blog_factory.publishing_group.group_id,
            "blog_ct": blog_factory.blog_ct,
            "title": blog_factory.title,
            "post_date": blog_factory.post_date.strftime("%y/%m/%d"),
            "writer": MemberSerializerMin(blog_factory.writer).data,
            "num_of_views": blog_factory.num_of_views,
            "num_of_downloads": blog_factory.num_of_downloads,
            "thumbnail": {
                "originals": thumbnail.picture.url,
                "250x": thumbnail.picture_250x.url,
                "500x": thumbnail.picture_500x.url,
            },
            "url": f"/blog/{blog_factory.publishing_group.group_id}/{blog_factory.blog_ct}/",
            "official_url": blog_factory.publishing_group.blog_url_format.format(
                blog_factory.blog_ct
            ),
            "thumbnail_width": thumbnail.width,
            "thumbnail_height": thumbnail.height,
        }

        self.assertSerializerData(serializer_data, expected_output_data)
