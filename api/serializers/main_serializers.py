from rest_framework import serializers

from api.models.image.models import Image
from api.models.main.models import Group, Member, Blog
from api.serializers.image_serializers import ImageSerializer
from api.otapick import generate_url, generate_official_url
from api.otapick.extensions.serializers_ex import (
    generate_memberimage_url,
    generate_writer_name,
    generate_thumbnail_url,
    get_thumbnail_wh,
    generate_thumbnail_url_SS,
)
from api.otapick.lib.constants import VIEW_KEY, DOWNLOAD_KEY


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = (
            "group_id",
            "name",
            "domain",
            "key",
            "is_active",
        )


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = (
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
            "url",
            "official_url",
        )

    image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()
    belonging_group = serializers.IntegerField(source="belonging_group.group_id")

    def get_image(self, obj):
        return generate_memberimage_url(member=obj)

    def get_url(self, obj):
        return generate_url(member=obj, needBlogs=True, needImages=True)

    def get_official_url(self, obj):
        return generate_official_url(member=obj)


class MemberSerializerMin(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ("name", "ct", "url", "official_url", "image", "graduate")

    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()

    def get_name(self, obj):
        return generate_writer_name(member=obj)

    def get_url(self, obj):
        return generate_url(member=obj, needBlogs=True, needImages=True)

    def get_official_url(self, obj):
        return generate_official_url(member=obj)


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = (
            "group_id",
            "blog_ct",
            "title",
            "post_date",
            "writer",
            "num_of_views",
            "num_of_downloads",
            "thumbnail",
            "url",
            "official_url",
            "thumbnail_width",
            "thumbnail_height",
        )

    group_id = serializers.IntegerField(source="publishing_group.group_id")
    # post_date = serializers.DateTimeField(format="%y/%m/%d")
    post_date = serializers.SerializerMethodField()
    writer = MemberSerializerMin(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    thumbnail_width = serializers.SerializerMethodField()
    thumbnail_height = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()
    thumbnail_width = serializers.SerializerMethodField()
    thumbnail_height = serializers.SerializerMethodField()

    def get_post_date(self, obj):
        return obj.post_date.strftime("%y/%m/%d")

    def get_thumbnail(self, obj):
        return generate_thumbnail_url(blog=obj)

    def get_thumbnail_width(self, obj):
        w, h = get_thumbnail_wh(blog=obj)
        return w

    def get_thumbnail_height(self, obj):
        w, h = get_thumbnail_wh(blog=obj)
        return h

    def get_url(self, obj):
        return generate_url(blog=obj)

    def get_official_url(self, obj):
        return generate_official_url(blog=obj)


class BlogSerializerVerDetail(BlogSerializer):
    class Meta:
        model = Blog
        fields = [
            "group_id",
            "blog_ct",
            "title",
            "post_date",
            "writer",
            "num_of_views",
            "num_of_downloads",
            "url",
            "official_url",
            "images",
            "view_key",
            "download_key",
        ]

    post_date = serializers.DateTimeField(format="%Y/%m/%d %H:%M")
    # url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    view_key = serializers.SerializerMethodField()
    download_key = serializers.SerializerMethodField()

    # def get_url(self, obj):
    #     return generate_url(blog=obj)

    def get_images(self, obj):
        images = Image.objects.filter(publisher=obj).order_by("order")
        return ImageSerializer(
            images, many=True, context={"me": self.context["me"]}
        ).data

    def get_view_key(self, obj):
        return VIEW_KEY

    def get_download_key(self, obj):
        return DOWNLOAD_KEY


class MemberSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["title", "background_image", "url"]

    title = serializers.CharField(source="full_kanji")
    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return generate_memberimage_url(member=obj)

    def get_url(self, obj):
        return generate_url(member=obj, needBlogs=False, needImages=True)


class BlogSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ["title", "background_image", "url"]

    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return generate_thumbnail_url_SS(blog=obj)

    def get_url(self, obj):
        return generate_url(blog=obj)
