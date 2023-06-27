$(document).on({
    click: function() {
      setTimeout(() => {
        $('#selectDealerModal div.formField').append(
          $('<div>').append(
            $('<label>').attr({
              class: "label label--stacked",
              for: "product"
            }).html('Product'),
            "&nbsp;"
          ),
          $('<div>').attr({
            class: "selectField--wrapper"
          }).append(
            $('<select>').attr({
              disabled: "true",
              class: "selectField",
              name: "ProductOrServiceType"
            }).append(
              $('<option>').attr({
                value: "",
                class: "selectField-option selectField-option-selected"
              }).html('Select One')
            )
          )
        );
      }, 0);
    }
  }, '#applications button')
  .on({
    change: function() {
      var $this = $(this);
      var $val = $this.val();
      var dealID = $this.children(`[value="${$val}"]`).eq(0).html();
      var $prod = $('select[name="ProductOrServiceType"]');
      if (/002306/.test(dealID)) {
        chrome.storage.sync.set({
          dealer: "Water Treatment"
        });
        $prod.removeAttr('disabled').empty().append(
          $('<option>').attr({
            value: "",
            class: "selectField-option selectField-option-selected"
          }).html('Select One'),
          $('<option>').attr({
            value: "AIRPURIFER",
            title: "",
            class: "selectField-option"
          }).html('Air purifier'),
          $('<option>').attr({
            value: "WTRHTR",
            title: "",
            class: "selectField-option"
          }).html('Water heater'),
          $('<option>').attr({
            value: "WATERTREAT",
            title: "",
            class: "selectField-option"
          }).html('Water treatment system')
        )
      } else if (/532306/.test(dealID)) {
        chrome.storage.sync.set({
          dealer: "Home Improvement"
        });
        $prod.removeAttr('disabled').empty().append(
          $('<option>').attr({
            value: "",
            class: "selectField-option selectField-option-selected"
          }).html('Select One'),
          $('<option>').attr({
            value: "AIRPURIFER",
            title: "",
            class: "selectField-option"
          }).html('Air purifier'),
          $('<option>').attr({
            value: "BATHSHWR",
            title: "",
            class: "selectField-option"
          }).html('Bath\/shower\/walk-in tub'),
          $('<option>').attr({
            value: "HVAC",
            title: "",
            class: "selectField-option"
          }).html('Heating\/air conditioning'),
          $('<option>').attr({
            value: "INSULRADBR",
            title: "",
            class: "selectField-option"
          }).html('Insulation\/radiant barrier'),
          $('<option>').attr({
            value: "REMODELING",
            title: "",
            class: "selectField-option"
          }).html('Remodeling\/addition'),
          $('<option>').attr({
            value: "SOLARFAN",
            title: "",
            class: "selectField-option"
          }).html('Solar fan'),
          $('<option>').attr({
            value: "SOLARWTRHT",
            title: "",
            class: "selectField-option"
          }).html('Solar water heater'),
          $('<option>').attr({
            value: "WTRHTR",
            title: "",
            class: "selectField-option"
          }).html('Water heater')
        )
      }
      if (!$val.length) {
        $prod.attr({
          disabled: ""
        });
        $('#selectDealerModal .button--primary').attr({
          disabled: ""
        }).html('Confirm').clearQueue();
      } else {

        setTimeout(() => {
          $('#selectDealerModal .button--primary').attr({
              disabled: ""
            }).html(3).clearQueue()
            .delay(1000).queue(function(x) {
              this.innerHTML = 2;
              x();
            })
            .delay(1000).queue(function(x) {
              this.innerHTML = 1;
              x();
            })
            .delay(1000).queue(function(x) {
              $(this).html('Confirm').removeAttr('disabled');
              x();
            });
        }, 0);
      }
    }
  }, '#selectDealerModal .selectField[name="dealers"]')
  .on({
    change: function() {
      var $this = $(this);
      var $that = $('#selectDealerModal .button--primary')
      if ($this.val().length) {
        $that.removeAttr('disabled');
      } else {
        $that.attr({
          disabled: ""
        });
      }
    }
  }, '.selectField[name="ProductOrServiceType"]');
