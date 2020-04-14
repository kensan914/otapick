var $grid;
var $currentPage = 1;

$('[data-toggle="tooltip"]').tooltip();

$(function () {
    rewriteCardParameterNum();
    rewriteCardWriterName();
    initMasonryInfiniteScroll($currentPage);
    gridEvent();

    // when reload or back_forward
    var perfEntries = performance.getEntriesByType("navigation");
    perfEntries.forEach(function(pe){
        switch( pe.type ){
        case 'reload':
        case 'back_forward':
            const url = new URL(location);
            url.searchParams.delete("page");
            window.location.href = url.toString();
            break;
        }
    });
});

// init Masonry & InfiniteScroll
// "start_page": default=2
function initMasonryInfiniteScroll() {
    $grid = $('.grid').masonry({
        itemSelector: '.grid .grid-item'
    });

    var msnry = $grid.data('masonry');

    $grid.infiniteScroll({
        path: function() {
            var nextPageNum = $currentPage + 1;
            const url = new URL(location);
            if (url.searchParams.has("page")) url.searchParams.delete("page");
            var param = url.search;
            if (param) {
                return param + '&page=' + nextPageNum;
            } else {
                return '?page=' + nextPageNum;
            }
        },
        append: '.grid .grid-item',
        outlayer: msnry,
        hideNav: '#to_next_page',
        status: '.page-load-status'
    });
}

// Event when grid update
function gridEvent(){
    $grid.on( 'load.infiniteScroll', function() {
        $currentPage++;
    });
    $grid.on('append.infiniteScroll', function () {
        twemoji.parse(document.body);
        $('[data-toggle="tooltip"]').tooltip();
        rewriteCardParameterNum();
        rewriteCardWriterName();
    });
}