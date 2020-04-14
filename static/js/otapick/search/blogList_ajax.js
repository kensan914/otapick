var $downloadTrigger;

$(function () {
    $(document).on('click', '.download-trigger', view_download_or_progress);
    $(document).on('click', '.back-from-dl', reprojectMain);
    $(".main-download").hide();
})

function view_download_or_progress() {
    $downloadTrigger = $(this);
    var url = $downloadTrigger.attr('href');
    $.pjax({
        url: url,
        container : ".main-download",
        fragment : ".main-download",
        timeout : 1000,
        scrollTo: false
    });
    return false;
}

$(document).on('pjax:success', function(e, data) {

    $(".main").animate({opacity: 0, marginTop: "20px"}, 200, function () {
                    $("footer").hide();
                    $("#copyright").hide();
                    $(".main").hide();
                    if ($('.grid .grid-item').length) destroyISandMasonry();
                    $(window).scrollTop(0);
                    $("title").replaceWith($(data).filter('title'));
                    $("#blogList_ajax-script").after($(data).filter('.ajax-script'));
                    $(".main-download").show();
                });
});

function destroyISandMasonry() {
    $grid.infiniteScroll('destroy');
    $grid.masonry('destroy');
}

function reprojectMain(){
    $(".modal-backdrop").remove();
    $("#download_complete").modal('hide');
    $("body").removeAttr("style").removeAttr("class");

    $(".ajax-script").remove();
    $(".main-download").hide();
    $(".main").removeAttr("style").show();

    if($('.grid .grid-item').length){
        initMasonryInfiniteScroll();
    }
}

function reprojectMainDownload(){
    destroyISandMasonry();
    $(".main").hide();
    $(".main-download").show();
    navbar_shadow();
    $("#download_complete").modal('hide');
}

// when push history.back
window.addEventListener("popstate", function (event) {
    if (location.pathname.startsWith('/download')) {
        reprojectMainDownload();
    } else {
        reprojectMain();
    }
});