if (!$) {
	var $ = jQuery;
}

$(document).ready(() => {
	let url = document.URL;
	if (/.*OnlineApplication\/?$/.test(url)) {
		let $rows = $('.dataTable > tbody > tr[role=row] > td:nth-child(3)');
		for (i = 0; i < $rows.length; i++) {
			let $row = $rows.eq(i);
			let date = new Date($row.html());
      let offset = new Date(date.toLocaleString('en-US', {timeZone: 'America/Chicago'}));
      if (date.getTime() !== offset.getTime()) {
        date.setTime(2 * date.getTime() - offset.getTime());
        $row.html(date.toLocaleString());
      }
		}
		
	} else if (/.*PCILive.*/.test(url)) {
		let observer = new MutationObserver(mutations => {
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
					var $row = $rows.eq(i);
					var $html = $row.html();
					switch ($html) {
						case 'A+': $row.html($html += ': 100%'); break;
						case 'A': $row.html($html += ': 98%'); break;
						case 'B': $row.html($html += ': 93%'); break;
						case 'C': $row.html($html += ': 88%'); break;
						case 'D': $row.html($html += ': 83%'); break;
						case 'E': $row.html($html += ': 78%'); break;
						case 'G': $row.html($html += ': 73%'); break;
						case 'H': $row.html($html += ': 68%'); break;
						case 'I': $row.html($html += ': 63%'); break;
						case 'J': $row.html($html += ': 58%'); break;
					}
				}
				$(document).trigger('resize');
			});
		});
		
		let target = $('#loading-table').get()[0];
		
		observer.observe(target, {
			attributes: true,
			attributeFilter: ['style']
		});
		
	} else if (/.*STAReport\/?$/.test(url)) {
		var pend = $('#stareport-pending-loading');
		var pd = $('#stareport-pastdue-loading');
    
    let buttons = $('.dt-buttons').eq(0);
    let btn = $('<button>');
    let attr = {
      'class': buttons.children('button').eq(0).attr('class'),
      'onclick': "decision('pending');decision('pastdue');"
    }
    btn.attr(attr).append($('<span>').html('Decision %'));
    buttons.append(btn);
		
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
		
		observer('pending').observe(pend.get()[0], {
			attributes: true,
			attributeFilter: ['style']
		});
		observer('pastdue').observe(pd.get()[0], {
			attributes: true,
			attributeFilter: ['style']
		});
	}
});

function decision(tar) {
	var $rows = $(`#stareport-${tar}-datatable > tbody > tr[role=row]`);
  var shade = ['lavender', 'honeydew'];
  var swap = 0;
  var date;
	for (i = 0; i < $rows.length; i++) {
		let $row = $rows.eq(i);
    let $child = $row.children();
    let $date = $child.filter(a => a === 0);
    if (date != $date.html()) {
      date = $date.html();
      switch (swap) {
        case 0: swap = 1; break;
        case 1: swap = 0; break;
      }
    }
    $date.attr('style', 'background-color:' + shade[swap]);
    
    let $rep = $child.filter(a => a === 4);
    if (/TIM/i.test($rep.html())) {
      $rep.html('');
    }
    
    let $dec = $child.filter(a => a === 8);
		switch ($dec.html()) {
			case 'A+': $dec.html($dec.html() + ': <b>100%</b>'); break;
			case 'A': $dec.html($dec.html() + ': <b>98%</b>'); break;
			case 'D': $dec.html($dec.html() + ': <b>83%</b>'); break;
			case 'C': $dec.html($dec.html() + ': <b>88%</b>'); break;
			case 'B': $dec.html($dec.html() + ': <b>93%</b>'); break;
			case 'E': $dec.html($dec.html() + ': <b>78%</b>'); break;
			case 'G': $dec.html($dec.html() + ': <b>73%</b>'); break;
			case 'H': $dec.html($dec.html() + ': <b>68%</b>'); break;
			case 'I': $dec.html($dec.html() + ': <b>63%</b>'); break;
			case 'J': $dec.html($dec.html() + ': <b>58%</b>'); break;
		}
	}
	$(document).trigger('resize');
	$(`#stareport-${tar}-datatable > thead > tr > th[aria-label="Date: activate to sort column descending"]`).trigger('click');
}