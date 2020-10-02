/*
	1. Modal header and footer are hidden as default - site wide
	2. Modal window effects - site wide
	3. type: upsell, html, link, vfs, image, iframe
		* upsell: you don't need to pass "width" but you may pass a image file path
				...
				var image = "jQuery(imageWWWPath)/2GameMiniPlan_Popup.jpg";
				...
				showModalBox.launch({ type: 'upsell', image: image, content: message, padding: 'no', xbutton: 'no' });

		* html: you don't need to pass a image file path but you may need to pass "width"
				showModalBox.launch({ type: 'html', content: message, width: 600, padding: 'yes', xbutton: 'no' });

		* link: loading an external link ex) site-security.html
				showModalBox.launch({ type: 'link', content: 'jQuery(coreWWWPath)/site-security.html', width: 700 });

		* vfs: loading a 3D VFS images for Ballena
				var ballena_img = '//www.seats3d.com/portal/?system=spectra&app=pano&clientID='+ev_clientID+'&facility_code='+ev_facility+'Â§ion='+ev_wholeSection[0]+'&row='+ev_wholeSection[1];
				showModalBox.launch({type:'vfs', title:'Section: '+ev_wholeSection[0], content:ballena_img});

		* image: loading an image file and don't need to pass an image's width ex) Seating chart
				showModalBox.launch({ type: 'image', content: '/www/ev_test8-72/ss/evenue/customize/ev_test8-72/images/desktop/upsell/byu_Conference_Sat_Lightbox.jpg' });

		* iframe: loading an external document ex) PDF
				showModalBox.launch({ type: 'iframe', content: 'jQuery(coreWWWPath)/2014-15_WBB_NCAA.NIT_FAQ.pdf' });

	4. title: can skip
	5. width: can skip if type is one of them image map upsell, vfs, image, iframe
	6. height: can skip if type is one of them image map upsell, vfs, image, iframe
	7. backdrop: default is 'yes' which is 'true' so you can pass 'no' for clicking outside of modal area not to close modal
	8. content: body of content
	9. padding: can skip, default is "no"
	10. xbutton: can skip, default is "yes"
*/

// make this global
modalOptions = {
  animation: "fades-in", // animation: fades-in, from-right, from-bottom, from-front, from-side, newspaper
  showHeader: false, // if set true then will have modal header
  showFooter: false, // if set true then will have modal footer
};

