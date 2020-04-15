// when reload or back_forward
$(function () {
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
})