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

    # def clean(self):

