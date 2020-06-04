import os
from abc import ABCMeta, abstractmethod
import requests
import urllib3
from urllib3.exceptions import InsecureRequestWarning
from config import settings


class Downloader(metaclass=ABCMeta):
    media_dir_path_list = []

    @abstractmethod
    def set_media_dir_path_list(self, **kwargs):
        pass

    def generate_filename(self, **kwargs):
        file_name = os.path.basename(kwargs['url'])
        # ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)
        if file_name.startswith('.'): file_name = '_' + file_name
        return file_name

    def generate_filepath(self, **kwargs):
        try:
            media_dir_path = os.path.join(*self.media_dir_path_list)
            dir_path = os.path.join(settings.MEDIA_ROOT, media_dir_path)

            os.makedirs(dir_path, exist_ok=True)

            file_name = self.generate_filename(**kwargs)
            path = os.path.join(dir_path, file_name)
            media = os.path.join(media_dir_path, file_name)
            return True, path, media
        except:
            return False, None, None

    def exe_download(self, url, path):
        try:
            file = open(path, 'wb')
            urllib3.disable_warnings(InsecureRequestWarning)
            response = requests.get(url, verify=False)
            data = response.content
            file.write(data)

            file.close()
            return True
        except:
            return False

    def exe_edit(self, path):
        pass

    @abstractmethod
    def download(self, **kwargs):
        self.set_media_dir_path_list(**kwargs)
        success, path, media = self.generate_filepath(**kwargs)
        if not success: return
        if self.exe_download(kwargs['url'], path):
            self.exe_edit(path)
            return media
        else:
            return
