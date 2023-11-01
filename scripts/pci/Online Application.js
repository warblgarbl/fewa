$(document).ready(() => {
  $('input').filter((i, e) => $(e).attr("data-val-maxlength-max"))
    .on('keydown keyup', function () {
      var $this = $(this);
      var $val = $this.val();
      var $max = parseInt($this.attr("data-val-maxlength-max"));
      if ($val.length > $max)
        $this.val($val.substring(0, $max));
    });
})