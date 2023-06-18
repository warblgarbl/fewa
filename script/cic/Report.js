if (!$) {
	var $ = jQuery;
}

var $fewaAlert = $('<audio>').attr({
  'id': "fewaAlert",
  'src': "https://docs.google.com/uc?export=download&id=149sQQRlfyVDEJ_KpJFJ8KBw_qGfsmsYX",
  'paused': true
});
var fewaBop = 'wait';
$('body').children().eq(0).before($fewaAlert);
var $fewaLoad = $('<div>').html('Loading...').attr({
  'id': "fewaLoad",
  'style': "text-align:center;"
});

$('tbody').filter((i, e) => $(e).prev('thead').find('td.mcl2-report-section-header').filter((a, b) => {
    let $b = $(b);
    let id = b.innerHTML.split(' ')[0];
    if (/(OPEN|CLOSED|DEROGATORY)/.test(id)) {
      $b.attr('id', id);
      $b.next().attr('style', 'text-align:center;').append($('<a>').attr({'href': "#SUMMARY"}).html('Back to summary'));
      return 1;
    } else return 0;
  }).length).eq(0).parent('table').parent('span').before($('<span>')
    .append($('<table>').attr({'style': 'width:100%;border-collapse:collapse;', 'cellspacing': '0', 'cellpadding': '0'})
      .append($('<thead>')
        .append($('<tr>')
          .append($('<td>').attr('style', 'border-collapse: separate;')
            .append($('div.mcl2-section-content-space').eq(0).clone())
            .append($('<table>').attr({'cellspacing': '0', 'class': 'mcl12-table-ie-compatibility', 'align': 'center', 'style': 'width:100%;vertical-align:middle;border-bottom-style:solid;border-bottom-width:1px;border-bottom-color:Black;'})
              .append($('<colgroup>')
                .append($('<col>').attr('style', 'width:12%'))
                .append($('<col>').attr('style', 'width:76%'))
                .append($('<col>').attr('style', 'width:12%')))
              .append($('<tbody>')
                .append($('<tr>')
                  .append($('<td>'))
                  .append($('<td>').attr({'class': 'mcl2-report-section-header', 'style': 'padding:2px'}).html('SUMMARY'))
                  .append($('<td>').attr('style', 'text-align:right;')))))
            .append($('div.mcl2-section-content-space').eq(0).clone()))))
      .append($fewaLoad)));


