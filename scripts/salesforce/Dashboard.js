window.dashInitiate = undefined;
window.dashRefresh = undefined;

function getLastRefresh() {
  var lastRefresh = $('span.lastRefreshDate').eq(0).html().split('As of ')[1].split(', ');
  lastRefresh = {
    date: {
      month: lastRefresh[0].split(' ')[0],
      day: Number(lastRefresh[0].split(' ')[1]),
      year: Number(lastRefresh[1])
    },
    time: {
      hour: Number(lastRefresh[2].split(':')[0]),
      minute: Number(lastRefresh[2].split(':')[1].split(' ')[0]),
      pm: /PM/i.test(lastRefresh[2])
    }
  }
  switch (lastRefresh.date.month) {
    case 'January':
      lastRefresh.date.month = 0;
      break;
    case 'February':
      lastRefresh.date.month = 1;
      break;
    case 'March':
      lastRefresh.date.month = 2;
      break;
    case 'April':
      lastRefresh.date.month = 3;
      break;
    case 'May':
      lastRefresh.date.month = 4;
      break;
    case 'June':
      lastRefresh.date.month = 5;
      break;
    case 'July':
      lastRefresh.date.month = 6;
      break;
    case 'August':
      lastRefresh.date.month = 7;
      break;
    case 'September':
      lastRefresh.date.month = 8;
      break;
    case 'October':
      lastRefresh.date.month = 9;
      break;
    case 'November':
      lastRefresh.date.month = 10;
      break;
    case 'December':
      lastRefresh.date.month = 11;
      break;
  }
  if (lastRefresh.time.hour == 12 && !lastRefresh.time.pm)
    lastRefresh.time.hour = 0;
  else if (lastRefresh.time.hour < 12 && lastRefresh.time.pm)
    lastRefresh.time.hour += 12;
  return new Date(
    lastRefresh.date.year,
    lastRefresh.date.month,
    lastRefresh.date.day,
    lastRefresh.time.hour,
    lastRefresh.time.minute);
}

function refreshCycle() {
  var now = new Date();
  if (now.getHours() < 7 || now.getHours() > 17)
    return;
  var refresh = $('button.refresh').eq(0);
  var prevRefresh = getLastRefresh();
  if ((now.getTime() - prevRefresh.getTime()) > (1000 * 60 * 4)) {
    refresh.click();
    setTimeout(() => {
      if (prevRefresh.getTime() == getLastRefresh().getTime())
        document.location.reload();
    }, 1000 * 20);
  }
}

$(document).ready(() => {
  var observer = new MutationObserver(() => {
    if ($('button.refresh').length > 0 && this.dashInitiate == undefined) {
      this.dashInitiate = setTimeout(() => {
        refreshCycle();
        this.dashRefresh = setInterval(refreshCycle, 1000 * 60 * 5);
      }, 1000 * 10);
    }
  })
  observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
});