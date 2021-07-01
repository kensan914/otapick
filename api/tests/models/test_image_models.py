from api.models.account.factories import AccountFactory
from api.models.image.factories import ImageFactory, FavoriteFactory
from api.models.image.models import Image, Favorite
from api.models.main.factories import BlogFactory
from api.tests.models.helpers.ModelTestCase import ModelTestCase


class TestImageModel(ModelTestCase):
    def __init_Model__(self):
        return Image

    def __init_Factory__(self):
        return ImageFactory

    def __init_test_fields__(self):
        return [
            "order",
            "picture",
            "picture_250x",
            "picture_500x",
            "width",
            "height",
            "upload_date",
            "publisher",
            "num_of_downloads",
            "d1_per_day",
            "num_of_views",
            "v1_per_day",
            "v2_per_day",
            "v3_per_day",
            "score",
            "changed",
            "recommend_score",
        ]

    def test_update(self):
        created_image = ImageFactory()

        blog_factory = BlogFactory.create()
        image_factory2 = ImageFactory.build(publisher=blog_factory, changed=True)

        created_image.order = image_factory2.order
        created_image.picture = image_factory2.picture
        created_image.picture_250x = image_factory2.picture_250x
        created_image.picture_500x = image_factory2.picture_500x
        created_image.width = image_factory2.width
        created_image.height = image_factory2.height
        created_image.upload_date = image_factory2.upload_date
        created_image.publisher = image_factory2.publisher
        created_image.num_of_downloads = image_factory2.num_of_downloads
        created_image.d1_per_day = image_factory2.d1_per_day
        created_image.num_of_views = image_factory2.num_of_views
        created_image.v1_per_day = image_factory2.v1_per_day
        created_image.v2_per_day = image_factory2.v2_per_day
        created_image.v3_per_day = image_factory2.v3_per_day
        created_image.score = image_factory2.score
        created_image.changed = image_factory2.changed
        created_image.recommend_score = image_factory2.recommend_score
        created_image.save()

        update_image = Image.objects.first()
        self.assertModel(
            update_image,
            image_factory2,
        )


class TestFavoriteModel(ModelTestCase):
    def __init_Model__(self):
        return Favorite

    def __init_Factory__(self):
        return FavoriteFactory

    def __init_test_fields__(self):
        return [
            "image",
            "user",
            "created_at",
        ]

    def test_update(self):
        created_favorite = FavoriteFactory()

        image_factory = ImageFactory.create()
        account_factory = AccountFactory.create()
        favorite_factory2 = FavoriteFactory.build(
            image=image_factory, user=account_factory
        )

        created_favorite.image = favorite_factory2.image
        created_favorite.user = favorite_factory2.user
        created_favorite.created_at = favorite_factory2.created_at
        created_favorite.save()

        update_favorite = Favorite.objects.first()
        self.assertModel(
            update_favorite,
            favorite_factory2,
        )
