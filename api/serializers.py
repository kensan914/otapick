from rest_framework import serializers
from main.models import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        # fields = ['full_kanji', 'full_eng']
        fields = '__all__'
