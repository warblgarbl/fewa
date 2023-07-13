const storage = chrome.storage.sync;

$(document).ready(() => {
  storage.get().then(result => {
    var pref = result.preferences.pci;
    if (pref.time) {
      let $rows = $('.dataTable > tbody > tr[role=row] > td:nth-child(3)');
      for (let i = 0; i < $rows.length; i++) {
        let $row = $rows.eq(i);
        let date = new Date($row.html());
        let offset = new Date(date.toLocaleString('en-US', { timeZone: "America/Chicago" }));
        if (date.getTime() !== offset.getTime()) {
          date.setTime(2 * date.getTime() - offset.getTime());
          $row.html(date.toLocaleString());
        }
      }
    }
  })
});