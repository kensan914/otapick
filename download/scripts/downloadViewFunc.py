import os
import subprocess
from django.shortcuts import render
from config.settings import BASE_DIR
from search.models import Member, Blog


def blog_getter(group_id, blog_ct):
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
