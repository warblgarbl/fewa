if (!$) {
	var $ = jQuery;
}

$(document).ready(() => {
	var observer = new MutationObserver(mutations => {
		mutations.forEach(mutationRecord => {
			if (mutationRecord.target.style.display != 'none') {
				return;
			}
			if (/(New|Hold)$/.test(window.location.href)) {
				var n = 4;
			} else {
				var n = 5;
			}
			var $rows = $(`.datatable > tbody > tr[role=row] > td:nth-child(${n})`);
			for (i = 0; i < $rows.length; i++) {
				var $this = $rows.eq(i);
				var $html = $this.html();
				switch ($html) {
					case 'A': $this.html($html += ': 100%'); break;
					case 'A': $this.html($html += ': 98%'); break;
					case 'B': $this.html($html += ': 93%'); break;
					case 'C': $this.html($html += ': 88%'); break;
					case 'D': $this.html($html += ': 83%'); break;
					case 'E': $this.html($html += ': 78%'); break;
					case 'G': $this.html($html += ': 73%'); break;
					case 'H': $this.html($html += ': 68%'); break;
					case 'I': $this.html($html += ': 63%'); break;
					case 'J': $this.html($html += ': 58%'); break;
				}
			}
			$(document).trigger('resize');
		});
	});

	var target = document.getElementById('loading-table');

	observer.observe(target, {
		attributes: true,
		attributeFilter: ['style']
	});
});