var ev_showModalBox = function () {
  this.launch = function (obj) {
    if (typeof obj.type === "undefined") {
      obj.type = "";
    }
    if (typeof obj.title === "undefined") {
      obj.title = "";
    }
    if (typeof obj.width === "undefined") {
      obj.width = "";
    }
    if (typeof obj.height === "undefined") {
      obj.height = "";
    }
    if (typeof obj.backdrop === "undefined") {
      obj.backdrop = "yes";
    }
    if (typeof obj.content === "undefined") {
      obj.content = "Coming soon...";
    }
    if (typeof obj.padding === "undefined") {
      obj.padding = "no";
    }
    if (typeof obj.xbutton === "undefined") {
      obj.xbutton = "yes";
    }
    if (typeof obj.keyboard === "undefined") {
      obj.keyboard = "yes";
    }

    // Sets to true or false
    obj.keyboard =
      typeof obj.keyboard === "string" && obj.keyboard.toUpperCase === "YES";

    if (obj.xbutton !== "" && obj.xbutton.toUpperCase() === "NO") {
      jQuery(".ev-close-button").hide();
    } else {
      jQuery(".ev-close-button").show();
    }

    /*
			"static" for clicking outside of modal area not to close modal
			true for clicking outside of modal area to close modal
		*/
    var data_backdrop = obj.backdrop;
    if (data_backdrop !== "" && data_backdrop.toUpperCase() === "NO") {
      data_backdrop = "static";
    } else {
      data_backdrop = true;
    }

    jQuery("#showbox-modal-dialog").modal({
      backdrop: data_backdrop,
      keyboard: obj.keyboard, // if set to true then the modal will close via the ESC key
    });

    if (obj.type !== "") {
      if (obj.type === "upsell") {
        getImageSizeWidth(obj.image, function (w, h) {
          if (isNaN(w)) {
            // check image file is exist or not
            jQuery("#showbox-modal-dialog .modal-body").html(
              '<div id="lbContainer"></div>'
            );
            jQuery("#showbox-modal-dialog .modal-body #lbContainer").html(
              "Error in the image file<br>File:" + obj.image
            );
            jQuery(".ev-close-button").show();
          } else {
            jQuery("#showbox-modal-dialog .modal-body").html(
              '<div id="lbContainer"></div>'
            );
            jQuery("#showbox-modal-dialog .modal-body #lbContainer").html(
              obj.content
            );
            if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
              if (window.innerWidth > 768) {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: w + 30 + "px",
                });
              } else {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: window.innerWidth - 100 + "px",
                });
              }
            } else {
              if (window.innerWidth > 768) {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: w + "px",
                });
              } else {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: window.innerWidth - 100 + "px",
                });
              }
              jQuery(".modal-body").css("padding", "0");
            }
            // jQuery('#lbContainer').find('img').css('width', '100%');
          }
        });
      } else if (obj.type === "html" || obj.type === "link") {
        jQuery("#showbox-modal-dialog .modal-body").html(
          '<div id="lbContainer"></div>'
        );
        if (obj.type === "html") {
          jQuery("#showbox-modal-dialog .modal-body #lbContainer").html(
            obj.content
          );
        } else if (obj.type === "link") {
          jQuery("#showbox-modal-dialog .modal-body #lbContainer").load(
            obj.content
          );
        }

        // Added in to automatically size if no width is passed in
        if (obj.width !== "") {
          if (window.innerWidth > 768) {
            if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
              jQuery("#showbox-modal-dialog .modal-size").css({
                width: Number(obj.width) + 30 + "px",
              });
            } else {
              jQuery("#showbox-modal-dialog .modal-size").css({
                width: Number(obj.width) + "px",
              });
              jQuery(".modal-body").css("padding", "0");
            }
          } else {
            if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
              jQuery("#showbox-modal-dialog .modal-size").css({
                width: window.innerWidth - 100 + "px",
              });
            } else {
              jQuery("#showbox-modal-dialog .modal-size").css({
                width: window.innerWidth - 100 + "px",
              });
              jQuery(".modal-body").css("padding", "0");
            }
          }
        } else {
          if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
            jQuery("#showbox-modal-dialog .modal-size").css({
              width: window.innerWidth - 100 + "px",
            });
          } else {
            jQuery("#showbox-modal-dialog .modal-size").css({
              width: window.innerWidth - 100 + "px",
            });
            jQuery(".modal-body").css("padding", "0");
          }
        }
      } else if (obj.type === "vfs") {
        modalOptions.showHeader = true;
        jQuery("#showbox-modal-dialog .modal-body").html(
          '<div id="lbContainer"><iframe name="lbFrame" id="lbFrame" src="" width="" height="" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="auto"></iframe></div>'
        );
        jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe").attr(
          "src",
          obj.content
        );
        var offset = Math.ceil(jQuery(window).height() / 5);
        jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe")
          .attr("height", jQuery(window).height() - offset + "px")
          .attr("width", jQuery(window).height() - offset + "px");
        jQuery("#showbox-modal-dialog .modal-size").css({
          height: jQuery(window).height() - offset + "px",
          width: jQuery(window).height() - offset + "px",
        });
        jQuery(".modal-body").css("padding", "0");
        jQuery("#showbox-modal-dialog .div-close-button").css({
          top: "1px",
          right: "1px",
        });
      } else if (obj.type === "image") {
        getImageSizeWidth(obj.content, function (w, h) {
          if (isNaN(w)) {
            // check image file is exist or not
            jQuery("#showbox-modal-dialog .modal-body").html(
              '<div id="lbContainer"></div>'
            );
            jQuery("#showbox-modal-dialog .modal-body #lbContainer").html(
              "Error in the image file<br>File:" + obj.content
            );
            jQuery(".ev-close-button").show();
          } else {
            jQuery("#showbox-modal-dialog .modal-body").html(
              '<div id="lbContainer"><img src="" class="imgLoading" style="width: 100%;"></div>'
            );
            jQuery(".imgLoading").attr("src", obj.content);
            if (window.innerWidth > 768) {
              if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: Number(w) + 30 + "px",
                });
              } else {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: Number(w) + "px",
                });
                jQuery(".modal-body").css("padding", "0");
              }
            } else {
              if (obj.padding !== "" && obj.padding.toUpperCase() === "YES") {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: window.innerWidth - 100 + "px",
                });
              } else {
                jQuery("#showbox-modal-dialog .modal-size").css({
                  width: window.innerWidth - 100 + "px",
                });
                jQuery(".modal-body").css("padding", "0");
              }
            }
          }
        });
      } else if (obj.type === "iframe") {
        jQuery("#showbox-modal-dialog .modal-body").html(
          '<div id="lbContainer"><iframe name="lbFrame" id="lbFrame" src="" width="" height="" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="auto"></iframe></div>'
        );
        jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe").attr(
          "src",
          obj.content
        );
        if (obj.width !== "" && obj.height !== "") {
          jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe")
            .attr("height", Number(obj.height) + "px")
            .attr("width", obj.width + "px");
          jQuery("#showbox-modal-dialog .modal-size").css({
            width: Number(obj.width) + 30 + "px",
          });
        } else {
          var offset = Math.ceil(jQuery(window).height() / 7);
          jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe")
            .attr("height", jQuery(window).height() - offset + "px")
            .attr("width", jQuery(window).height() - offset + "px");
          jQuery("#showbox-modal-dialog .modal-size").css({
            width: jQuery(window).height() - offset + 30 + "px",
          });
        }
      } else if (obj.type === "iframeSimpleBox") {
        jQuery("#showbox-modal-dialog .modal-body").html(
          '<div id="lbContainer"><iframe name="simpleBoxFrame" id="simpleBoxFrame" src="" width="" height="" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="auto"></iframe></div>'
        );
        jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe").attr(
          "src",
          obj.content
        );
        if (obj.width !== "" && obj.height !== "") {
          jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe")
            .attr("height", Number(obj.height) + "px")
            .attr("width", Number(obj.width) + "px");
          jQuery("#showbox-modal-dialog .modal-size").css({
            width: Number(obj.width) + 30 + "px",
          });
        } else {
          var offset = Math.ceil(jQuery(window).height() / 7);
          jQuery("#showbox-modal-dialog .modal-body #lbContainer iframe")
            .attr("height", jQuery(window).height() - offset + "px")
            .attr("width", jQuery(window).height() - offset + "px");
          jQuery("#showbox-modal-dialog .modal-size").css({
            width: jQuery(window).height() - offset + 30 + "px",
          });
        }
      }
    } else {
      jQuery("#showbox-modal-dialog .modal-body").html(
        '<div id="lbContainer"></div>'
      );
      jQuery("#showbox-modal-dialog .modal-body #lbContainer").html(
        obj.content
      );
    }

    jQuery("#showbox-modal-dialog").modal("show");
    jQuery(".modal-header").css("border-bottom", "none");
    jQuery(".modal-footer").css("border-top", "none");

    //if( modalOptions.showHeader || obj.showheader ) {
    if (modalOptions.showHeader) {
      if (obj.title !== "") {
        jQuery(".modal-header").html(obj.title);
      }
    } else {
      jQuery(".modal-header").hide();
      jQuery(".modal-header .close").css({
        "margin-top": "-30px",
        "margin-right": "-34px",
      });
    }

    if (modalOptions.showFooter) {
      // do something
    } else {
      jQuery(".modal-footer").hide();
    }

    //ADA - focus to modal content div
    jQuery(".modal-content").focus();

    jQuery("#exch-release-seats-modal-dialog, #release-cart-modal-dialog")
      .find(".modal-header, .modal-footer")
      .attr("style", "");
  };
};
var showModalBox = new ev_showModalBox();

// close modal
var removeBox = function (focusSelector) {
  focusSelector = focusSelector || "#content";
  jQuery("#showbox-modal-dialog").modal("hide");
  jQuery("#lbContainer").remove();
  jQuery("#showbox-modal-dialog .modal-size").css({ width: "" });
  jQuery("#showbox-modal-dialog .modal-size").css({ height: "" });

  //ADA - focus to #content div
  jQuery(focusSelector).focus();
};

// get image size
var getImageSizeWidth = function (obj, callback) {
  var img = new Image();
  img.onerror = function () {
    if (callback) {
      callback("fail");
    }
  };
  img.onload = function () {
    if (callback) {
      callback(img.width, img.height);
    }
  };
  img.src = obj;
};

jQuery(document).ready(function () {
  jQuery("#showbox-modal-dialog").on("hidden.bs.modal", function (e) {
    var modal_target = jQuery(e.target);
    modal_target.removeData("bs.modal").find("#lbContainer").remove();
    jQuery("#showbox-modal-dialog .modal-size").css({ width: "" });
    jQuery("#showbox-modal-dialog .modal-size").css({ height: "" });
    jQuery(".modal-body").css("padding", "15");
  });
});
