from rest_framework import serializers

from api.models.account.models import Account
from api.models.main.models import Group, Member
from api.serializers.main_serializers import GroupSerializer, MemberSerializer


class AuthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ("username", "email")
        read_only_fields = ("email",)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            "id",
            "username",
            "name",
            "image",
            "image_thumbnail",
            "image_large",
            "fav_groups",
            "fav_member_sakura",
            "fav_member_hinata",
        )

    image = serializers.URLField(source="profile_image_uri")
    image_thumbnail = serializers.URLField(source="profile_image_thumbnail_uri")
    image_large = serializers.URLField(source="profile_image_large_uri")
    fav_groups = GroupSerializer(many=True, read_only=True)
    fav_member_sakura = MemberSerializer(read_only=True)
    fav_member_hinata = MemberSerializer(read_only=True)


class MeSerializer(UserSerializer):
    class Meta:
        model = Account
        fields = (
            "id",
            "username",
            "email",
            "name",
            "image",
            "image_thumbnail",
            "image_large",
            "me",
            "fav_groups",
            "fav_member_sakura",
            "fav_member_hinata",
            "fav_groups_pks",
            "fav_member_sakura_pk",
            "fav_member_hinata_pk",
        )

    # fav_members導入後, serializers.BooleanField(default=True)が動かなくなったので対処
    me = serializers.SerializerMethodField()

    def get_me(self, obj):
        return True

    # fav_members put用
    fav_groups_pks = serializers.PrimaryKeyRelatedField(
        queryset=Group.objects.all(), write_only=True, many=True, allow_null=True
    )
    fav_member_sakura_pk = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(), write_only=True, allow_null=True
    )
    fav_member_hinata_pk = serializers.PrimaryKeyRelatedField(
        queryset=Member.objects.all(), write_only=True, allow_null=True
    )

    def update(self, instance, validated_data):
        instance.fav_groups.set(
            validated_data.get("fav_groups_pks", instance.fav_groups)
        )
        instance.fav_member_sakura = validated_data.get(
            "fav_member_sakura_pk", instance.fav_member_sakura
        )
        instance.fav_member_hinata = validated_data.get(
            "fav_member_hinata_pk", instance.fav_member_hinata
        )
        instance.save()
        return instance


class FavMembersSerializer(serializers.Serializer):
    class FavMembersChildSerializer(serializers.Serializer):
        group_id = serializers.IntegerField(max_value=100)
        ct = serializers.CharField(max_length=4)

    groups = serializers.ListField(child=serializers.IntegerField(), required=False)
    members = serializers.ListField(child=FavMembersChildSerializer(), required=False)

    def create(self, validated_data):
        """
        validated_data: { groups: Group[], members: Member[] }
        return:: { fav_groups_pks: Group.pk[], fav_member_sakura_pk: Member.pk, fav_member_hinata_pk: Member.pk }
        """
        fav_members_data = {
            "fav_groups_pks": [],
            "fav_member_sakura_pk": None,
            "fav_member_hinata_pk": None,
        }

        if "groups" in validated_data and len(validated_data["groups"]) > 0:
            fav_members_data["fav_groups_pks"] = [
                fav_group.pk for fav_group in validated_data["groups"]
            ]

        if "members" in validated_data:
            for fav_member in validated_data["members"]:
                if fav_member.belonging_group.key == "sakura":
                    fav_members_data["fav_member_sakura_pk"] = fav_member.pk
                elif fav_member.belonging_group.key == "hinata":
                    fav_members_data["fav_member_hinata_pk"] = fav_member.pk

        return fav_members_data

    def validate_groups(self, group_ids):
        group_objects = []
        for group_id in group_ids:
            groups = Group.objects.filter(id=group_id)
            if groups.exists():
                group = groups.first()
                group_objects.append(group)
            else:
                raise serializers.ValidationError(
                    "The group with the specified group_id does not exist."
                )

        return group_objects

    def validate_members(self, members_child):
        member_objects = []

        for member_child in members_child:
            members = Member.objects.filter(
                belonging_group__group_id=member_child["group_id"],
                ct=member_child["ct"],
            )
            if members.exists():
                member = members.first()
                member_objects.append(member)
            else:
                raise serializers.ValidationError(
                    "The member with the specified group_id and ct does not exist."
                )

        return member_objects
