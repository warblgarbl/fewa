if (!$) {
	var $ = jQuery;
}

$(document).ready(() => {
	var url = document.URL;
	if (/.*OnlineApplication\/?$/.test(url)) {
		var $rows = $('.dataTable > tbody > tr[role=row] > td:nth-child(3)');
		for (i = 0; i < $rows.length; i++) {
			var $this = $($rows[i]);
			var date = new Date($this.html() + ' GMT-0500');
			var time = date.toLocaleTimeString();
			date = date.toLocaleDateString().split('/')
				.map(d => (d.length === 1) ? '0' + d : d).join('/');
			$this.html(date + ' ' + time);
		}
		
	} else if (/.*PCILive.*/.test(url)) {
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
		
	} else if (/.*STAReport\/?$/.test(url)) {
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
		}
	}
});