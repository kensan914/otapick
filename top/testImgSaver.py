import os
import requests


def testImgSave():
    os.makedirs('/var/www/otapick/media/blog_images/testes', exist_ok=True)

    img_file = open('/var/www/otapick/media/blog_images/testes/test.jpg', 'wb')
    response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobMzngmy.jpg')
    image = response.content
    img_file.write(image)
    img_file.close()

    img_file = open('/var/www/otapick/media/blog_images/testes/test2.jpg', 'wb')
    response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobS03Eyk.jpg')
    image = response.content
    img_file.write(image)
    img_file.close()

    img_file = open('/var/www/otapick/media/blog_images/testes/test3.jpg', 'wb')
    response = requests.get('https://cdn.keyakizaka46.com/files/14/diary/k46/member/moblog/201909/mobUWU5g7.jpg')
    image = response.content
    img_file.write(image)
    img_file.close()

    print('完了！')
