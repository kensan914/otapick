from django.contrib import admin
from django.utils.html import format_html
from .models import Image, Favorite


@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)
    list_display = ('format_image', 'order', 'format_title', 'format_member', 'format_group', 'num_of_views', 'num_of_downloads',)
    list_display_links = ('format_image',)
    search_fields = ('publisher__title',)
    list_filter = ('publisher__publishing_group', 'publisher__writer',)
    date_hierarchy = 'publisher__post_date'

    def format_title(self, obj):
        if obj.publisher.title is not None:
            return obj.publisher.title
    format_title.short_description = '掲載ブログ'
    format_title.admin_order_field = 'publisher'

    def format_member(self, obj):
        if obj.publisher.writer is not None:
            return obj.publisher.writer
    format_member.short_description = 'メンバー'

    def format_group(self, obj):
        if obj.publisher.publishing_group is not None:
            return obj.publisher.publishing_group
    format_group.short_description = '掲載グループ'

    def format_image(self, obj):
        if obj.picture_250x:
            return format_html('<img src="{}" width="100" style="border-radius: 8px" />', obj.picture_250x.url)
    format_image.short_description = '画像'
    format_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('order', 'format_image', 'picture', 'picture_250x', 'picture_500x', 'publisher')}),
        ('スコア', {'fields': (
        'num_of_downloads', 'd1_per_day', 'num_of_views', 'v1_per_day', 'v2_per_day', 'v3_per_day', 'score', 'changed',
        'recommend_score')}),
    )
    readonly_fields = ('format_image',)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    raw_id_fields = ('image', 'user',)
    list_display = ('format_image', 'format_user_username', 'format_user_name', 'format_user_image', 'created_at',)
    list_display_links = ('format_image',)
    list_filter = ('image__publisher__publishing_group', 'image__publisher__writer',)
    date_hierarchy = 'created_at'

    def format_image(self, obj):
        if obj.image.picture_250x:
            return format_html('<img src="{}" width="100" style="border-radius: 8px" />', obj.image.picture_250x.url)
    format_image.short_description = '画像'
    format_image.empty_value_display = 'No image'

    def format_user_username(self, obj):
        if obj.user.username is not None:
            return obj.user.username
    format_user_username.short_description = 'ユーザネーム'

    def format_user_name(self, obj):
        if obj.user.name is not None:
            return obj.user.name
    format_user_name.short_description = 'ユーザ名前'

    def format_user_image(self, obj):
        if obj.user.profile_image_uri:
            return format_html('<img src="{}" width="50" style="border-radius: 25px" />', obj.user.profile_image_uri)
    format_user_image.short_description = 'プロフィール画像'
    format_user_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('created_at',)}),
        ('画像', {'fields': ('format_image', 'image')}),
        ('ユーザ', {'fields': ('format_user_image', 'user')}),
    )
    readonly_fields = ('created_at', 'format_image', 'format_user_image')
