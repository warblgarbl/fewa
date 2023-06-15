if (!$) {
	var $ = jQuery;
}

$(document).ready(() => {
	var $labApp = $('label[for="custom_pc"]');
	var $labCo = $('label[for="custom_sc"]');
	
	$labApp.wrapInner('<a href="javascript:void(0);" onclick="appOnly();"></a>');
	$labCo.wrapInner('<a href="javascript:void(0);" onclick="coOnly();"></a>');
});

function appOnly() {
	if (!$('#custom_pc:checked').length) {
		$('#custom_pc').click();
	}
	if ($('#custom_sc:checked').length) {
		$('#custom_sc').click();
	}
	$('#btnCustom').click();
}

function coOnly() {
	if ($('#custom_pc:checked').length) {
		$('#custom_pc').click();
	}
	if (!$('#custom_sc:checked').length) {
		$('#custom_sc').click();
	}
	$('#btnCustom').click();
}