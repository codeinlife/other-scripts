/* ****************************************************************************
	Onsale Module
_______________________________________________________________________________
Requirements
	* New filesin pac7.2/script/netCommerce/onsale
		- onsale.js
		- ev_unavail.json
		- ev_limited.json
_______________________________________________________________________________
**************************************************************************** */

(function () {
  var evScriptPath =
    "//s3-us-west-2.amazonaws.com/pachtml-production/www/" + linkID + "/onsale";
  // =============================================
  // 	LOAD SETTINGS BEFORE RUNNING THE ONSALE
  // =============================================
  jq.getScript(
    evScriptPath + "/settings.js?timestamp=" + new Date().getTime(),
    function () {
      var onsaleLink =
          "/cgi-bin/ncommerce3/SEGetEventList?groupCode=" +
          os.calendar.groupCode +
          "&linkID=" +
          linkID,
        onsaleRedirect = os.calendar.mode
          ? printCalendarLink(linkID, os.groupCode, os.calendar.startDate) +
            "&numMonths=" +
            os.calendar.numMonths
          : "";

      if (typeof jq == "undefined") jq = jQuery.noConflict();

      if (!os.mode) return;

      // ==============================
      // 	Before page loads
      //	(redirects, etc)
      // ==============================
      if (
        os.calendar.mode &&
        onsaleRedirect != "" &&
        common.pageName == "DisplayEventList.html" &&
        getQueryVariable("groupCode") == os.groupCode &&
        getQueryVariable("timeDateFrom") == ""
      ) {
        location.replace(onsaleRedirect);
      }

      // ==============================
      // 	After page loads
      //	(update pages)
      // ==============================
      jq(document).ready(function () {
        var currentPage = common.pageName;
        if (
          currentPage == "DisplayEventList.html" &&
          /timeDateFrom/g.test(window.location.href)
        ) {
          currentPage = "calendarPage";
        }

        // ******************** onsale operations ********************
        if (currentPage == "calendarPage") {
          updateCalendar();
        } else if (currentPage == "DisplayEventInfo.html") {
          updateEventInfo();
        } else if (currentPage == "CartDisplay.html") {
          updateCart();
        } else if (currentPage == "DisplayGroupList.html") {
          updateGroupList();
        }
        // ******************** END onsale operations ********************

        function updateCalendar() {
          // process limited events
          jq.getJSON(
            evScriptPath +
              "/onsale_events.json?timestamp=" +
              new Date().getTime(),
            function (data) {
              modifyCalendarEvents(data.ev_limited, os.limited);
              modifyCalendarEvents(data.ev_singleSeats, os.singleSeats);
              disableEvents(data.ev_unavail);
            }
          );

          // hide cal elems
          if (!os.calendar.showNav) {
            jq("#calNav").parent().hide();
          }

          if (!os.calendar.showHamburger) {
            jq('a[title="Click here to view event list."]').hide();
          }

          if (!os.calendar.showViewByGroup) {
            jq('#content [name="groupSelect"]').closest("form").hide();
          }

          if (!os.calendar.showPromo) {
            jq('[name="promoForm"]').hide();
          }

          if (!os.calendar.showSearch) {
            jq("#superSearchModule").hide();
          }

          if (!os.calendar.showHovers) {
            // hide forms msg and logos
            jq("[data-evcode]").each(function () {
              jq("blockquote", this).hide();
            });
          }

          // hide Event LOGO image from the calendar
          if (!os.calendar.showLogoImage) {
            // FOR STANDARD LOGO
            jq("#calendar li[data-evcode] img").hide().next().hide();
            // FOR AWS LOGO MODULE
            jq(
              '#calendar li[data-evcode] span[data-logogroup="' +
                os.groupCode +
                '"]'
            )
              .hide()
              .next()
              .hide();
          }

          // hide Event GROUP description from the calendar
          if (!os.calendar.showGroupDesc) {
            jq("#calendar span.calEventGroup").hide().next().hide(); // hide span then <br/> below the span tag
          }
        } // END updateCalendar

        function updateEventInfo() {
          // process unavailble
          jq.getJSON(
            evScriptPath +
              "/onsale_events.json?timestamp=" +
              new Date().getTime(),
            function (data) {
              for (var x = 0; x < data.ev_unavail.length; x++) {
                if (eventInfo.eventCode.indexOf(data.ev_unavail[x]) > -1) {
                  jq("#content").html(
                    '<div class="text-center" style="margin: 40px;">' +
                      '	<p style="font-weight: 700; color: ' +
                      os.unavailable.fontColor +
                      ';">' +
                      os.evInfoUnavailableMsg +
                      "</p>" +
                      '	<p>If you want to try again, click <a href="' +
                      onsaleLink +
                      '">here</a>.</p>' +
                      "</div>"
                  );
                  break;
                }
              }
            }
          );
        } // END updateEventInfo

        function updateCart() {
          if (os.mode && os.continueBtn.mode && os.description) {
            var onsaleEventFound = false;
            var onsaleDesc = os.description;
            itemList_.forEach(function (item) {
              var itemDescription = getInfoType(item).description;
              if (new RegExp(onsaleDesc, "i").test(itemDescription)) {
                onsaleEventFound = true;
                sessionStorage.setItem("ev_" + onsaleDesc, itemDescription);
              }
            });

            if (cart.number != "" && cart.number > 0 && onsaleEventFound) {
              jq(os.continueBtn.cartHideSelector).hide();
            } else {
              if (sessionStorage.getItem("ev_" + onsaleDesc) !== null) {
                sessionStorage.removeItem("ev_" + onsaleDesc);
                if (os.continueBtn.replaceContinueShopping) {
                  jq('button:contains("Continue Shopping")')
                    .html(function (i, o) {
                      return o.replace(
                        "Continue Shopping",
                        os.continueBtn.replaceContinueShopping
                      );
                    })
                    .attr("onclick", null)
                    .click(function () {
                      window.location = onsaleRedirect;
                    });
                }
              }
            }
          } else {
            // emphasize PL rollover text (update for responsive cart!)
            jq("#cartdisplay_items .errorsm").css("font-size", "13px");
          }
        } // END updateCart

        function updateGroupList() {
          if (onsaleRedirect) {
            jq('a[href*="groupCode=' + os.groupCode + '"]').attr(
              "href",
              onsaleRedirect
            );
          }
        } // END updateGroupList

        function modifyCalendarEvents(limitList, setting) {
          if (limitList.length == 0) {
            console.log("An error in limitList occurred");
            return;
          }
          jq(
            '[data-evcode*="' + limitList.join('"], [data-evcode*="') + '"]'
          ).each(function () {
            jq(".ev_OnsaleError", this).remove();
            // style
            jq(this).css({
              backgroundColor: setting.bgColor,
            });
            // add info
            jq(this).append(
              '<span class="ev_OnsaleError" style="display:block; font-weight: 700; color: ' +
                setting.fontColor +
                ';">' +
                setting.msg +
                "</span>"
            );
          });
        }

        function disableEvents(disableList) {
          if (disableList.length == 0) {
            console.log("An error in disableList occurred");
            return;
          }
          jq(
            '[data-evcode*="' + disableList.join('"], [data-evcode*="') + '"]'
          ).each(function () {
            jq(".ev_OnsaleError", this).remove();
            // style
            jq(this).css({
              backgroundColor: os.unavailable.bgColor,
            });
            // disable links
            jq("a", this)
              .click(function (e) {
                e.preventDefault();
              })
              .hover(function (e) {
                e.preventDefault();
              })
              .css({
                cursor: "not-allowed",
              });
            // add info
            jq(this).append(
              '<span class="ev_OnsaleError" style="display:block; font-weight: 700; color: ' +
                os.unavailable.fontColor +
                ';">' +
                os.unavailable.msg +
                "</span>"
            );
          });
        } // END disableEvents

        jq(document).trigger("onsaleLoaded");
      }); // END jq(document).ready
    }
  ); // end of jq.getScript "settings.js" callback function
})(); // END immediate function
