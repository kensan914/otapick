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
$(function () {
    navbar_effect();
})
$(window).scroll(function () {
    navbar_effect();
});

function navbar_effect() {
    var currentPos = $(this).scrollTop();
    navbar_shadow();

    if (currentPos > startPos) {
        if ($(window).scrollTop() >= 200) {
            $(".fixed-top")
                .css("top", "-" + menuHeight + "px")
                .css("transition", "0.3s")
                .css("transition-timing-function", "ease-out");

            $("#nav-dropdown1, #nav-dropdown-menu1, #nav-dropdown2, #nav-dropdown-menu2, #navbarSupportedContent").removeClass("show");
        }
    } else if (startPos > currentPos) {
        $(".fixed-top")
            .css("top", 0 + "px")
            .css("transition", "0.3s")
            .css("transition-timing-function", "ease-out");
    }
    startPos = currentPos;
}

function navbar_shadow() {
    if ( $(window).scrollTop() > 0 ) {
        $(".fixed-top").addClass("shadow");
    } else {
        $(".fixed-top").removeClass("shadow");
    }
}

window.onload = function () {
    scroll_effect();

    $(window).scroll(function () {
        scroll_effect();
    });

    function scroll_effect() {
        $('.effect-fade, .effect-fade-under, .top-subtitle_newpost, .top-subtitle_howto, .top-subtitle_twitter, .top-subtitle_popular').each(function () {
            var elemPos = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            if (scroll > elemPos - windowHeight + effectTrigger) {
                $(this).addClass('effect-scroll');
            }
        });
    }
};
