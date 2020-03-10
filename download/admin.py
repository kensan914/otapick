from django.contrib import admin
from .models import Image, Progress, Thumbnail


class ImageProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)


class ProgressProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('target',)


class ThumbnailProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)


admin.site.register(Image, ImageProfileAdmin)
admin.site.register(Progress, ProgressProfileAdmin)
admin.site.register(Thumbnail, ThumbnailProfileAdmin)
