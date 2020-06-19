from rest_framework import serializers
import otapick
from image.models import Image
from main.models import Member, Blog


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        exclude = ('id',)
    image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()

    def get_image(self, obj):
        return otapick.generate_memberimage_url(member=obj)

    def get_url(self, obj):
        return otapick.generate_url(member=obj)

    def get_official_url(self, obj):
        return otapick.generate_official_url(member=obj)


class MemberSerializerMin(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['name', 'ct', 'url']
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_name(self, obj):
        return otapick.generate_writer_name(member=obj)

    def get_url(self, obj):
        return otapick.generate_url(member=obj)


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['blog_ct', 'title', 'post_date', 'writer', 'num_of_views', 'num_of_downloads', 'thumbnail', 'url', 'official_url']

    post_date = serializers.DateTimeField(format='%y/%m/%d')
    writer = MemberSerializerMin(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    official_url = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        return otapick.generate_thumbnail_url(blog=obj)

    def get_url(self, obj):
        return otapick.generate_url(blog=obj)

    def get_official_url(self, obj):
        return otapick.generate_official_url(blog=obj)


class BlogSerializerVerDetail(BlogSerializer):
    class Meta:
        model = Blog
        fields = ['blog_ct', 'title', 'post_date', 'writer', 'num_of_views', 'num_of_downloads', 'official_url']

    post_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')


class BlogSerializerVerOrderly(BlogSerializer):
    thumbnail = serializers.SerializerMethodField()
    def get_thumbnail(self, obj):
        if hasattr(obj, 'thumbnail'):
            if Image.objects.filter(publisher=obj, order=0):
                high_thumbnail = Image.objects.get(publisher=obj, order=0)
                return high_thumbnail.picture.url
        return otapick.IMAGE_NOT_FOUND_ORDERLY_URL


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
        return otapick.generate_url(member=obj)


class BlogSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'background_image', 'url']

    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return otapick.generate_thumbnail_url(blog=obj)

    def get_url(self, obj):
        return otapick.generate_url(blog=obj)


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['order', 'url', 'upload_date', 'num_of_downloads', 'd1_per_week',]

    url = serializers.ImageField(source='picture')
    upload_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')
