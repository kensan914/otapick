$(document).ready(function () {
    $(".pagination").rPage();
});

$('[data-toggle="tooltip"]').tooltip();

//InfiniteScroll
var $grid = $('.grid').masonry({
    itemSelector: '.grid .grid-item',
});

var msnry = $grid.data('masonry');

$grid.infiniteScroll({
    path: "#to_next_page",
    append: '.grid .grid-item',
    outlayer: msnry,
    hideNav: '#to_next_page',
    status: '.page-load-status',
});

$grid.on('append.infiniteScroll', function () {
    twemoji.parse(document.body);
    $('[data-toggle="tooltip"]').tooltip();
});