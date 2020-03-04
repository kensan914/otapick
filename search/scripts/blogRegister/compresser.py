from PIL import Image
import os


def compress_img(img_path):
    resize_width = 500

    img = Image.open(img_path)
    img_width, img_height = img.size
    resize_height = resize_width / img_width * img_height

    img.thumbnail((int(resize_width), int(resize_height)), Image.ANTIALIAS)

    root, ext = os.path.splitext(img_path)
    resize_img_path = "".join([root, ext])
    img.save(resize_img_path)
