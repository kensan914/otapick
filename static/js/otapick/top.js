var swiper_keyaki = new Swiper('#tab-pane-keyaki>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-keyaki',
    clickable: true,
  }
});
var swiper_hinata = new Swiper('#tab-pane-hinata>.swiper-container', {
  slidesPerView: 2,
  spaceBetween: 0,
  freeMode: true,
  pagination: {
    el: '#swiper-pagination-hinata',
    clickable: true,
  }
});

$( document ).ready(uploadSlidesPerView);
$( window ).resize(uploadSlidesPerView);

function uploadSlidesPerView() {
    if (window.innerWidth >= 992) {
        swiper_keyaki.params.slidesPerView = 4;
        swiper_hinata.params.slidesPerView = 4;
    } else if (window.innerWidth >= 768) {
        swiper_keyaki.params.slidesPerView = 3;
        swiper_hinata.params.slidesPerView = 3;
    } else {
        swiper_keyaki.params.slidesPerView = 2;
        swiper_hinata.params.slidesPerView = 2;
    }
    swiper_keyaki.update();
    swiper_hinata.update();
}
