from search.models import Member

ini_correspondence_dict = {
    'あ': ['a', 'i', 'u', 'e', 'o'],
    'か': 'k',
    'さ': 's',
    'た': 't',
    'な': 'n',
    'は': 'h',
    'ま': 'm',
    'や': 'y',
    'ら': 'r',
    'わ': 'w',
}


def member_initial_narrower(i_letter):
    members = Member.objects.filter(full_eng__iregex=r'^%s' % ini_correspondence_dict[i_letter])
    return members


def eng_converter(i_letter):
    if not i_letter:
        return None
    elif i_letter == 'あ':
        return ini_correspondence_dict[i_letter][0]
    else:
        return ini_correspondence_dict[i_letter]