$(document).on('click.f keydown.f', function() {
	if (fewaBop === true) {
		$fewaAlert.trigger('play');
	}
	if (fewaBop !== 'wait') {
		$(this).off('.f');
	}
})
.ready(() => {
	var $subs = $('td.mcl2-report-body').filter((i, e) => /\*{3}-\*{2}/.test(e.innerHTML));
	var $reps = $('td.mcl2-report-body').filter((i, e) => /\*{5}/.test(e.innerHTML));
	for (let i = 0; i < $subs.length; i++) {
    let $sub = $subs.eq(i);
    let $rep = $reps.eq(i);
		if ($sub.html().substr(-4) != $rep.html().substr(-4)) {
			$sub.parent().attr('style', 'background-color:palevioletred');
			$rep.attr('style', 'background-color:lightgreen;' + $rep.attr('style'));
			fewaBop = true;
		}
	}
  if (fewaBop !== true) {
    fewaBop = false;
  }
	
	$('td').filter((i,e) => e.innerHTML === 'SCORE MODELS').attr('id', 'SUMMARY');
  var $tbody = $('tbody').filter((i, e) => $(e).prev('thead').find('td.mcl2-report-section-header').filter((a, b) => /^(OPEN|CLOSED|DEROGATORY)/.test(b.innerHTML)).length);
	var $open = $tbody.eq(0).find('tr td table tbody');
	var $closed = $tbody.eq(1).find('tr td table tbody');
	var $derog = $tbody.eq(2).find('tr td table tbody');
	
	var $body = $('<tbody>');
	var $label = $('<div>').attr('class', 'mcl2-report-label');
	var $table = $('<table>').attr({
		'cellspacing': '0',
		'class': 'mcl2-report-body mcl2-cell-padding mcl2-cell-border mcl2-section-content-width mcl2-table-ie-compatibility',
		'align': 'center',
		'style': 'vertical-align:middle;'
	});
	
	
	var title = ['ACCT TYPE', '#', 'BALANCE', 'HI CREDIT', 'PAYMENT', 'PAST DUE', '30 days', '60 days', '90+ days'];
	var col = [];
	for (let i = 0; i < title.length; i++) {
		title[i] = $('<td>').attr('class', 'mcl2-report-label').html(title[i]);
		switch (i) {
			case 0: col.push($('<col>').attr('style', 'width:8%;')); break;
			case 1: col.push($('<col>').attr('style', 'width:4%;')); break;
			case 6: case 7: col.push($('<col>').attr('style', 'width:6%;')); break;
			case 8: col.push($('<col>').attr('style', 'width:8%;')); break;
			default: col.push($('<col>').attr('style', 'width:17%;'));
		}
	}
	$table.append($('<colgroup>').append(col))
		.append($('<thead>')
			.append($('<tr>').attr({'class': 'mcl2-cell-shade', 'style': 'text-align:center;'})
				.append(title)));
	
	var num = new RegExp(/\d+/);
	var usd = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0});
	var section = [$open, $closed, $derog];
	for (let a = 0; a < section.length; a++) {
		let sec = section[a];
		if (sec.eq(0).children().length > 1) {
			let $t = $table.clone();
			let $b = $('<tbody>');
			let total = {
				'bal': 0,
				'hi': 0,
				'pay': 0,
				'pd': 0,
				'pd30': 0,
				'pd60': 0,
				'pd90': 0
			}
			switch (a) {
				case 0: total['type'] = '<a href="#OPEN">OPEN</a>'; break;
				case 1: total['type'] = '<a href="#CLOSED">CLOSED</a>'; break;
				case 2: total['type'] = '<a href="#DEROGATORY">DEROG</a>';
			}
			
			let rev = sec.filter((i, e) => /ACCT TYPE.*REV/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let inst = sec.filter((i, e) => /ACCT TYPE.*INST/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let _open = sec.filter((i, e) => /ACCT TYPE.*OPEN/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let mtg = sec.filter((i, e) => /ACCT TYPE.*MTG/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let leas = sec.filter((i, e) => /ACCT TYPE.*LEAS/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let auto = sec.filter((i, e) => /ACCT TYPE.*AUTO/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let edu = sec.filter((i, e) => /ACCT TYPE.*EDU/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let coll = sec.filter((i, e) => /ACCT TYPE.*COLL/.test($(e).children('tr').eq(1).children('td').eq(2).html()));
			let other = sec.filter((i, e) => {
				let test = $(e).children('tr').eq(1).children('td').eq(2).html();
				if (/ACCT TYPE/.test(test) && !/(REV|INST|OPEN|MTG|LEAS|AUTO|EDU|COLL)/.test(test)) {
					return 1;
				} else return 0;
			});
			
			let types = [mtg, auto, edu, rev, inst, _open, leas, coll, other];
			let names = ['mtg', 'auto', 'edu', 'rev', 'inst', 'open', 'leas', 'coll', 'other'];
			for (let b = 0; b < types.length; b++) {
				if (types[b].length) {
          let accts = types[b];
          let row = {
            'type': names[b].toUpperCase(),
            'count': accts.length,
            'bal': 0,
            'hi': 0,
            'pay': 0,
            'pd': 0,
            'pd30': 0,
            'pd60': 0,
            'pd90': 0
          }
					for (let c = 0; c < accts.length; c++) {
						let acct = accts.eq(c);
						let row1 = acct.children('tr').eq(1).children('td');
						let row2 = acct.children('tr').eq(2).children('td');
						let bal = row2.eq(3).text();
						let hi = row1.eq(4).text();
						let pd = row2.eq(4).text();
						let pay = row1.eq(5).text();
						let pd30 = row1.eq(6).text().split('30')[1];
						let pd60 = row1.eq(7).text().split('60')[1];
						let pd90 = row1.eq(8).text().split('90')[1];
						
						row.bal += num.test(bal) ? parseInt(num.exec(bal)) : 0;
						row.hi += num.test(hi) ? parseInt(num.exec(hi)) : 0;
						row.pay += num.test(pay) ? parseInt(num.exec(pay)) : 0;
						row.pd += num.test(pd) ? parseInt(num.exec(pd)) : 0;
						row.pd30 += num.test(pd30) ? parseInt(num.exec(pd30)) : 0;
						row.pd60 += num.test(pd60) ? parseInt(num.exec(pd60)) : 0;
						row.pd90 += num.test(pd90) ? parseInt(num.exec(pd90)) : 0;
					}
					for (let key in row) {
						if (!/type/.test(key)) {
							total[key] += row[key];
							if (!/(\d|count)/.test(key)) {
								row[key] = usd.format(row[key]);
							}
						}
					}
					$b.append($('<tr>').attr({'style': "text-align:center;"})
						.append($('<td>').html(row.type))
						.append($('<td>').html(row.count))
						.append($('<td>').html(row.bal))
						.append($('<td>').html(row.hi))
						.append($('<td>').html(row.pay))
						.append($('<td>').html(row.pd))
						.append($('<td>').html(row.pd30))
						.append($('<td>').html(row.pd60))
						.append($('<td>').html(row.pd90)));
				}
			}
			let $head = $t.find('thead tr td');
			for (let key in total) {
				if (!/(\d|count|type)/.test(key)) {
					total[key] = usd.format(total[key]);
				}
			}
			for (let b = 0; b < $head.length; b++) {
				let $h = $head.eq(b);
				let $l = $label.clone();
				$l.html($h.html());
				$h.empty().append($l);
				switch (b) {
					case 0: $h.append(total.type); break;
					case 1: $h.append(total.count); break;
					case 2: $h.append(total.bal); break;
					case 3: $h.append(total.hi); break;
					case 4: $h.append(total.pay); break;
					case 5: $h.append(total.pd); break;
					case 6: $h.append(total.pd30); break;
					case 7: $h.append(total.pd60); break;
					case 8: $h.append(total.pd90);
				}
			}
			$body.append($t.append($b)).append($('div.mcl2-section-content-space').eq(0).clone());
		}
	}
  $fewaLoad.hide().after($body);
});