from django import forms


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
        label='keyword',
        max_length=100,
        required=False,
    )
    post = forms.CharField(
        label='post',
        required=False,
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
