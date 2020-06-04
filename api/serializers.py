from rest_framework import serializers
from main.models import Member, Blog


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['blog_ct', 'title', 'post_date', 'writer', 'writer_ct', 'num_of_views', 'num_of_downloads', 'thumbnail']

    post_date = serializers.DateTimeField(format='%y/%m/%d')
    writer = serializers.CharField(source='writer.full_kanji')
    writer_ct = serializers.CharField(source='writer.ct')
    thumbnail = serializers.SerializerMethodField()

    def get_thumbnail(self, obj):
        return obj.thumbnail.picture.url if hasattr(obj, 'thumbnail') else '/static/img/imageNotFound.jpg'


class MemberSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['title', 'background_image', 'url']

    title = serializers.CharField(source='full_kanji')
    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        if hasattr(obj, 'image'):
            if obj.image:
                return obj.image.url
        return '/static/img/otapick.png'

    def get_url(self, obj):
        ct = ''
        if obj.independence: ct = obj.ct
        elif obj.belonging_group.group_id == 1: ct = 1002
        elif obj.belonging_group.group_id == 2: ct = 1000
        return '/react/blogs/{}/{}'.format(obj.belonging_group.group_id, ct)


class BlogSerializerVerSS(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'background_image', 'url']

    background_image = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    def get_background_image(self, obj):
        return obj.thumbnail.picture.url if hasattr(obj, 'thumbnail') else '/static/img/imageNotFound.jpg'

    def get_url(self, obj):
        return '/react/blog/{}/{}'.format(obj.writer.belonging_group.group_id, obj.blog_ct)
