from django.db.models import fields
from rest_framework import serializers
import otapick
from image.models import Image, Favorite
from main.models import Group, Member, Blog


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('group_id', 'name', 'domain', 'key', 'is_active', )


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        exclude = ('id',)
    image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()
    belonging_group = serializers.IntegerField(
        source='belonging_group.group_id')

    def get_image(self, obj):
        return otapick.generate_memberimage_url(member=obj)

    def get_url(self, obj):
        return otapick.generate_url(member=obj, needBlogs=True, needImages=True)

    def get_official_url(self, obj):
        return otapick.generate_official_url(member=obj)


class MemberSerializerMin(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['name', 'ct', 'url', 'official_url', 'image', 'graduate']
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()

    def get_name(self, obj):
        return otapick.generate_writer_name(member=obj)

    def get_url(self, obj):
        return otapick.generate_url(member=obj, needBlogs=True, needImages=True)

    def get_official_url(self, obj):
        return otapick.generate_official_url(member=obj)


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['group_id', 'blog_ct', 'title', 'post_date', 'writer',
                  'num_of_views', 'num_of_downloads', 'thumbnail', 'url', 'official_url', 'thumbnail_width', 'thumbnail_height']

    group_id = serializers.IntegerField(source='publishing_group.group_id')
    post_date = serializers.DateTimeField(format='%y/%m/%d')
    writer = MemberSerializerMin(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    thumbnail_width = serializers.SerializerMethodField()
    thumbnail_height = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()
    thumbnail_width = serializers.SerializerMethodField()
    thumbnail_height = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        return otapick.generate_thumbnail_url(blog=obj)

    def get_thumbnail_width(self, obj):
        w, h = otapick.get_thumbnail_wh(blog=obj)
        return w

    def get_thumbnail_height(self, obj):
        w, h = otapick.get_thumbnail_wh(blog=obj)
        return h

    def get_url(self, obj):
        return otapick.generate_url(blog=obj)

    def get_official_url(self, obj):
        return otapick.generate_official_url(blog=obj)


class BlogSerializerVerDetail(BlogSerializer):
    class Meta:
        model = Blog
        fields = ['group_id', 'blog_ct', 'title', 'post_date', 'writer', 'num_of_views',
                  'num_of_downloads', 'url', 'official_url', 'images', 'VIEW_KEY', 'DOWNLOAD_KEY']

    post_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')
    # url = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    VIEW_KEY = serializers.SerializerMethodField()
    DOWNLOAD_KEY = serializers.SerializerMethodField()

    # def get_url(self, obj):
    #     return otapick.generate_url(blog=obj)

    def get_images(self, obj):
        images = Image.objects.filter(publisher=obj).order_by('order')
        return ImageSerializer(images, many=True, context={'me': self.context['me']}).data

    def get_VIEW_KEY(self, obj):
        return otapick.VIEW_KEY

    def get_DOWNLOAD_KEY(self, obj):
        return otapick.DOWNLOAD_KEY


class MemberSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['title', 'background_image', 'url']

    title = serializers.CharField(source='full_kanji')
    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return otapick.generate_memberimage_url(member=obj)

    def get_url(self, obj):
        return otapick.generate_url(member=obj, needBlogs=False, needImages=True)


class BlogSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'background_image', 'url']

    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return otapick.generate_thumbnail_url_SS(blog=obj)

    def get_url(self, obj):
        return otapick.generate_url(blog=obj)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['src', 'upload_date', 'url', 'order', 'num_of_downloads',
                  'num_of_views', 'is_favorite', 'width', 'height']

    src = serializers.SerializerMethodField()
    upload_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')
    url = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    def get_src(self, obj):
        return otapick.generate_image_src(obj)

    def get_url(self, obj):
        return '/image/{}/{}/{}/'.format(obj.publisher.publishing_group.group_id, obj.publisher.blog_ct, obj.order)

    def get_is_favorite(self, obj):
        if 'me' in self.context and not self.context['me'].is_anonymous:
            return Favorite.objects.filter(image=obj, user=self.context['me']).exists()
        else:
            return
