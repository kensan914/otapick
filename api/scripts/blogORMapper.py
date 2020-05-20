def sort(blogs, order_format):
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
