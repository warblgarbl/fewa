if (!$) {
	var $ = jQuery;
}

$(document).on({
	'focusout': function() {
		var $this = $(this);
		if (!$this.val().trim()) {
			setTimeout($('#CoBorrower_txtSurName').val(''), 25)
		}
	}
}, '#CoBorrower_txtFirstName')
.ready(() => {
	var $users = $('#BranchUser_cboUser > option');
	for (i = 0; i < $users.length; i++) {
		var $this = $($users[i]);
		if (/color/.test($this.attr('style'))) {
			$this.attr('selected', 'selected');
			if ($this.html() === 'TINA PANE') {
				$('#CurrentAddress_faUSA_rbnNormal').trigger('click');
			}
			break;
		}
	}
	$('#UIOptions_tuc_credit').trigger('click');
	$('#Borrower_txtFirstName').trigger('focus');
});