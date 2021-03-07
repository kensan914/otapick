from django.contrib import admin
from django.utils.html import format_html

from account.models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'name', 'email', 'format_image',)
    list_display_links = ('username', 'name',)
    search_fields = ('username', 'name', 'email')

    def format_image(self, obj):
        if obj.profile_image_uri:
            return format_html('<img src="{}" width="50" style="border-radius: 25px" />', obj.profile_image_uri)
    format_image.short_description = 'プロフィール画像'
    format_image.empty_value_display = 'No image'

    fieldsets = (
        (None, {'fields': ('id', 'username', 'name', 'format_image', 'profile_image_uri',)}),
        ('個人情報', {'fields': ('email',)}),
        ('日付', {'fields': ('date_joined', 'last_login',)}),
        ('パーミッション', {'fields': ('is_active', 'is_staff', 'is_superuser',)}),
    )
    readonly_fields = ('id', 'format_image', 'email',)
