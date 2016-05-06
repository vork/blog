(function ($) {
	'use strict';

	var teslaThemes = {

		init: function () {
			this.checkInputsForValue();
			this.toggles();
			this.initInstagram();
	        this.facebookLikeBox();
	        this.windowScrollEvent();
	        this.windowResizeEvent();
	        this.owlInit();
	        this.isotopeInit();
	        this.flickityInit();
	        this.googleMaps();
		},

		// Theme Custom Functions
		checkInputsForValue: function () {
			$('.check-value').on('focusout', function () {
				var text_val = $(this).val();
				if (text_val === "" || text_val.replace(/^\s+|\s+$/g, '') === "") {
					$(this).removeClass('has-value');
				} else {
					$(this).addClass('has-value');
				}
			});
		},

		toggles: function () {
			// Mobile Menu Toggle
			var menuToggle = $('header .mobile-nav-toggle'),
				nav = $('header nav'),
				body = $('body');

			menuToggle.on('click', function () {
				body.toggleClass('mobile-nav-visible');
				return false;
			});

			$(document).on('click', function () {
				body.removeClass('mobile-nav-visible');
			});

			nav.on('click', function (e) {
				e.stopPropagation();
			});

			// Share Block
			var shareBlock = $('.share-block'),
				shareToggle = shareBlock.find('.toggle'),
				shareOptions = shareBlock.find('.share-options');

			shareToggle.on('click', function () {
				shareOptions.toggleClass('visile');
				return false;
			});

			$(document).on('click', function () {
				shareOptions.removeClass('visile');
			});

			shareOptions.on('click', function (e) {
				e.stopPropagation();
			});

			// Global Search form - Header Style 2
			var globalSearchForm = $('.global-search-form'),
				searchFormToggle = $('.global-search-form .form-toggle');

			searchFormToggle.on('click', function () {
				globalSearchForm.addClass('expanded');
				globalSearchForm.find('.search-input').focus();
			});

			$(document).on('click', function () {
				globalSearchForm.removeClass('expanded');
			});

			globalSearchForm.on('click', function (e) {
				e.stopPropagation();
			});
		},

		initInstagram: function () {
			var feeds = $('.instagram-feed');

			feeds.each(function (i, val) {
				teslaThemes.instagramFeed(feeds.eq(i), {
					access_token: '',
					client_id: 'a112e49897514c17bf05596fdca4b5c2',
					count: feeds.eq(i).attr('data-instagram-items')
		        });
			});
		},

		instagramFeed: function (container, data) {
			var pattern, renderTemplate, storageObj, storageTime, url, _template;
			
			url = 'https://api.instagram.com/v1';

			pattern = function(obj) {
				var item, k, len, template;
				if (obj.length) {
					template = '';
					for (k = 0, len = obj.length; k < len; k++) {
						item = obj[k];
						template += "<a href='" + item.link + "' title='" + item.title + "' target='_blank'><img src='" + item.image + "' alt='" + item.title + "'></a>";
					}
					container.append(template);

					// Init Instagram Carousel
					if (container.hasClass('instagram-carousel')) {
						$('body').trigger('loadInstagramCarousel');
					}
				}
			};

			_template = function(obj) {
				var item, k, len, ref, results;
				if (obj.data) {
					ref = obj.data;
					results = [];
					for (k = 0, len = ref.length; k < len; k++) {
						item = ref[k];
						results.push({
							title: item.user.username,
							link: item.link,
							image: item.images.standard_resolution.url
						});
					}
					return results;
					}
				}

				if (container.data('instagram-tag')) {
					url += "/tags/" + (container.data('instagram-tag')) + "/media/recent";
					renderTemplate = _template;
					storageTime = new Date().getTime();
					
					$.ajax({
						dataType: "jsonp",
						url: url,
						data: data,
						success: function(response) {
							var instagramFeed;
							instagramFeed = {};
							instagramFeed.data = renderTemplate(response);
							instagramFeed.timestamp = new Date().getTime();
							pattern(instagramFeed.data);
						}
					});
				}
		},

		facebookLikeBox: function () {
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js%23xfbml=1&version=v2.4";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));

			setTimeout(function () {
				$('.widget_facebook').css('min-height', 0);
			}, 5000);
		},

		windowScrollEvent: function () {
			// Variables
			var header = $('header'),
				headerHeight = header.outerHeight(true),
				promoBox = $('.widget_promo'),
				scrollTopBtn = $('.back-to-top-btn'),
				docHeight = $(document).height(),
				scrollSpeed,
				lastScrollTop = 0;

			// Functions
			function isScrolledIntoView(elem) {
			    var $elem = $(elem);
			    var $window = $(window);

			    var docViewTop = $window.scrollTop();
			    var docViewBottom = docViewTop + $window.height();

			    var elemTop = $elem.offset().top;
			    var elemBottom = elemTop + $elem.height();

			    return ((elemBottom + 100 <= docViewBottom) && (elemTop - 100 >= docViewTop));
			}

			$(window).on('scroll', function (event) {
				var st = $(this).scrollTop(),
					obj = $(this);

				// Promo Box Widget				
				if (promoBox.length) {
					if (isScrolledIntoView(promoBox)) {
						promoBox.addClass('visible');
					} else {
						promoBox.removeClass('visible');
					}
				}

				// Fixed Header
				if (header.hasClass('fixed')) {
					(st > headerHeight + 20) ? header.addClass('sticky') : header.removeClass('sticky');
					var st = obj.scrollTop();
					if (st > lastScrollTop){
						header.removeClass('scrolling-up');
					} else {
						header.addClass('scrolling-up');
					}
					lastScrollTop = st;
				}

				if (header.hasClass('style-2')) {
					(st >= header.find('.white-large-container').outerHeight()) ? header.find('.large-container').addClass('sticky') : header.find('.large-container').removeClass('sticky');
				}

				// Reveal Back to top button
				(st > headerHeight * 2) ? scrollTopBtn.addClass('visible') : scrollTopBtn.removeClass('visible');

				(st > docHeight / 2) ? scrollSpeed = 1200 : scrollSpeed = 450;
			});

			// Scroll window to top
			scrollTopBtn.on('click', function (e) {
				e.preventDefault();
				$('body, html').animate({scrollTop: 0}, scrollSpeed, 'swing');
			});

			// Smooth scroll to link
			$('a[href*=#]:not([href=#])').click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $(this.hash);
					target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
						$('html,body').animate({
							scrollTop: target.offset().top
						}, 1000);
						return false;
					}
				}
			});
		},

		windowResizeEvent: function () {
			$(window).on('resize', function () {
				var body = $('body'),
					mobileNavOpen = true;

				if (body.hasClass('mobile-nav-visible') && $(window).width() > 991 && mobileNavOpen) {
					body.removeClass('mobile-nav-visible');
					mobileNavOpen = false;
				}
			});
		},

		owlInit: function () {
			// Instagram feed carousel
			$('body').on('loadInstagramCarousel', function () {
				var instagramCarousel = $('.instagram-carousel');
				
				instagramCarousel.owlCarousel({
					items: 7,
					pagination: false,
					controls: false,
					mouseDrag: true,
					touchDrag: true,
					responsive: true
				});
			});
		},

		isotopeInit: function () {
			$('body').on('isotopeInit', function () {
				var isotopeContainer = $('.isotope-container');

				if (isotopeContainer.length) {
					isotopeContainer.imagesLoaded(function () {
						isotopeContainer.isotope({
							itemSelector: '.isotope-item'
						});
					});
				}
			});

			setTimeout(function () {
				$('body').trigger('isotopeInit');
			}, 1500);
		},

		flickityInit: function () {	
			if ($('.main-slider .items').length) {

				var dragOption = false,
					controls = true;

				if ($(window).width() < 991) {
					dragOption = true;
					controls = false;
				}

				$('.main-slider .items').imagesLoaded(function () {
					var mainSlider = new Flickity('.main-slider .items', {
						wrapAround: true,
						draggable: dragOption,
						prevNextButtons: controls,
						pageDots: false
					});
				});
			}
		},

		googleMaps: function () {
			var mapCanvas = jQuery('#map-canvas');

			function initialize_contact_map() {
			    var mapOptions = {
						center: new google.maps.LatLng(47.5728463,-122.3141274),
						zoom: 15,
						// disableDefaultUI: true,
						scrollwheel: false,
						disableDefaultUI: true,
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						styles: [{ stylers: [{ saturation: -100 }]}]
			        };
			    var contact_map = new google.maps.Map(mapCanvas[0],mapOptions),
			    	marker = new google.maps.Marker({
		              map: contact_map,
		              position: new google.maps.LatLng(47.5728463,-122.3141274),
		              animation: google.maps.Animation.DROP,
		              icon: 'img/map-pin.png'
		            });
		    }
		    
			if (mapCanvas.length) {
		    	google.maps.event.addDomListener(window, 'load', initialize_contact_map);
			}
		}
	};
	
	$(document).ready(function(){
		teslaThemes.init();

		setTimeout(function () {
			$('body').addClass('dom-ready');
		}, 200);
	});
}(jQuery));