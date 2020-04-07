var swiper_keyaki_n = new Swiper('#tab-pane-keyaki-newpost>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-keyaki-newpost',
    clickable: true
  }
});
var swiper_hinata_n = new Swiper('#tab-pane-hinata-newpost>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-hinata-newpost',
    clickable: true
  }
});
var swiper_keyaki_p = new Swiper('#tab-pane-keyaki-popular>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-keyaki-popular',
    clickable: true
  }
});
var swiper_hinata_p = new Swiper('#tab-pane-hinata-popular>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-hinata-popular',
    clickable: true
  }
});

$( document ).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
    uploadSlidesPerView();
    rewrite_card_parameter_num();
    rewrite_card_writer_name();
    rewrite_card_blog_title();
});
$( window ).resize(uploadSlidesPerView);

function uploadSlidesPerView() {
    if (window.innerWidth >= 992) {
        swiper_keyaki_n.params.slidesPerView = 4;
        swiper_hinata_n.params.slidesPerView = 4;
        swiper_keyaki_p.params.slidesPerView = 4;
        swiper_hinata_p.params.slidesPerView = 4;
    } else if (window.innerWidth >= 768) {
        swiper_keyaki_n.params.slidesPerView = 3;
        swiper_hinata_n.params.slidesPerView = 3;
        swiper_keyaki_p.params.slidesPerView = 3;
        swiper_hinata_p.params.slidesPerView = 3;
    } else {
        swiper_keyaki_n.params.slidesPerView = 2;
        swiper_hinata_n.params.slidesPerView = 2;
        swiper_keyaki_p.params.slidesPerView = 2;
        swiper_hinata_p.params.slidesPerView = 2;
    }
    swiper_keyaki_n.update();
    swiper_hinata_n.update();
    swiper_keyaki_p.update();
    swiper_hinata_p.update();
}
