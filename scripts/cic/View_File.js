$(document).ready(() => {
	var $label = $('<label>').html('BOTH').attr({'for': "fewa_bc"});
	var $appL = $('label[for="custom_pc"]');
	var $coL = $('label[for="custom_sc"]');

	$label.wrapInner($('<a>').attr({'href': "javascript:void(0);"}).on('click', () => only(0)));
	$appL.wrapInner($('<a>').attr({'href': "javascript:void(0);"}).on('click', () => only(1))));
	$coL.wrapInner($('<a>').attr({'href': "javascript:void(0);"}).on('click', () => only(2))));
  
	$appL.parent('li').before(
    $('<li>').append(
      $('<input>').attr({'type': "checkbox", 'id': "fewa_bc", 'name': "fewa_bc", 'disabled': ""}),
      $label
    )
  );
  if (/ReportResult/.test(document.URL)) {
    $('#btnCustom').click();
  }
});

function only(n) {
	var $app = $('#custom_pc');
	var $co = $('#custom_sc');
	
	switch (parseInt(n)) {
		case 0: {
			if ($app.filter(':checked').length === 0) $app.click();
			if ($co.filter(':checked').length === 0) $co.click();
		} break;
		case 1: {
			if ($app.filter(':checked').length === 0) $app.click();
			if ($co.filter(':checked').length !== 0) $co.click();
		} break;
		case 2: {
			if ($app.filter(':checked').length !== 0) $app.click();
			if ($co.filter(':checked').length === 0) $co.click();
		} break;
	}
	
	$('#btnCustom').click();
}