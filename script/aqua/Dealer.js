if (!$) {
	var $ = jQuery;
} else if (typeof $.jquery == undefined) {
	console.log('$ occupied');
}

$(document).on({
	'change': function() {
		var $this = $(this);
		var dealer = $this.children('[value="' + $this.val() + '"]').eq(0).html();
		if (/002306/.test(dealer)) {
			sessionStorage.setItem('dealer', 'Water Treatment');
		} else if (/532306/.test(dealer)) {
			sessionStorage.setItem('dealer', 'Home Improvement');
		}
	}
}, '#selectDealerModal .selectField[name="dealers"]');