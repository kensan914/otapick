from api.models.image.factories import ImageFactory
from api.serializers.image_serializers import ImageSerializer
from api.tests.serializers.helpers.SerializerTestCase import SerializerTestCase


class TestImageSerializer(SerializerTestCase):
    def test_output_data(self):
        image_factory = ImageFactory.create()
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
