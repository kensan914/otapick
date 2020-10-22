from django.contrib import admin
from .models import Image


class ImageProfileAdmin(admin.ModelAdmin):
    raw_id_fields = ('publisher',)


admin.site.register(Image, ImageProfileAdmin)
