import random
import numpy as np
from django.core.management.base import BaseCommand
from image.models import Image
from main.models import Blog
import otapick


class DeviationEvaluator:
    """
    scoreなどのint型リストをvaluesにわたし、インスタンス化。
    :return:: 平均値からどれだけ離れているかという指標で、0 ~ 1 の間の値を返す。引数に渡した値が平均値の場合約0.5が返される。 引数0の時、return 0
    """
    def __init__(self, values):
        self.values = np.array(values)
        self.mean = np.mean(values)
        self.std = np.std(values)

    def calc(self, target_value):
        if target_value <= 0:
            return 0
        deviation_value = 50 + (target_value - self.mean) / self.std * 30
        if deviation_value > 100:
            deviation_value = 100
        elif deviation_value < 0:
            deviation_value = 0
        return deviation_value / 100


class Command(BaseCommand):
    help = '開発用、フィールドをすべて書き換えるため、終わったらこれは削除。' \
           'ランダムに半分選んだblog, imageのパラメータ（ダウンロード数や閲覧数等）にランダム値を設定。'

    def add_arguments(self, parser):
        parser.add_argument('-p', '--page', type=int, help='set up_limit. default:100')

    def handle(self, *args, **options):
        deviation = DeviationEvaluator(Image.objects.exclude(score=0).values_list('score', flat=True))
        # deviation = DeviationEvaluator(Image.objects.all().values_list('score', flat=True))
        print(deviation.mean, deviation.std)
        print(len(deviation.values))
        print(deviation.calc(options['page']))
