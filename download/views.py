import os
from urllib.parse import urlparse
from django.shortcuts import render
from django.views import View
from config import settings
from download.imgScraper import update
from download.scripts.downloadViewFunc import render_progress, \
    increment_num_of_downloads, edit_num_of_most_downloads, preparate_download_view, render_progress_ajax, \
    recreate_progress
from search.models import Blog
from top.views import BaseView
from .models import Image, Progress
from django.http import HttpResponse, Http404, FileResponse
import zipfile
from search.scripts.searchViewFunc import get_blog


class DownloadView(BaseView):
    html_path = 'download/download.html'

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)

        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        blog = get_blog(group_id, blog_ct)

        if Progress.objects.filter(target=blog).exists():
            progress = Progress.objects.get(target=blog)
        else:
            progress = None

        # Check download_status
        # When you first access the blog
        if progress is None:
            download_status = 'start'
            progress = Progress.objects.create(target=blog)
            update.delay(progress.id, group_id, blog_ct, blog.writer.ct)
        # When you not first access the blog, and that progress is incomplete
        elif not Progress.objects.get(target=blog).ready:
            download_status = 'doing'
            if progress.num >= 100:
                progress.ready = True
                progress.save()
        # When the progress of the blog is complete
        else:
            download_status = 'done'

        # When access by ajax or pjax
        if request.is_ajax():
            function_name = request.GET.get('func')

            if function_name is None:
                if download_status == 'start':
                    return render_progress_ajax(request, blog.title, group_id, blog_ct, blog.writer.full_kanji, self.context)
                elif download_status == 'doing':
                    if progress.num == 0:
                        return recreate_progress(request, progress, blog, group_id, blog_ct, self.context, is_ajax=True)
                    return render_progress_ajax(request, blog.title, group_id, blog_ct, blog.writer.full_kanji, self.context)
                elif download_status == 'done':
                    preparate_download_view(self, group_id, blog, blog_ct, is_ajax=True)
                    return render(request, self.html_path, self.context)

            elif function_name == 'get_progress_num':
                if download_status == 'start':
                    return HttpResponse(str(0))
                elif download_status == 'doing' or download_status == 'done':
                    return HttpResponse(str(progress.num))

            elif function_name == 'view_download':
                if download_status == 'done':
                    preparate_download_view(self, group_id, blog, blog_ct, is_ajax=True)
                    return render(request, self.html_path, self.context)
        # When direct access
        else:
            referer = request.environ.get('HTTP_REFERER')
            referer_url = urlparse(referer)
            historyBackIsToTop = referer is None or not str(referer_url.netloc).startswith(settings.env('ALLOWED_HOSTS'))
            if download_status == 'start':
                return render_progress(request, progress, group_id, blog_ct, blog.title, blog.writer.full_kanji, historyBackIsToTop, self.context)
            elif download_status == 'doing':
                if progress.num == 0:
                    return recreate_progress(request, progress, blog, group_id, blog_ct, self.context, historyBackIsToTop=historyBackIsToTop, is_ajax=False)
                return render_progress(request, progress, group_id, blog_ct, blog.title, blog.writer.full_kanji, historyBackIsToTop, self.context)
            elif download_status == 'done':
                preparate_download_view(self, group_id, blog, blog_ct, is_ajax=False)
                self.context['historyBackIsToTop'] = historyBackIsToTop
                return render(request, self.html_path, self.context)

        # Not applicable
        raise Http404("Sorry.This blog is not found.")


    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        file_pks = request.POST.getlist('zip')
        upload_images = Image.objects.filter(pk__in=file_pks)

        if len(upload_images) < 1:
            raise Http404("Sorry.Please select at least one image.")

        # rewrite num_of_downloads
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            increment_num_of_downloads(upload_images, blog, num=1)
            edit_num_of_most_downloads(blog)

        if len(upload_images) == 1:
            return FileResponse(upload_images[0].picture, as_attachment=True)
        else:
            response = HttpResponse(content_type='application/zip')
            file_zip = zipfile.ZipFile(response, 'w')
            for upload_image in upload_images:
                file_zip.writestr(os.path.basename(upload_image.picture.name), upload_image.picture.read())

            zip_name = 'otapick_' + str(group_id) + '_' + str(blog_ct) + '.zip'
            response['Content-Disposition'] = 'attachment; filename=' + zip_name
            return response


download = DownloadView.as_view()


class InformOfDownloadView(View):
    def post(self, request, *args, **kwargs):
        image_order_text = request.POST['image_order']
        group_id =  request.POST['group_id']
        blog_ct =  request.POST['blog_ct']
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            image_order = int(image_order_text[3:])
            if Image.objects.filter(publisher=blog, order=image_order).exists():
                image = Image.objects.filter(publisher=blog, order=image_order)
                increment_num_of_downloads(image, blog, num=1)
                edit_num_of_most_downloads(blog)
                return HttpResponse('success' + str(image_order))
        return HttpResponse('error')


inform_of_download = InformOfDownloadView.as_view()
