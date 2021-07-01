from abc import abstractmethod

from django.db import models
from django.test import TestCase
from factory.django import DjangoModelFactory


class ModelTestCase(TestCase):
    @abstractmethod
    def __init_Model__(self):
        return models.Model

    @abstractmethod
    def __init_Factory__(self):
        return DjangoModelFactory

    @abstractmethod
    def __init_test_fields__(self):
        return []

    def assertModel(self, record1, record2):
        for expected_field in self.__init_test_fields__():
            with self.subTest(f"モデルフィールド『{expected_field}』テスト"):
                field1 = getattr(record1, expected_field, "None")
                field2 = getattr(record2, expected_field, "None")
                if field1 == "None":
                    self.fail(f"レコード1に{expected_field}フィールドは存在しません")
                if field2 == "None":
                    self.fail(f"レコード2に{expected_field}フィールドは存在しません")
                else:
                    self.assertEquals(
                        field1,
                        field2,
                        msg=f"モデルフィールド『{expected_field}』テスト",
                    )

    def ready_test(self):
        if self.__init_Model__() == models.Model:
            return False
        elif self.__init_Factory__() == DjangoModelFactory:
            return False
        elif not self.__init_test_fields__():
            return False
        else:
            return True

    def test_create(self):
        # 抽象クラスとしてのModelTestCaseもテスト対象になってしまうため
        if not self.ready_test():
            return

        factory = self.__init_Factory__().create()

        self.assertEquals(self.__init_Model__().objects.all().count(), 1, msg="作成されている")
        created_image = self.__init_Model__().objects.first()
        self.assertModel(
            created_image,
            factory,
        )
