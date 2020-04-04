import os
import subprocess
from django.shortcuts import render
from config.settings import BASE_DIR
from download.models import Image
from search.models import Member, Blog


def get_blog(group_id, blog_ct):
    writer_belonging = Member.objects.filter(belonging_group__group_id=group_id)
    try:
        blog = Blog.objects.get(writer__in=writer_belonging, blog_ct=blog_ct)
    except:
        try:
            subprocess.call(['python', os.path.join(BASE_DIR, 'manage.py'), 'keepUpLatest'])
        except:
            print("subprocess.check_call() failed")
        try:
            blog = Blog.objects.get(writer__in=writer_belonging, blog_ct=blog_ct)
        except:
            return None
    return blog


def render_progress(request, progress, group_id, blog_ct, title, status):
    return render(request, 'download/otapick_progress.html', {
        'progress': progress,
        'group_id': group_id,
        'blog_ct': blog_ct,
        'title': title,
        'status': status
    })


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
