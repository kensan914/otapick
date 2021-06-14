from rest_framework import serializers

from api.models.image.models import Image, Favorite
from api.otapick.extensions.serializers_ex import generate_image_src


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = [
            "src",
            "upload_date",
            "url",
            "order",
            "num_of_downloads",
            "num_of_views",
            "is_favorite",
            "width",
            "height",
        ]

    src = serializers.SerializerMethodField()
    # upload_date = serializers.DateTimeField(format="%Y/%m/%d %H:%M")
    upload_date = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    def get_src(self, obj):
        return generate_image_src(obj)

    def get_upload_date(self, obj):
        return obj.upload_date.strftime("%Y/%m/%d %H:%M")

    def get_url(self, obj):
        return "/image/{}/{}/{}/".format(
            obj.publisher.publishing_group.group_id, obj.publisher.blog_ct, obj.order
        )

    def get_is_favorite(self, obj):
        if "me" in self.context and not self.context["me"].is_anonymous:
            return Favorite.objects.filter(image=obj, user=self.context["me"]).exists()
        else:
            return
