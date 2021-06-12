from django.test import TestCase

from api.serializers import (
    GroupSerializer,
    MemberSerializer,
    BlogSerializer,
    MemberSerializerMin,
    ImageSerializer,
)
from main.tests import factories as main_factories
from image.tests import factories as image_factories


class SerializerTestCase(TestCase):
    def assertSerializerData(self, serializer_data, expected_data):
        self.assertCountEqual(
            serializer_data.keys(), expected_data.keys(), msg="dictのkeyが正常である"
        )
        for expected_key in expected_data.keys():
            with self.subTest(f"{expected_key}が正常である"):
                self.assertEquals(
                    serializer_data[expected_key],
                    expected_data[expected_key],
                    msg=f"{expected_key}が正常である",
                )


class TestGroupSerializer(SerializerTestCase):
    def test_output_data(self):
        group_factory = main_factories.GroupFactory.create()
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
        member_factory = main_factories.MemberFactory.create()
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
        blog_factory = main_factories.BlogFactory.create()
        thumbnail = image_factories.ImageFactory.create(publisher=blog_factory, order=0)
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


class TestImageSerializer(SerializerTestCase):
    def test_output_data(self):
        image_factory = image_factories.ImageFactory.create()
        serializer_data = ImageSerializer(image_factory).data

        expected_output_data = {
            "src": {
                "originals": image_factory.picture.url,
                "250x": image_factory.picture_250x.url,
                "500x": image_factory.picture_500x.url,
            },
            "upload_date": image_factory.upload_date.strftime("%Y/%m/%d %H:%M"),
            "url": f"/image/{image_factory.publisher.publishing_group.group_id}/{image_factory.publisher.blog_ct}/{image_factory.order}/",
            "order": image_factory.order,
            "num_of_downloads": image_factory.num_of_downloads,
            "num_of_views": image_factory.num_of_views,
            "is_favorite": None,
            "width": image_factory.width,
            "height": image_factory.height,
        }

        self.assertSerializerData(serializer_data, expected_output_data)
