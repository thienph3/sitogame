(function ($, undefined) {
	"use strict";
	$(function () {
		var $frmContact = $("#frmContact"),
			$frmComment = $("#frmComment"),
			$frmBugs = $("#frmBugs"),
			$frmCheckout = $("#frmCheckout"),
			$frmDownload = $("#frmDownload"),
			$frmDonation = $("#frmDonation"),
			$frmSubscribe = $("#frmSubscribe"),
			$frmHeadersInspector = $("#frmHeadersInspector"),
			$rightPanel = $(".rightPanel"),
			validate = ($.fn.validate !== undefined),
			pretty = (typeof prettyPrint === "function"),
			options = {
			rules: {
				"name": "required",
				"email": {
					required: true,
					email: true
				},
				"captcha": {
					required: true,
					maxlength: 6
				}
			},
			messages: {
				"name": "Name is required",
				"email": {
					required: "E-Mail address is required",
					email: "Please enter valid email address"
				},
				"captcha": {
					required: "Human verification code is required",
					maxlength: "Please enter no more than 6 characters",
					remote: "Human verification code doesn't match"
				}
			},
			onkeyup: false
		};
		
		if ($frmContact.length && validate) {
			options.rules.captcha.remote = $frmContact.find("input[name='install_url']").val() + "checkCaptcha";
			options.rules.message = "required";
			options.messages.message = "Message is required";
			options.errorPlacement = function (error, element) {
				error.insertAfter(element.parent());
			};
			$frmContact.validate(options);
		}
		
		if ($frmComment.length && validate) {
			options.rules.captcha.remote = $frmComment.find("input[name='install_url']").val() + "checkCaptcha";
			options.rules.comment = "required";
			options.messages.comment = "Comment is required";
			options.errorPlacement = function (error, element) {
				error.insertAfter(element.parent());
			};
			$frmComment.validate(options);
		}
		
		if ($frmSubscribe.length && validate) {
			$frmSubscribe.validate({
				rules: {
					"email": {
						required: true,
						email: true
					}
				},
				messages: {
					"email": {
						required: "E-Mail address is required",
						email: "Please enter valid email address"
					}
				},
				errorClass: "error_clean",
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				}
			});
		}
		
		if ($frmHeadersInspector.length && validate) {
			$frmHeadersInspector.on('change', '#auth', function () {
				var $box = $('#box-auth'),
					$input = $('#auth_user, #auth_pw, input[name="auth_type"]');
				if ($(this).is(':checked')) {
					$input.prop('disabled', false);
					$box.show();
				} else {
					$box.hide();
					$input.prop('disabled', true);
				}
			}).validate({
				rules: {
					"url": {
						required: true,
						url: true
					},
					"auth_user": "required",
					"auth_pw": "required"
				},
				messages: {
					"url": {
						required: "Website URL is required",
						url: "Please enter a valid URL"
					},
					"auth_user": "Username is required",
					"auth_pw": "Password is required"
				},
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				}
			});
		}
		
		if ($frmCheckout.length && validate) {
			$frmCheckout.validate({
				rules: {
					"name": "required",
					"email": {
						required: true,
						email: true
					},
					"payment_method": "required",
					"phone": "required",
					"address": "required",
					"country_id": "required",
					"city": "required",
					"zip": "required",
					"captcha": {
						required: true,
						maxlength: 6,
						remote: $frmCheckout.find("input[name='install_url']").val() + "checkCaptcha"
					}
				},
				messages: {
					"name": "Name is required",
					"email": {
						required: "E-Mail address is required",
						email: "Please enter valid email address"
					},
					"payment_method": "Payment method is required",
					"phone": "Phone is required",
					"address": "Address is required",
					"country_id": "Country is required",
					"city": "City is required",
					"zip": "Zip is required",
					"captcha": {
						required: "Human verification code is required",
						maxlength: "Please enter no more than 6 characters",
						remote: "Human verification code doesn't match"
					}
				},
				onkeyup: false,
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				}
			});
		}
		
		if ($frmBugs.length && validate) {
			$frmBugs.validate({
				rules: {
					"name": "required",
					"email": {
						required: true,
						email: true
					},
					"component_id": "required",
					"summary": "required",
					"message": "required",
					"captcha": {
						required: true,
						maxlength: 6,
						remote: $frmBugs.find("input[name='install_url']").val() + "checkCaptcha"
					}
				},
				messages: {
					"name": "Name is required",
					"email": {
						required: "E-Mail address is required",
						email: "Please enter valid email address"
					},
					"component_id": "Component is required",
					"summary": "Summary is required",
					"message": "Message is required",
					"captcha": {
						required: "Human verification code is required",
						maxlength: "Please enter no more than 6 characters",
						remote: "Human verification code doesn't match"
					}
				},
				onkeyup: false,
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				}
			});
		}

		if ($frmDownload.length) {
			window.setTimeout(function () {
				$frmDownload.trigger("submit");
			}, 1500);
		}

		$rightPanel.on("change", "input[name='toggleDownload']", function () {
			if ($(this).is(":checked")) {
				$("input[name='component[]']").prop("checked", true);
			} else {
				$("input[name='component[]']").prop("checked", false);
			}
		}).on("click", ".selector-update", function (e) {
			$rightPanel.find("form").eq(0).trigger("submit");
		}).on("click", "#btnDownload", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$frmDownload.trigger("submit");
			return false;
		}).on("submit", "#frmDownload", function (e) {
			if (typeof _gaq !== "undefined") {
				var form = this;
				_gaq.push(['_set','hitCallback',function() {
				    form.submit();
				}]);
				_gaq.push(['_trackEvent', 'ZinoUI', 'Download', $(this).find("input[name='version']").val()]);
				return !window._gat;
			}
		}).on("submit", "#frmDonation", function (e) {
			var amount = $(this).find("input[name='amount']").val();
			if (parseInt(amount, 10) < 1 || amount.match(/^\d+$/) === null) {
				alert("Amount must be greater then $1.");
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				return false;
			}
		}).on("click", "img.captcha", function (e) {
			var $this = $(this);
			$this.attr("src", $this.attr("src").replace(/(\?rand=)(\d+)/, '\$1' + Math.floor(Math.random() * 999999)));
		});
		
		var $demoMenubar = $(".demo_right .zui-menubar"),
			$remoteDemo = $(".remote_demo").eq(0),
			$sourceDemo = $(".source_demo pre");
		if ($demoMenubar.length && $remoteDemo.length) {
			$demoMenubar.on("click", "a", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				var $this = $(this),
					href = $this.attr("href");
                if (href.length === 0) {
                    return false;
                }
                $remoteDemo.off(".zui").attr("src", href);
				window.location.hash = href.replace(/\.\.\/(.*)\/((.*)\d+)\.html/, '$2');
				$.get(href).done(function (data) {
					$sourceDemo.removeClass("prettyprinted").html(data.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
					if (pretty) {
						prettyPrint();
					}
				});
				return false;
			});
			if (window.location.hash.length === 0) {
				$demoMenubar.find("a").eq(0).trigger("click");
			} else {
				var m = window.location.hash.match(/#(.*)-(\d+)/);
				if (m && m[2]) {
					var i = parseInt(m[2], 10) - 1;
					if (i >= 0) {
						$demoMenubar.find('a[href$="-' + m[2] + '.html"]').eq(0).trigger("click");
					}
				}
			}
		}
		
		var $html = $('html'),
			$mobileNav = $('.mobileNav');
		$(document).on('click', '.mobileToggle', function () {
			if ($html.hasClass('mobile')) {
				$html.removeClass('mobile');
				$mobileNav.hide();
			} else {
				$html.addClass('mobile');
				$mobileNav.show();
			}
		}).on("click", ".popup-close", function () {
			$(this).closest(".popup").remove();
		});
		
		if (pretty) {
			prettyPrint();
		}
		
		var $sidebarBanner = $(".sidebar-banner");
		if ($sidebarBanner.length) {
			var scrollTop,
				sbTop = $sidebarBanner.offset().top,
				sbWidth = $sidebarBanner.outerWidth();
			$(window).on("scroll", function (e) {
				if ($sidebarBanner.is(":hidden")) {
					return;
				}
				if (sbTop == 0) {
					sbTop = $sidebarBanner.offset().top;
				}
				if (sbWidth == 0) {
					sbWidth = $sidebarBanner.outerWidth();
				}
				scrollTop = $(this).scrollTop();
				if (scrollTop >= sbTop) {
					$sidebarBanner.css({"position": "fixed", "top": 0, "width": sbWidth});
				} else {
					$sidebarBanner.removeAttr("style");
				}
			});
		}
	});
	
    if ('serviceWorker' in navigator) {
    	navigator.serviceWorker.register('/sw.js');
    } 
})(jQuery);
