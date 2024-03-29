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

    # デフォルトではそのままのファイル名(ドットファイルは対処有)
    def generate_filename(self, **kwargs):
        file_name = os.path.basename(kwargs["url"])
        # ファイル名が無いドットファイルにファイル名を与える。(.jpg⇒_.jpg)
        if file_name.startswith("."):
            file_name = "_" + file_name
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
            file = open(path, "wb")
            urllib3.disable_warnings(InsecureRequestWarning)
            response = requests.get(url, verify=False)
            if (
                response.headers["Content-Type"] == "image/gif"
                and response.headers["Content-Length"].isdecimal()
                and int(response.headers["Content-Length"]) < 10000
            ):
                return "not_image"
            if response.status_code == 200:
                data = response.content
                file.write(data)
                result = True
            else:
                return
            file.close()
            return result
        except:
            import traceback

            traceback.print_exc()
            return

    def exe_edit(self, path):
        pass

    @abstractmethod
    def download(self, **kwargs):
        self.set_media_dir_path_list(**kwargs)
        success, path, media = self.generate_filepath(**kwargs)
        if not success:
            return
        download_result = self.exe_download(kwargs["url"], path)
        if not download_result:
            return
        elif download_result == "not_image":
            return "not_image"
        else:
            self.exe_edit(path)
            return media
