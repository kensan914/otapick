from django.shortcuts import render
from image.models import Image, Progress
from main.scripts.searchViewFunc import convert_css_class
from main.scripts.searchViewSubFunc import check_is_mobile


def render_progress(request, progress, group_id, blog_ct, title,  writer_name, historyBackIsToTop, context):
    context.update({
        'progress': progress,
        'group_id': group_id,
        'blog_ct': blog_ct,
        'title': title,
        'writer_name': writer_name,
        'historyBackIsToTop': historyBackIsToTop,
    })
    return render(request, 'image/progress.html', context)


def render_progress_ajax(request, title, group_id, blog_ct, writer_name, context):
    context.update({
        'title': title,
        'group_id': group_id,
        'blog_ct': blog_ct,
        'writer_name': writer_name,
    })
    return render(request, 'image/progress_ajax.html', context)


def preparate_download_view(self, group_id, blog, blog_ct, is_ajax):
    if check_is_mobile(self.request):
        if is_ajax:
            self.html_path = "image/download_mobile_ajax.html"
        else:
            self.html_path = "image/download_mobile.html"
    else:
        if is_ajax:
            self.html_path = "image/download_ajax.html"
        else:
            self.html_path = "image/download.html"

    group = convert_css_class(group_id)
    self.request.session['group'] = group
    self.context.update({
        'blog': blog,
        'group_id': group_id,
        'blog_ct': blog_ct,
        'group': group,
    })
    if blog:
        if Image.objects.filter(publisher=blog).exists():
            blog_images = Image.objects.filter(publisher=blog).order_by('order')
            self.context['blog_images'] = blog_images
        else:
            self.context['blog_images'] = None
    # rewrite num_of_views
    increment_num_of_views(blog, num=1)


def increment_num_of_views(blog, num):
    blog.num_of_views += num
    blog.v1_per_week += num
    blog.save()


def increment_num_of_downloads(images, blog, num):
    for image in images:
        image.num_of_downloads += num
        image.d1_per_week += num
        image.save()

    total_num_of_downloads = 0
    for image in Image.objects.filter(publisher=blog):
        total_num_of_downloads += image.num_of_downloads
    blog.num_of_downloads = total_num_of_downloads
    blog.save()


def edit_num_of_most_downloads(blog):
    blog.num_of_most_downloads = Image.objects.filter(publisher=blog).order_by('-num_of_downloads')[0].num_of_downloads
    blog.save()


from image.imgScraper import update


def recreate_progress(request, progress, blog, group_id, blog_ct, context, historyBackIsToTop=False, is_ajax=False):
    progress.delete()
    new_progress = Progress.objects.create(target=blog)
    update.delay(new_progress.id, group_id, blog_ct, blog.writer.ct)
    if is_ajax:
        return render_progress_ajax(request, blog.title, group_id, blog_ct, blog.writer.full_kanji, context)
    else:
        return render_progress(request, new_progress, group_id, blog_ct, blog.title, blog.writer.full_kanji, historyBackIsToTop, context)
