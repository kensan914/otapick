from django import forms
import bootstrap_datepicker_plus as datetimepicker
from search.scripts.searchViewFunc import kw_placeholder


class SearchForm(forms.Form):
    search_text = forms.CharField(
        label='search_text',
        max_length=100,
        required=True,
    )

    def clean_search_name(self):
        search_text = self.cleaned_data['search_text']

        return search_text


class NarrowingForm(forms.Form):
    keyword = forms.CharField(
        label='キーワード',
        max_length=30,
        required=False,
        widget=forms.TextInput(
            attrs={'placeholder': '例)'+kw_placeholder(), 'class': 'form-control form-control-sm mb-3'}
        ),
    )

    post = forms.CharField(
        label='投稿月',
        required=False,
        widget=datetimepicker.DatePickerInput(
            format='%Y-%m',
            attrs={'class': 'form-control form-control-sm'},
            options={
                'locale': 'ja',
            }
        ),
    )

    def clean_keyword(self):
        keyword = self.cleaned_data['keyword']
        return keyword

    def clean_post(self):
        post = self.cleaned_data['post']
        return post

    def clean(self):
        keyword = self.cleaned_data['keyword']
        post = self.cleaned_data['post']
        if not keyword and not post:
            raise forms.ValidationError("一文字以上入力してください。")
