from django.contrib import admin
from .models import Member, Blog, Group


# class BlogProfileAdmin(admin.ModelAdmin):
#     raw_id_fields = ('thumbnail',)


admin.site.register(Member)
# admin.site.register(Blog, BlogProfileAdmin)
admin.site.register(Blog)
admin.site.register(Group)
