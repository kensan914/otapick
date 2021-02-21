from django.contrib import admin
from .models import Image, Favorite


class ImageAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)


class FavoriteAdmin(admin.ModelAdmin):
    raw_id_fields = ('image', 'user',)


admin.site.register(Image, ImageAdmin)
admin.site.register(Favorite, FavoriteAdmin)
