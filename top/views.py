import multiprocessing
import threading
from concurrent import futures

from django.shortcuts import render, redirect
from django.views import View
from search.scripts.firstClassifier import firstClassifier, dy_insert_hyphen
from top.testImgSaver import testImgSave


class BaseView(View):
    html_path = 'top/otapick_top.html'
    context = {}

    def get(self, request, *args, **kwargs):
        inputText = request.GET.get('q')
        if inputText:
            result = firstClassifier(inputText)
            if result['input'] == 'url':
                if result['class'] == 'detail':
                    return redirect('download:download', group_id=result['group_id'], blog_ct=result['blog_ct'])
                elif result['class'] == 'searchByLatest':
                    return redirect('search:searchByLatest', group_id=result['group_id'])
                elif result['class'] == 'searchByBlogs':
                    response = redirect('search:searchByBlogs', group_id=result['group_id'], page=result['page'])
                    if result['dy']:
                        response['location'] += '?dy=' + result['dy']
                    return response
                elif result['class'] == 'searchByMembers':
                    response = redirect('search:searchByMembers', group_id=result['group_id'], ct=result['ct'])
                    response['location'] += '?page=' + str(result['page'])
                    if result['dy']:
                        dy = dy_insert_hyphen(result['dy'])
                        response['location'] += '&post=' + dy
                    return response
                else:
                    return redirect('search:searchUnjustURL')
            elif result['input'] == 'name':
                if result['class'] == 'appropriate':

                    #テスト
                    blog_url = 'https://www.keyakizaka46.com/s/k46o/diary/detail/30958?ima=0000&cd=member'
                    group_id = 1
                    blog_ct = 30958
                    writer_ct = '12'
                    # p = threading.Thread(target=testImgSave, args=(blog_url, group_id, blog_ct, writer_ct))
                    # p.start()

                    # executor = futures.ThreadPoolExecutor()
                    # executor.submit(testImgSave)
                    # print("Threads..: {}".format(len(executor._threads)))
                    # executor.shutdown(wait=False)

                    p = multiprocessing.Process(target=testImgSave, args=(blog_url, group_id, blog_ct, writer_ct))
                    p.start()  # プロセスの開始

                    return redirect('search:searchMember', searchText=result['searchText'])
                else:
                    return redirect('search:searchUnjustMember')
        else:
            self.context['group'] = request.session.get('group', 'keyaki')
            return render(request, self.html_path, self.context)


class TopView(BaseView):
    html_path = 'top/otapick_top.html'


top = TopView.as_view()


class SupportView(BaseView):
    html_path = 'top/otapick_support.html'


support = SupportView.as_view()
