from datetime import datetime


def sort_blogs(blogs, order_format):
    if order_format and order_format != 'newer_post':
        if order_format == 'older_post':
            blogs = blogs.order_by('post_date', '-order_for_simul')
        elif order_format == 'popularity':
            blogs = blogs.order_by('-score', '-num_of_most_downloads', '-post_date','order_for_simul')
        elif order_format == 'dl':
            blogs = blogs.order_by('-num_of_most_downloads', '-score', '-post_date','order_for_simul')
        elif order_format == 'sum_dl':
            blogs = blogs.order_by('-num_of_downloads', '-score', '-post_date', 'order_for_simul')
        elif order_format == 'view':
            blogs = blogs.order_by('-num_of_views', '-score', '-post_date', 'order_for_simul')
    else:
        blogs = blogs.order_by('-post_date', 'order_for_simul')

    return blogs


def narrowdown_blogs_keyword(blogs, narrowing_keyword):
    if narrowing_keyword:
        blogs = blogs.filter(title__icontains=narrowing_keyword)

    return blogs


def narrowdown_blogs_post(blogs, narrowing_post):
    if narrowing_post:
        narrowing_post_dic = {}
        post_date = {}
        if narrowing_post.count('-') == 1:
            post_datetime = datetime.strptime(narrowing_post, '%Y-%m')
            post_date = post_datetime.date()
        elif narrowing_post.count('-') == 2:
            post_datetime = datetime.strptime(narrowing_post, '%Y-%m-%d')
            post_date = post_datetime.date()
            narrowing_post_dic['day'] = post_date.day
        narrowing_post_dic['month'] = post_date.month
        narrowing_post_dic['year'] = post_date.year

        blogs = blogs.filter(post_date__year=narrowing_post_dic['year'], post_date__month=narrowing_post_dic['month'])
        if 'day' in narrowing_post_dic:
            blogs = blogs.filter(post_date__day=narrowing_post_dic['day'])

    return blogs
