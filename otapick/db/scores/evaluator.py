import datetime
import math
import random
import numpy as np
from image.models import Image
from main.models import Blog


class RecommendScoreEvaluator:
    """
    blog, imageのrecommend_scoreの評価。引数にblogまたはimageを受け取り、recommend_scoreを設定したblogまたはimageレコードを返す。
    評価指標： スコア、上位メンバーバイアス、ダウンロード数、閲覧数
    ボーナス：投稿1年以内ボーナス、当日ボーナス
    """

    def __init__(self, high_score_members, mode):
        self.rate = [2, 2, 3, 3]
        self.high_score_members = high_score_members
        self.mode = mode
        if mode == 'blog':
            self.score_deviation = DeviationEvaluator(Blog.objects.exclude(
                score=0).values_list('score', flat=True))  # valuesの登録。
            self.downloads_deviation = DeviationEvaluator(Blog.objects.exclude(
                num_of_most_downloads=0).values_list('num_of_most_downloads', flat=True))
            self.views_deviation = DeviationEvaluator(Blog.objects.exclude(
                num_of_views=0).values_list('num_of_views', flat=True))
        elif mode == 'image':
            self.score_deviation = DeviationEvaluator(Image.objects.exclude(
                score=0).values_list('score', flat=True))  # valuesの登録。
            self.downloads_deviation = DeviationEvaluator(Image.objects.exclude(
                num_of_downloads=0).values_list('num_of_downloads', flat=True))
            self.views_deviation = DeviationEvaluator(Image.objects.exclude(
                num_of_views=0).values_list('num_of_views', flat=True))
        self.current = datetime.date.today()

    def evaluate(self, record):
        scores = []

        # score
        result = self.score_deviation.calc(record.score)
        scores.append(result * self.rate[0])

        # 上位メンバーバイアス
        for high_score_members_by_G in self.high_score_members:
            if self.mode == 'blog':
                writer = record.writer
            elif self.mode == 'image':
                writer = record.publisher.writer
            else:
                writer = None
            if writer in high_score_members_by_G:
                index = list(high_score_members_by_G).index(writer)
                break
        else:
            index = 10
        scores.append(((10 - index) / 10) * self.rate[1])

        # ダウンロード数
        result = self.downloads_deviation.calc(record.num_of_downloads)
        scores.append(result * self.rate[2])

        # 閲覧数
        if self.mode == 'blog':
            value = record.num_of_most_downloads
        elif self.mode == 'image':
            value = record.num_of_downloads
        else:
            value = None
        result = self.views_deviation.calc(value)
        scores.append(result * self.rate[2])

        score = sum(scores)

        # 投稿1年以内ボーナス
        if self.mode == 'blog':
            record_post_date = record.post_date
        elif self.mode == 'image':
            record_post_date = record.publisher.post_date
        else:
            record_post_date = None

        # post_dateを月だけで表現 ex) 2019年9月 => 2019*12 + 9 = 24237
        post_month_score = record_post_date.year * 12 + record_post_date.month
        current_month_score = self.current.year * 12 + self.current.month  # 同様
        if self.current.day < 15:  # 上旬は先月として考える
            current_month_score -= 1
        diff_month_score = current_month_score - post_month_score
        if diff_month_score < 0:
            diff_month_score = 0  # 上旬でその月投稿されていたら-1になるため
        if diff_month_score < 12:  # 投稿1年以内
            score = self.add_bonus(score, diff_month_score)
            score = self.add_bonus_the_day(score, post_date=record_post_date)

        record.recommend_score = score
        return record

    def add_bonus(self, score, diff_post):
        diff_score = 10 - score  # score=4.6のとき、diff_score=5.4
        diff_score_ceil = math.ceil(diff_score)  # 切り上げ。diff_score=6
        diff_score_decimal = diff_score - \
            math.floor(diff_score)  # 小数部分 diff_score_decimal=0.4

        if diff_score_ceil > 0:
            # ボーナスの選択肢。bonus_choice=[0, 1, 2, 3, 4, 5]
            bonus_choice = list(range(diff_score_ceil))
            # 投稿月が離れているほど、低い数字が多く格納される。その月投稿されていても↓の処理は最低一回は実行される。
            for i in range(diff_post + 1):
                for bonus in range(diff_score_ceil):  # indexが低い要素ほどコピーを増やしている
                    # 最終的なbonus_choice => [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5]
                    bonus_choice += [bonus] * (diff_score_ceil - bonus - 1)
            random.shuffle(bonus_choice)
            bonus = bonus_choice[0]  # bonus_choiceからランダムに値を取得し、bonusに格納
            bonus += random.uniform(0, diff_score_decimal)  # 小数部分のランダム値も追加
        else:
            bonus = 0
        score += bonus
        return score

    def add_bonus_the_day(self, score, post_date):
        # 当日ボーナス
        if post_date.day == self.current.day and post_date.month == self.current.month and post_date.year == self.current.year:
            return self.add_bonus(score, 0)
        else:
            return score


class DeviationEvaluator:
    """
    scoreなどのint型リストをvaluesにわたし、インスタンス化。
    :return:: 平均値からどれだけ離れているかという指標で、0 ~ 1 の間の値を返す。引数に渡した値が平均値の場合約0.5が返される。 引数0の時、return 0
    """

    def __init__(self, values):
        values = np.array(values)
        self.mean = np.mean(values)
        self.std = np.std(values)

    def calc(self, target_value):
        if target_value <= 0:
            return 0
        # ☚この値を大きくするほど、簡単に0や100に到達する
        deviation_value = 50 + (target_value - self.mean) / self.std * 20
        if deviation_value > 100:
            deviation_value = 100
        elif deviation_value < 0:
            deviation_value = 0
        return deviation_value / 100
