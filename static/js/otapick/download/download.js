// twemoji
twemoji.parse(document.body);
$('[data-toggle="tooltip"]').tooltip();

function checkFunc(id) {
    const idNum = id.replace(/[^0-9]/g, '');
    if (!$('.save_img_checkbox#cb' + idNum).prop("checked")) {
        $('div.thumbnail#img' + idNum).removeClass('checked');
    } else {
        $('div.thumbnail#img' + idNum).addClass('checked');
    }
}

$(function () {
    $(document).off('click.n1 click.n2 click.n3 click.n4');

    $(document).on('click.n1', 'div.thumbnail', function () {
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

    $(document).on('click.n2', '#allCheck', function () {
        if (!$(this).prop("checked")) {
            $('div.thumbnail').removeClass('checked');
            $('.save_img_checkbox').prop("checked", false);
        } else {
            $('div.thumbnail').addClass('checked');
            $('.save_img_checkbox').prop("checked", true);
        }
    });

    $(document).on('click.n3', '#allDownload, #allDownload2', function () {
        $('div.thumbnail').addClass('checked');
        $('.save_img_checkbox').prop("checked", true);
        $('#allCheck').prop("checked", true);
    });

    $(document).on('click.n4', '#image-download-btn', function (event) {
        event.preventDefault();
        const check_count = $('.image-box :checked').length;
        if (check_count === 0) {
            $("#choice-image-alert").show();
            return false;
        } else {
            $('#download').submit();
            $('div.thumbnail').removeClass('checked');
            $('.save_img_checkbox').prop("checked", false);
            $('#allCheck').prop("checked", false);
            $("#choice-image-alert").hide();
            $('#download_complete').modal('show');
        }
    });
});
