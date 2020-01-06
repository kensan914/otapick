import os
import threading
from django.shortcuts import render
from download.imgScraper import update
from download.scripts.downloadViewFunc import blog_getter, render_progress
from top.views import BaseView
from .models import Image, Progress
from django.http import HttpResponse
import zipfile
import user_agents
from search.scripts.searchViewFunc import css_classConverter


class DownloadView(BaseView):
    html_path = 'download/otapick_download.html'

    def get(self, request, *args, **kwargs):
        if self.request.GET.get('q'):
            return BaseView.get(self, self.request)

        group_id = self.kwargs.get('group_id')
        blog_ct = self.kwargs.get('blog_ct')
        blog = blog_getter(group_id, blog_ct)

        if blog:
            if not Progress.objects.filter(target=blog).exists() or Progress.objects.get(target=blog).num <= 100:
                if not Progress.objects.filter(target=blog).exists():
                    progress_instance = Progress(target=blog)
                    progress_instance.save()
                    p = threading.Thread(target=update,
                                         args=(progress_instance, group_id, blog_ct, blog.writer.ct, blog))
                    p.start()
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

            group = css_classConverter(group_id)
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
        response = HttpResponse(content_type='application/zip')
        file_zip = zipfile.ZipFile(response, 'w')
        for upload_image in upload_images:
            file_zip.writestr(os.path.basename(upload_image.picture.name), upload_image.picture.read())

        zip_name = 'otapick_' + str(group_id) + '_' + str(blog_ct) + '.zip'
        response['Content-Disposition'] = 'attachment; filename=' + zip_name
        return response


download = DownloadView.as_view()
