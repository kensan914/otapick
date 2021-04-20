from django.contrib import admin
from django.utils.html import format_html

from account.models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'format_image',)
    list_display_links = ('username', 'name',)
    search_fields = ('username', 'name', 'email')
    filter_horizontal = ('fav_groups',)
    raw_id_fields = ('fav_member_sakura', 'fav_member_hinata')

    def format_image(self, obj):
        if obj.profile_image_uri:
            return format_html('<img src="{}" width="50" style="border-radius: 25px" />', obj.profile_image_uri)
    format_image.short_description = 'プロフィール画像'
    format_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('id', 'username', 'name', 'format_image', 'profile_image_uri', 'profile_image_thumbnail_uri',
                           'profile_image_large_uri', 'fav_groups', 'fav_member_sakura', 'fav_member_hinata', 'max_favorite_images_num')}),
        ('個人情報', {'fields': ('email',)}),
        ('日付', {'fields': ('date_joined', 'last_login',)}),
        ('パーミッション', {'fields': ('is_active', 'is_staff', 'is_superuser',)}),
    )
    readonly_fields = ('id', 'format_image', 'email',)
