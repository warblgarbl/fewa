if (!$) {
	var $ = jQuery;
} else if (typeof $.jquery == undefined) {
	console.log('$ occupied');
}

$(document).ready(() => {
	var $li = $('<li>');
	var $inp = $('<input>');
	var $lab = $('<label>');
	$inp.attr({
		'id': "fewa_bc",
		'type': "checkbox",
		'name': "fewa_bc",
		'disabled': true
	});
	$lab.html('BOTH').attr({
		'for': "fewa_bc"
	});
	$li.append($inp, $lab);
	
	var $labApp = $('label[for="custom_pc"]');
	var $labCo = $('label[for="custom_sc"]');
	
	$labApp.parent('li').before($li);
	$lab.wrapInner('<a href="javascript:void(0);" onclick="only(0);"></a>');
	$labApp.wrapInner('<a href="javascript:void(0);" onclick="only(1);"></a>');
	$labCo.wrapInner('<a href="javascript:void(0);" onclick="only(2);"></a>');
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