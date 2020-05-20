from rest_framework import serializers
from main.models import Member, Blog


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        # fields = ['full_kanji', 'full_eng']
        fields = '__all__'


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['blog_ct', 'title', 'post_date', 'writer', 'writer_ct', 'num_of_views', 'num_of_downloads', 'thumbnail']

    post_date = serializers.DateTimeField(format='%y/%m/%d')
    writer = serializers.CharField(source='writer.full_kanji')
    writer_ct = serializers.CharField(source='writer.ct')
    thumbnail = serializers.ImageField(source='thumbnail.picture')
