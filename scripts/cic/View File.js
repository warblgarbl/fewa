const storage = chrome.storage.sync;

$(document).ready(() => {
  var $label = $('<label>').html("BOTH").attr({ 'for': "fewa_bc" });
  var $appL = $('label[for="custom_pc"]');
  var $coL = $('label[for="custom_sc"]');

  $label.wrapInner($('<a>').attr({ href: "javascript:void(0);" }).on('click', () => only(0)));
  $appL.wrapInner($('<a>').attr({ href: "javascript:void(0);" }).on('click', () => only(1)));
  $coL.wrapInner($('<a>').attr({ href: "javascript:void(0);" }).on('click', () => only(2)));

  $appL.parent('li').before($('<li>').append($('<input>').attr({ type: "checkbox", id: "fewa_bc", name: "fewa_bc", disabled: "" }), $label));
  storage.get().then(result => {
    var pref = result.preferences.cic;
    if (pref.auto_open && /ReportResult/.test(document.URL))
      setTimeout(() => {
        $('#btnCustom').trigger('click');
      }, 1000 * pref.auto_open_delay);
  });
  $('#custom_pc, #custom_sc, #fewa_bc').attr({ disabled: "" });
});

function only(n) {
  var $app = $('#custom_pc');
  var $co = $('#custom_sc');

  switch (n) {
    case 0:
      if ($app.filter(':checked').length === 0)
        $app.removeAttr('disabled').trigger('click');
      if ($co.filter(':checked').length === 0)
        $co.removeAttr('disabled').trigger('click');
      break;
    case 1:
      if ($app.filter(':checked').length === 0)
        $app.removeAttr('disabled').trigger('click');
      if ($co.filter(':checked').length !== 0)
        $co.removeAttr('disabled').trigger('click');
      break;
    case 2:
      if ($app.filter(':checked').length !== 0)
        $app.removeAttr('disabled').trigger('click');
      if ($co.filter(':checked').length === 0)
        $co.removeAttr('disabled').trigger('click');
      break;
  }
  $('#custom_pc, #custom_sc').removeAttr('disabled');
  $('#btnCustom').trigger('click');
  $('#custom_pc, #custom_sc').attr({ disabled: "" });
}