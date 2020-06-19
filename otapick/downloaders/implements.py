import os
from otapick.downloaders.abstracts import Downloader
from otapick.image.implements import ImageCompressor, ImageTrimmer


class MemberImageDownloader(Downloader):
    def set_media_dir_path_list(self, **kwargs):
        self.media_dir_path_list = ['member_images', str(kwargs['group_id']) + '_' + kwargs['ct']]

    def exe_edit(self, path):
        ImageTrimmer().edit(path)
        ImageCompressor().edit(path)

    def download(self, url, group_id, ct):
        return super().download(url=url, group_id=group_id, ct=ct)


class MemberImageDownloaderEx(MemberImageDownloader):
    def generate_filename(self, **kwargs):
        origin_file_name = os.path.basename(kwargs['url'])
        extension = os.path.splitext(origin_file_name)[1]
        return 'mi_{}_{}{}'.format(kwargs['group_id'], kwargs['ct'], extension)


class BlogImageDownloader(Downloader):
    def set_media_dir_path_list(self, **kwargs):
        self.media_dir_path_list = ['blog_images', str(kwargs['group_id']) + '_' + kwargs['ct'], str(kwargs['blog_ct'])]

    def download(self, url, group_id, blog_ct, ct):
        return super().download(url=url, group_id=group_id, blog_ct=blog_ct, ct=ct)
