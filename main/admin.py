from django.contrib import admin
from django.utils.html import format_html

from image.models import Image
from .models import Member, Blog, Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('group_id', 'name', 'domain', 'key', 'is_active')
    list_display_links = ('group_id', 'name',)
    search_fields = ('group_id', 'name', 'domain', 'key',)


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('ct', 'full_kanji', 'belonging_group', 'graduate', 'format_generation', 'format_image',)
    list_display_links = ('ct', 'full_kanji',)
    search_fields = ('ct', 'full_kanji', 'full_kana', 'full_eng',)
    list_filter = ('belonging_group', 'graduate',)

    def format_generation(self, obj):
        if obj.generation is not None:
            return '{}期生'.format(obj.generation)
    format_generation.short_description = '期'
    format_generation.admin_order_field = 'generation'

    def format_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" style="border-radius: 8px" />', obj.image.url)
    format_image.short_description = '宣材写真'
    format_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('ct', 'belonging_group', 'format_image', 'graduate', 'independence', 'temporary', 'generation')}),
        ('名前', {'fields': (
        'last_kanji', 'first_kanji', 'full_kanji', 'last_kana', 'first_kana', 'full_kana', 'last_eng', 'first_eng',
        'full_eng')}),
    )
    readonly_fields = ('format_image',)


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('blog_ct', 'title', 'writer', 'publishing_group', 'post_date', 'num_of_views', 'num_of_downloads', 'format_image')
    list_display_links = ('blog_ct', 'title',)
    ordering = ('-post_date', 'order_for_simul',)
    search_fields = ('title',)
    list_filter = ('publishing_group', 'writer',)
    date_hierarchy = 'post_date'

    def format_image(self, obj):
        images = Image.objects.filter(publisher=obj, order=0)
        if images.exists():
            image = images.first()
            if image.picture_250x:
                return format_html('<img src="{}" width="100" style="border-radius: 8px" />', image.picture_250x.url)
    format_image.short_description = 'サムネイル'
    format_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('blog_ct', 'title', 'format_image', 'text', 'post_date', 'order_for_simul', 'writer', 'publishing_group')}),
        ('スコア', {'fields': (
        'num_of_downloads', 'num_of_most_downloads', 'num_of_views', 'v1_per_day', 'v2_per_day', 'v3_per_day', 'score', 'changed',
        'recommend_score')}),
    )
    readonly_fields = ('format_image',)