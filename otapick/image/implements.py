from PIL import Image
from otapick.image.abstracts import ImageEditor


class ImageCompressor(ImageEditor):
    """
    引数widthで指定した幅に圧縮（比率固定）
    """
    resize_width = 500

    def exe_edit(self, img):
        img_width, img_height = img.size
        resize_height = self.resize_width / img_width * img_height

        img.thumbnail((int(self.resize_width), int(resize_height)), Image.ANTIALIAS)
        return img

    def edit(self, img_path, width=500):
        self.resize_width = width
        super().edit(img_path=img_path)


class ImageTrimmer(ImageEditor):
    """
    正方形にトリミング。その時、範囲は画像上部に合わせる。（メンバー画像の編集に）
    """
    trim_type = 'square_up'

    def exe_edit(self, img):
        if self.trim_type == 'square_up':
            img_width, img_height = img.size
            square_side = min(img_width, img_height)

            # landscape
            if img_width > img_height:
                left = (img_width - square_side) / 2
                top = 0
                right = left + square_side
                bottom = square_side
            # portrait
            else:
                left = 0
                top = 0
                right = square_side
                bottom = square_side
            return img.crop((left, top, right, bottom))

    def edit(self, img_path, trim_type='square_up'):
        self.trim_type = trim_type
        super().edit(img_path=img_path)
