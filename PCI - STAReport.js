if (!$) {
	var $ = jQuery;
}

$(document).ready(() => {
	var target = document.getElementById('stareport-pending-loading');
	var target2 = document.getElementById('stareport-pastdue-loading');
	
	var observer = (tar) => {
		return new MutationObserver(mutations => {
			mutations.forEach(mutationRecord => {
				if (mutationRecord.target.style.display != 'none') {
					return;
				}
				decision(tar);
			});
		});
	}
	
	observer('pending').observe(target, {
		attributes: true,
		attributeFilter: ['style']
	});
	observer('pastdue').observe(target2, {
		attributes: true,
		attributeFilter: ['style']
	});

	function decision(tar) {
		var rows = $(`#stareport-${tar}-datatable > tbody > tr[role=row] > td:nth-child(9)`);
		for (i = 0; i < rows.length; i++) {
			let $this = $(rows[i]);
			let $html = $this.html();
			switch ($html) {
				case 'A+': $this.html($html + ': <b>100%</b>'); break;
				case 'A': $this.html($html + ': <b>98%</b>'); break;
				case 'B': $this.html($html + ': <b>93%</b>'); break;
				case 'C': $this.html($html + ': <b>88%</b>'); break;
				case 'D': $this.html($html + ': <b>83%</b>'); break;
				case 'E': $this.html($html + ': <b>78%</b>'); break;
				case 'G': $this.html($html + ': <b>73%</b>'); break;
				case 'H': $this.html($html + ': <b>68%</b>'); break;
				case 'I': $this.html($html + ': <b>63%</b>'); break;
				case 'J': $this.html($html + ': <b>58%</b>'); break;
			}
		}
		rows = $(`#stareport-${tar}-datatable > tbody > tr[role=row] > td:nth-child(5)`);
		for (i = 0; i < rows.length; i++) {
			let $this = $(rows[i]);
			let $html = $this.html();
			if (/TIM/i.test($html)) {
				$this.html('');
			}
		}
		$(document).trigger('resize');
		$('#stareport-pending-datatable > thead > tr > th[aria-label="Date: activate to sort column descending"]').trigger('click');
	};
});