function checkFunc(id) {
    const idNum = id.replace(/[^0-9]/g, '');
    if (!$('.save_img_checkbox#cb' + idNum).prop("checked")) {
        $('div.thumbnail#img' + idNum).removeClass('checked');
    } else {
        $('div.thumbnail#img' + idNum).addClass('checked');
    }
}

$(function () {
    $('div.thumbnail').on('click', function () {
        const id = $(this).attr("id");
        const idNum = id.replace(/[^0-9]/g, '');

        if (!$(this).is('.checked')) {
            $(this).addClass('checked');
            $('.save_img_checkbox#cb' + idNum).prop("checked", true);
        } else {
            $(this).removeClass('checked');
            $('.save_img_checkbox#cb' + idNum).prop("checked", false);
        }
    });

    $('#allCheck').on('click', function () {
        if (!$(this).prop("checked")) {
            $('div.thumbnail').removeClass('checked');
            $('.save_img_checkbox').prop("checked", false);
        } else {
            $('div.thumbnail').addClass('checked');
            $('.save_img_checkbox').prop("checked", true);
        }
    });
    $('#allDownload, #allDownload2').on('click', function () {
        $('div.thumbnail').addClass('checked');
        $('.save_img_checkbox').prop("checked", true);
        $('#allCheck').prop("checked", true);
    });
});

$(function () {
    let changeForm = true;
    $(window).on('beforeunload', function () {
        if (changeForm) return '保存が完了していません。このページを離れます。';
    });
    $('.save_button').on('click', function () {
        changeForm = false;
    });
});

$('#download').submit(function (event) {
    event.preventDefault();
    const check_count = $('.image-box :checked').length;
    if (check_count === 0) {
        $("#choice_image").show();
        return false;
    } else {
        $(this).off('submit');
        $(this).submit();
        $("#choice_image").hide();
        $('#download_complete').modal('show');
    }
});
