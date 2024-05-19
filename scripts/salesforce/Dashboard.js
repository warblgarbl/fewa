var $window = {};
$window.dashInitiate = undefined;
$window.dashRefresh = undefined;
$window.dashInterval = 1000 * 60 * 10;

function getLastRefresh() {
  var lastRefresh = $('span.lastRefreshDate').html().split('As of ')[1].split(', '); // [MMM d, YYYY, H:mm a]
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
  // Convert MMM string to 0-index
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
  // Convert 12-hour to 24-hour
  if (lastRefresh.time.hour == 12 && !lastRefresh.time.pm) // midnight hour
    lastRefresh.time.hour = 0;
  else if (lastRefresh.time.hour < 12 && lastRefresh.time.pm) // afternoon hours
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
  // Do not run during normal business hours.
  if (now.getHours() < 7 || now.getHours() > 17)
    return;
  var refresh = $('.dashboard button.refresh');
  var prevRefresh = getLastRefresh();
  // Only refresh if at least 5 minutes have passed since last refresh
  if ((now.getTime() - prevRefresh.getTime()) > ($window.dashInterval - 1000)) {
    refresh.click();
    setTimeout(() => {
      // If refresh was unsuccessful, refresh the iframe
      if (prevRefresh.getTime() == getLastRefresh().getTime())
        document.location.reload();
    }, 1000 * 10);
  }
}

$(document).ready(() => {
  var observer = new MutationObserver(() => {
    // Only run a single time, 10 seconds after refresh button is available
    if ($('.dashboard button.refresh').length > 0 && $window.dashInitiate === undefined) {
      $window.dashInitiate = setTimeout(() => {
        var autoRefresh = $('<button>').html('Auto-refresh').attr({
          class: 'slds-button slds-button_neutral auto-refresh',
          type: 'button'
        });
        $('.dashboard button.refresh').after(autoRefresh);
        autoRefresh.click();
      }, 1000 * 10);
    }
  })
  observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
}).on({
  click: function () {
    var $this = $(this);
    if ($window.dashRefresh === undefined) {
      $this.addClass('refreshing');
      refreshCycle();
      $window.dashRefresh = setInterval(refreshCycle, $window.dashInterval);
    } else {
      $this.removeClass('refreshing');
      clearTimeout($window.dashInitiate);
      clearInterval($window.dashRefresh);
      $window.dashRefresh = undefined;
    }
  }
}, 'button.auto-refresh');