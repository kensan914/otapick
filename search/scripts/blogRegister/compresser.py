from PIL import Image
from PIL import ImageFile
import os


def compress_img(img_path):
    resize_width = 500

    ImageFile.LOAD_TRUNCATED_IMAGES = True

    img = Image.open(img_path)
    img_width, img_height = img.size
    resize_height = resize_width / img_width * img_height

    img.thumbnail((int(resize_width), int(resize_height)), Image.ANTIALIAS)

    root, ext = os.path.splitext(img_path)
    resize_img_path = "".join([root, ext])
    print(resize_img_path)
    img.save(resize_img_path)
