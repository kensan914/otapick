import os
from abc import abstractmethod
from PIL import ImageFile, Image


class ImageEditor:
    @abstractmethod
    def exe_edit(self, img):
        pass

    def edit(self, **kwargs):
        ImageFile.LOAD_TRUNCATED_IMAGES = True
        img = Image.open(kwargs["img_path"])

        img = self.exe_edit(img)

        root, ext = os.path.splitext(kwargs["img_path"])
        edited_img_path = "".join([root, ext])
        img.save(edited_img_path)
