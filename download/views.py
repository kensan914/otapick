import os
from django.shortcuts import render, redirect
from django.views import View
from download.imgScraper import update
from download.scripts.downloadViewFunc import get_blog, render_progress, increment_num_of_views, \
    increment_num_of_downloads, edit_num_of_most_downloads
from search.models import Blog
from top.views import BaseView
from .models import Image, Progress
from django.http import HttpResponse
import zipfile
import user_agents
from search.scripts.searchViewFunc import convert_css_class


class DownloadView(BaseView):
    html_path = 'download/otapick_download.html'

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)

        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        blog = get_blog(group_id, blog_ct)

        if blog:
            if not Progress.objects.filter(target=blog).exists() or Progress.objects.get(target=blog).num <= 100:
                if not Progress.objects.filter(target=blog).exists():
                    progress_instance = Progress.objects.create(target=blog)

                    update.delay(progress_instance.id, group_id, blog_ct, blog.writer.ct)

                    return render_progress(request, progress_instance, group_id, blog_ct, blog.title, 'download')
                elif not Progress.objects.get(target=blog).ready:
                    progress = Progress.objects.get(target=blog)
                    if progress.num >= 100:
                        progress.ready = True
                        progress.save()
                        request.session['loaded_'+str(group_id)+'_'+str(blog_ct)] = True
                    if request.is_ajax():
                        return HttpResponse(str(progress.num))
                    else:
                        #progressだけが作成されてceleryが起動しなかった時の対応。
                        #task_idからtaskが生きているかの条件も追加したかったが断念。
                        if progress.num == 0:
                            progress.delete()
                            return redirect('download:download', group_id, blog_ct)
                        return render_progress(request, progress, group_id, blog_ct, blog.title, 'download')
                # 同時接続用
                elif request.is_ajax():
                    progress = Progress.objects.get(target=blog)
                    if progress.num >= 100:
                        request.session['loaded_' + str(group_id) + '_' + str(blog_ct)] = True
                    return HttpResponse(str(progress.num))

        if request.session.get('loaded_'+str(group_id)+'_'+str(blog_ct), False):
            del request.session['loaded_'+str(group_id)+'_'+str(blog_ct)]
            user_agent = user_agents.parse(request.META['HTTP_USER_AGENT'])
            if user_agent.is_mobile:
                self.html_path = "download/otapick_download_mobile.html"

            group = convert_css_class(group_id)
            self.request.session['group'] = group
            self.context = {
                'blog': blog,
                'group_id': group_id,
                'blog_ct': blog_ct,
                'group': group,
            }
            if blog:
                if Image.objects.filter(publisher=blog).exists():
                    blog_images = Image.objects.filter(publisher=blog).order_by('order')
                    self.context['blog_images'] = blog_images
                else:
                    self.context['blog_images'] = None
            # rewrite num_of_views
            increment_num_of_views(blog, num=1)
            return render(request, self.html_path, self.context)
        else:
            request.session['loaded_'+str(group_id)+'_'+str(blog_ct)] = True
            progress = Progress.objects.get(target=blog)
            return render_progress(request, progress, group_id, blog_ct, blog.title, 'success')

    def post(self, request, *args, **kwargs):
        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        file_pks = request.POST.getlist('zip')
        upload_images = Image.objects.filter(pk__in=file_pks)

        #rewrite num_of_downloads
        if Blog.objects.filter(writer__belonging_group__group_id=group_id, blog_ct=blog_ct).exists():
            blog = Blog.objects.get(writer__belonging_group__group_id=group_id, blog_ct=blog_ct)
            increment_num_of_downloads(upload_images, blog, num=1)
            edit_num_of_most_downloads(blog)

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
