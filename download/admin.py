from django.contrib import admin
from .models import Image, Progress


class ImageProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)


class ProgressProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('target',)


admin.site.register(Image, ImageProfileAdmin)
admin.site.register(Progress, ProgressProfileAdmin)
