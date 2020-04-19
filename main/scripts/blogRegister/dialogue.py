from main.models import Member, Group


def which_group():
    while True:
        input_group_id = input('まず、実行するグループのgroup_idを教えてください：')
        if input_group_id == 'q':
            return None, 0
        try:
            group_id = int(input_group_id)
        except:
            print('整数を入力してください。')
            continue
        try:
            group = Group.objects.get(group_id=group_id)
        except:
            print(int(group_id), 'のgroup_idを持つグループは見つかりませんでした。')
            continue
        if group_id != 0:
            break

    return group, group_id


def which_member(group_id):
    while True:
        global ct
        ct = input('次に、実行するメンバーのct番号を教えてください：')
        if ct == 'q':
            return None, '0'
        try:
            member = Member.objects.get(ct=ct, belonging_group__group_id=group_id)
        except:
            print(ct, 'のct番号を持つメンバーは見つかりませんでした。')
            ct = ''
            continue
        if ct != '':
            break

    return member, ct


def howmany_pages():
    while True:
        set_page = input('ページ指定をしますか？(y or n)：')
        if set_page == 'y':
            break
        elif set_page == 'n':
            return 100
        elif set_page == 'q':
            return 0

    while True:
        input_page = input('何ページですか？：')
        page_num = 100
        if input_page == 'q':
            return 0
        try:
            page_num = int(input_page)
            if page_num < 1:
                print('正の整数を入力してください。')
                continue
            else:
                break
        except:
            print('整数を入力してください。')
            continue
    return page_num


def final_confirm(name):
    while True:
        answer = input(name + 'のスクレイピングを開始します。よろしいですか？(y or n):')
        if answer == 'y':
            break
        elif answer == 'n' or answer == 'q':
            return False

    return True
