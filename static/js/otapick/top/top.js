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
    rewriteCardParameterNum();
    rewriteCardWriterName();
    rewriteCardBlogTitle();
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

const $keyaki_n = $('#groupTab a[href="#tab-pane-keyaki-newpost"]');
const $hinata_n = $('#groupTab a[href="#tab-pane-hinata-newpost"]');
const $keyaki_p = $('#groupTab a[href="#tab-pane-keyaki-popular"]');
const $hinata_p = $('#groupTab a[href="#tab-pane-hinata-popular"]');
$(function () {
  if (group === 'keyaki') {
      $keyaki_n.tab('show');
      $('#tab-pane-hinata-newpost').removeClass('active');
      $keyaki_p.tab('show');
      $('#tab-pane-hinata-popular').removeClass('active');
  } else if (group === 'hinata'){
      $hinata_n.tab('show');
      $('#tab-pane-keyaki-newpost').removeClass('active');
      $hinata_p.tab('show');
      $('#tab-pane-keyaki-popular').removeClass('active');
  }
});
$keyaki_n.click(function () {
uploadSlidesPerView();
});
$hinata_n.click(function () {
uploadSlidesPerView();
});
$keyaki_p.click(function () {
uploadSlidesPerView();
});
$hinata_p.click(function () {
uploadSlidesPerView();
});