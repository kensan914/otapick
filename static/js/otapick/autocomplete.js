$(function () {
  $.ui.autocomplete.prototype._renderItem = function (ul, item) {
    return $("<li>").append("<a href='" + "/search/member/blog/" + item.group_id + "/" + item.ct + "/" + "'>" + item.name + "</a>").appendTo(ul);
  };

  $("input.autocomplete").autocomplete({
    source: function (req, res) {
      $.ajax({
        url: "/search/autocomplete_name/?input=" + encodeURIComponent(req.term),
        type: "get",
        cache: false,
        dataType: "json",
        success: function (data) {
          res(data);
        }
      });
    },
    focus: function (event, ui) {
      $("input.autocomplete").val(ui.item.name);
      return false;
    },
    select: function (event, ui) {
      window.location.href = "/search/member/blog/" + ui.item.group_id + "/" + ui.item.ct + "/";
      return false;
    },
    delay: 0,
    minLength: 2
  });
});