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
        return otapick.generate_url(member=obj, needBlogs=True, needImages=True)

    def get_official_url(self, obj):
        return otapick.generate_official_url(member=obj)


class MemberSerializerMin(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['name', 'ct', 'url', 'official_url', 'image']
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
        fields = ['group_id', 'blog_ct', 'title', 'post_date', 'writer', 'num_of_views', 'num_of_downloads', 'thumbnail', 'url', 'official_url', ]

    group_id = serializers.IntegerField(source='writer.belonging_group.group_id')
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
        fields = ['blog_ct', 'title', 'post_date', 'writer', 'num_of_views', 'num_of_downloads', 'official_url', 'url']

    post_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')
    url = serializers.SerializerMethodField()

    def get_url(self, obj):
        return otapick.generate_url(blog=obj)


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
        fields = ['src', 'upload_date', 'url', 'order', 'num_of_downloads', 'num_of_views',]

    src = serializers.SerializerMethodField()
    upload_date = serializers.DateTimeField(format='%Y/%m/%d %H:%M')
    url = serializers.SerializerMethodField()

    def get_src(self, obj):
        return otapick.generate_image_src(obj)

    def get_url(self, obj):
        return '/image/{}/{}/{}'.format(obj.publisher.writer.belonging_group.group_id, obj.publisher.blog_ct, obj.order)