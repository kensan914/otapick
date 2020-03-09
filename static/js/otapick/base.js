// twemoji
twemoji.parse(document.body);


// Masonry
var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
});
$grid.imagesLoaded().progress(function () {
    $grid.masonry('layout');
});


// navbar
var menuHeight = 67;
var startPos = 0;
$(window).scroll(function () {
    var currentPos = $(this).scrollTop();
    $(".fixed-top").addClass("shadow");

    if (currentPos > startPos) {
        if ($(window).scrollTop() >= 200) {
            $(".fixed-top").css("top", "-" + menuHeight + "px");
            $(".fixed-top").css("transition", "0.3s");
            $(".fixed-top").css("transition-timing-function", "ease-out");
        }
    } else if (startPos > currentPos) {
        $(".fixed-top").css("top", 0 + "px");
        $(".fixed-top").css("transition", "0.3s");
        $(".fixed-top").css("transition-timing-function", "ease-out");
    }
    startPos = currentPos;

    if ($('.fixed-top').offset().top == 0) {
        $(".fixed-top").removeClass("shadow");
    }
});

window.onload = function () {
    scroll_effect();

    $(window).scroll(function () {
        scroll_effect();
    });

    function scroll_effect() {
        $('.effect-fade, .effect-fade-under, .top-subtitle_newpost, .top-subtitle_howto').each(function () {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight + 70) {
                $(this).addClass('effect-scroll');
            }
        });
    }
};
