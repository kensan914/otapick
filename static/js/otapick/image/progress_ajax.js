function get_progress_num( download_url, historyBackIsToTop ) {
  jQuery(function ($) {
      $.ajax({
          url: download_url,
          method: 'get',
          timeout: 10000,
          datatype: 'text',
          data: {'func': 'get_progress_num'}
      })
      .done(function (data) {
          $('#progress').css('width', data + '%').attr('aria-valuenow', data);
          if (parseInt(data) >= 100) {
              setTimeout(function () {
                  view_download(download_url, historyBackIsToTop);
              }, 400);
          } else {
              setTimeout(function () { get_progress_num(download_url, historyBackIsToTop) }, 500);
          }
      });
  });
}

function view_download( download_url, historyBackIsToTop ) {
  $.ajax({
      url: download_url,
      type: 'get',
      dataType: 'html',
      data: {'func': 'view_download'}
  })

  .done(function(data) {
      const data_elm = jQuery(jQuery.parseHTML(data, true)).filter('*');
      $("title").replaceWith(data_elm[0]);
      $(".main-download").replaceWith(data_elm[1]);
      $("#progress_ajax-script").after(data_elm[2]);
      $("body").removeClass('p-0');
      if (historyBackIsToTop) {
          $("a.back-from-download").attr("href", "/");
          $("button.back-from-download").attr("onClick", "location.href='/'");
      }
  })
}

// Adjust size for mobile
$(function() {
  $("body").addClass('p-0');
  const w = $(window).width();
  if (w <= 576) {
      $('.progress').css({
          transform: 'scale(0.9,0.7)'
      });
      $('.now-loading').css({
          'font-size': '1.5rem'
      });
      $('.progress-info').css({
          'font-size': '0.92rem'
      })
  }
});