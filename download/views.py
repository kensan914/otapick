from django.shortcuts import render
from top.views import BaseView
from search.models import Blog, Member
from .models import Image


class DownloadView(BaseView):
    html_path = 'download/otapick_download.html'

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        writer_belonging = Member.objects.filter(belonging_group__group_id=group_id)
        blog = Blog.objects.get(writer__in=writer_belonging, blog_ct=blog_ct)
        blog_images = Image.objects.filter(publisher=blog).order_by('order')
        self.context = {
            'blog': blog,
            'blog_images': blog_images,
        }
        return render(request, self.html_path, self.context)


download = DownloadView.as_view()