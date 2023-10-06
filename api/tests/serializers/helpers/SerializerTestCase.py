from django.test import TestCase


class SerializerTestCase(TestCase):
    def assertSerializerData(self, serializer_data, expected_data):
        self.assertCountEqual(
            serializer_data.keys(), expected_data.keys(), msg="シリアライザのkeyが正常であるか"
        )
        for expected_key in expected_data.keys():
            with self.subTest(f"シリアライザデータ『{expected_key}』テスト"):
                self.assertEquals(
                    serializer_data[expected_key],
                    expected_data[expected_key],
                    msg=f"シリアライザデータ『{expected_key}』テスト",
                )
