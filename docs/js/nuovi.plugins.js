;(function($){

	'use strict';

	$(function(){

		/* ------------------------------------------------
				Revolution Slider
		------------------------------------------------ */

		var revSlider = $('#rev_slider'),
			revSlider2 = $('#rev_slider_2');

		if(revSlider.length){

			revSlider.revolution({
		    	sliderType:"standard",
		    	sliderLayout:"fullscreen",
		    	spinner: "spinner3",
		    	responsiveLevels: [4096,1280,778,480],
		    	delay:6000,
		    	navigation: {
					arrows:{
						enable: false,
						hide_onleave: true,
						hide_onmobile: true,
						rtl: $.nuovi.ISRTL,
						tmp: '<span class="nv-arrow"></span>',
						left: {
							container:"slider",
				            h_align: $.nuovi.ISRTL ? "right" : "left",
				            v_align:"center",
				            h_offset:30,
				            v_offset:0
						},
						right: {
				            container:"slider",
				            h_align: $.nuovi.ISRTL ? "left" : "right",
				            v_align:"center",
				            h_offset:30,
				            v_offset:0
						}
					},
					bullets:{
			        	style:"",
			        	enable: true,
			        	container: "slider",
			        	rtl: $.nuovi.ISRTL,
			        	hide_onmobile: false,
			        	hide_onleave: false,
			        	hide_delay: 200,
			        	hide_under: 0,
			        	hide_over: 9999,
			        	tmp:'<span class="nv-bullet"></span>', 
			        	direction:"vertical",
			        	space: 20,       
			        	h_align: "right",
			        	v_align: "center",
			        	h_offset: 20,
			        	v_offset: 0
			        },
			        onHoverStop: "off",
			        touch:{
			         	touchenabled:"on"
			        }
				},
				gridwidth:1140,
				gridheight:720,
				// parallax:{
				//    type:"scroll",
				//    levels:[20, 30, 40, 50, 60, 85],
				//    origo:"enterpoint",
				//    speed:400,
				//    bgparallax:"on",
				//    disable_onmobile:"on"
				// },
				disableProgressBar: "on"
		    });

		}

		if(revSlider2.length){

			revSlider2.revolution({
		    	sliderType:"standard",
		    	sliderLayout:"fullscreen",
		    	spinner: "spinner3",
		    	responsiveLevels: [4096,1280,778,480],
		    	delay: 6000,
		    	navigation: {
					arrows:{
						enable: true,
						hide_onleave: true,
						hide_onmobile: true,
						rtl: $.nuovi.ISRTL,
						tmp: '<div class="tp-title-wrap">\
							   <div class="tp-arr-imgholder"></div>\
							   <div class="tp-arr-titleholder">{{title}}</div>\
							</div>',
						left: {
							container:"slider",
				            h_align: $.nuovi.ISRTL ? "right" : "left",
				            v_align:"center",
				            h_offset:0,
				            v_offset:0
						},
						right: {
				            container:"slider",
				            h_align: $.nuovi.ISRTL ? "left" : "right",
				            v_align:"center",
				            h_offset:0,
				            v_offset:0
						}
					},
					bullets:{
			        	style:"",
			        	enable: false,
			        	container: "slider",
			        	rtl: $.nuovi.ISRTL,
			        	hide_onmobile: false,
			        	hide_onleave: false,
			        	hide_delay: 200,
			        	hide_under: 0,
			        	hide_over: 9999,
			        	tmp:'<span class="nv-bullet"></span>', 
			        	direction:"vertical",
			        	space: 20,       
			        	h_align: "right",
			        	v_align: "center",
			        	h_offset: 20,
			        	v_offset: 0
			        },
			        onHoverStop: "off",
			        touch:{
			         	touchenabled:"on"
			        }
				},
				gridwidth:1140,
				gridheight:720,
				// parallax:{
				//    type:"scroll",
				//    levels:[20, 30, 40, 50, 60, 85],
				//    origo:"enterpoint",
				//    speed:400,
				//    bgparallax:"on",
				//    disable_onmobile:"on"
				// },
				disableProgressBar: "on"
		    });

		}

		/* ------------------------------------------------
				End of Revolution Slider
		------------------------------------------------ */

		/* ------------------------------------------------
				Instagram Feed
		------------------------------------------------ */

			if($('#instafeed').length){

				var feed = new Instafeed({
						target: 'instafeed',
						tagName: 'living',
						limit: 3,
						get: 'user',
						userId: 314754609,
						accessToken: '314754609.a85626a.dbe04117a894440ebb2586a385685451',
						resolution: 'standard_resolution',
						clientId: '686d7a7385cf43ebb9518774734459da',
						template: '<div class="nv-col"><div class="nv-instafeed-item"><a class="fancybox nv-lightbox" rel="instagram" href="{{image}}" title="{{location}}"><img src="{{image}}" /></a></div></div>',
						after: function(){
							$('#' + this.options.target).find('.fancybox').fancybox();
						}
					});
						
				feed.run();

			}

		/* ------------------------------------------------
				End of Instagram Feed
		------------------------------------------------ */

		/* ------------------------------------------------
				Accordion
		------------------------------------------------ */

			var accordions = $('.nv-accordion');

			if(accordions.length){

				accordions.WTAccordion({
					easing: 'easeInOutCubic',
					speed: 350,
					cssPrefix: 'nv-'
				});

			}

		/* ------------------------------------------------
				End of Accordion
		------------------------------------------------ */

		/* ------------------------------------------------
				Fancybox
		------------------------------------------------ */

			if('fancybox' in $){

				$.fancybox.defaults.padding = 0;

				$.fancybox.defaults.wrapCSS = 'nv-fancybox';

				$.fancybox.defaults.openEffect = 'elastic';
				$.fancybox.defaults.closeEffect = 'elastic';

				$.fancybox.defaults.openSpeed = 500;
				$.fancybox.defaults.closeSpeed = 500;

				$.fancybox.defaults.openEasing = 'easeOutQuint';
				$.fancybox.defaults.closeEasing = 'easeOutQuint';

				$.fancybox.defaults.helpers.thumbs = {
					width: 80,
					height: 80
				}

				var fancyboxItem = $('.fancybox'),
					fancyboxMedia = $('.fancybox-media')

				if(fancyboxMedia.length){

					fancyboxMedia.fancybox({
						openEffect  : 'none',
						closeEffect : 'none',
						helpers : {
							media : {}
						}
					});

				}

				if(fancyboxItem.length){

					fancyboxItem.fancybox()

				}

			}

		/* ------------------------------------------------
				End of Fancybox
		------------------------------------------------ */

		/* ------------------------------------------------
				Countdown
		------------------------------------------------ */

			var $countdown = $('.nv-countdown');

			if($countdown.length){

				$countdown.each(function(){

					var $this = $(this),
						endDate = $this.data(),
						until = new Date(
							endDate.year,
							endDate.month || 0,
							endDate.day || 1,
							endDate.hours || 0,
							endDate.minutes || 0,
							endDate.seconds || 0
						);

					$this.countdown({
						until : until,
						padZeroes: true,
						format : 'dHMS',
						labels : ['Years', 'Month', 'Weeks', 'Days', 'Hrs', 'Min', 'Sec'],
						labels1 : ['Years', 'Month', 'Weeks', 'Days', 'Hrs', 'Min', 'Sec']
					});

				});

			}

		/* ------------------------------------------------
				End countdown
		------------------------------------------------ */

		/* ------------------------------------------------
				Tabs
		------------------------------------------------ */

			var tabs = $('.nv-tabs');

			if(tabs.length){

				tabs.WTTabs({
					speed: 600,
					cssPrefix: 'nv-',
					easing: 'easeOutQuart'
				});

			}

		/* ------------------------------------------------
				End Tabs
		------------------------------------------------ */

		/* ------------------------------------------------
				Twitter Feed
		------------------------------------------------ */

			var twitterFeed = $('.nv-twitter-feed');

			if(twitterFeed.length){

				twitterFeed.tweet({
					username : '',
					modpath: 'plugins/twitter/',
					count : 2,
					loading_text : '<p>Loading tweets...</p>',
					template : '<li><a class="nv-tw-user" href="{user_url}" target="_blank">@{name}</a> {text}</li>'
				});

			}

		/* ------------------------------------------------
				End of Twitter Feed
		------------------------------------------------ */

	});

	$(window).load(function(){

		/* ------------------------------------------------
				Owl Carousel
		------------------------------------------------ */

			var testimonials = $('.owl-carousel.nv-testimonials'),
				tResponsiveConfig = {},
				tIsSidebar = testimonials.closest('.nv-sidebar').length;

			// 2 columns without sidebar
			if(testimonials.hasClass('nv-cols-2') && !tIsSidebar){

				tResponsiveConfig = {
					0: {
						items: 1,
						nav: !testimonials.hasClass('nv-type-2')
					},
					500: {
						nav: true,
					},
					767: {
						items: 2,
						margin: 30
					}
				}

			}
			// 2 columns with sidebar
			else if(testimonials.hasClass('nv-cols-2') && tIsSidebar){

				tResponsiveConfig = {
					0: {
						items: 1,
						nav: !testimonials.hasClass('nv-type-2')
					},
					500: {
						nav: true
					},
					1200: {
						items: 2,
						margin: 30
					}
				}

			}


			if(testimonials.length){

				testimonials.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					responsive: tResponsiveConfig
				}));

			}

			var projectsCarousel = $('.owl-carousel.nv-portfolio:not(.nv-ribbon)'),
				isSidebar = projectsCarousel.closest('.nv-sidebar').length,
				columnsConfig = {};

			if(projectsCarousel.length){

				// 2 columns with sidebar
				if(projectsCarousel.hasClass('nv-cols-2') && isSidebar){

					columnsConfig = {
						responsive: {
							0: {
								items: 1
							},
							992: {
								items: 2
							}
						}
					}

				}
				// 2 columns without sidebar
				else if(projectsCarousel.hasClass('nv-cols-2') && !isSidebar){

					columnsConfig = {
						responsive: {
							0: {
								items: 1
							},
							767: {
								items: 2
							}
						}
					}

				}

				// 3 columns with sidebar
				if(projectsCarousel.hasClass('nv-cols-3') && isSidebar){

					columnsConfig = {
						responsive: {
							0: {
								items: 1
							},
							992: {
								items: 2
							}
						}
					}

				}
				// 3 columns without sidebar
				else if(projectsCarousel.hasClass('nv-cols-3') && !isSidebar){

					columnsConfig = {
						responsive: {
							0: {
								items: 1
							},
							767: {
								items: 2
							},
							991: {
								items: 3
							}
						}
					}

				}

				projectsCarousel.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, columnsConfig, {
					margin: 30
				}));

			}

			var projectSlideShow = $('.owl-carousel.nv-project-slideshow');

			if(projectSlideShow.length){

				projectSlideShow.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					autoplay: false,
					loop: false // important for synchronized carousels
				}));

			}

			var projectThumbs = $('.owl-carousel.nv-project-thumbs-carousel');

			if(projectThumbs.length){

				projectThumbs.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					responsive: {
						0: {
							items: 2
						},
						767: {
							items: 3
						},
						992: {
							items: 4
						}
					},
					mouseDrag: false, // important for synchronized carousels
					nav: false,
					autoplay: false,
					margin: 30,
					loop: false // important for synchronized carousels
				}));

			}

			var ribbonCarousel = $('.owl-carousel.nv-ribbon');

			if(ribbonCarousel.length){

				ribbonCarousel.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					responsive: {
						0: {
							autoWidth: false
						},
						767: {
							autoWidth: true
						}
					},
					margin: 30,
					animateIn: false,
					animateOut: false
				}));

			}

			var entrySlideshow = $('.owl-carousel.nv-entry-slideshow');

			if(entrySlideshow.length){
				entrySlideshow.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					
				}));
			}

			var awards = $('.owl-carousel.nv-awards'),
				aResponsiveConfig = {},
				aIsSidebar = awards.closest('.nv-sidebar').length;

			if(awards.length){

				// 3 columns without sidebar
				if(awards.hasClass('nv-cols-3') && !aIsSidebar){

					aResponsiveConfig = {
						0: {
							items: 1
						},
						767: {
							items: 2,
							margin: 30
						},
						991: {
							items: 3,
							margin: 30
						}
					}

				}
				// 3 columns with sidebar
				else if(awards.hasClass('nv-cols-3') && aIsSidebar){
					aResponsiveConfig = {
						0: {
							items: 1
						},
						767: {
							items: 2,
							margin: 30
						}
					}
				}

				// 2 columns with/without sidebar
				if(awards.hasClass('nv-cols-2')){

					aResponsiveConfig = {
						0: {
							items: 1
						},
						767: {
							items: 2,
							margin: 30
						}
					}

				}

				awards.owlCarousel($.extend({}, $.nuovi.baseOwlConfig, {
					responsive: aResponsiveConfig,
					onResized: function (){

						var controls = this.$element.find('.owl-prev, .owl-next'),
							imageH = this.$element.find('.nv-award-image').first().outerHeight();

						controls.css({
							'margin-top': 0,
							'top': (imageH / 2 - controls.outerHeight() / 2)
						});

					},
					onInitialized: function (){

						var controls = this.$element.find('.owl-prev, .owl-next'),
							imageH = this.$element.find('.nv-award-image').first().outerHeight();

						controls.css({
							'margin-top': 0,
							'top': (imageH / 2 - controls.outerHeight() / 2)
						});

					},
					onChanged: function (){

						var controls = this.$element.find('.owl-prev, .owl-next'),
							imageH = this.$element.find('.nv-award-image').first().outerHeight();

						controls.css({
							'margin-top': 0,
							'top': (imageH / 2 - controls.outerHeight() / 2)
						});

					}
				}));

			}

		/* ------------------------------------------------
				End of Owl Carousel
		------------------------------------------------ */

		/* ------------------------------------------------
				SameHeight
		------------------------------------------------ */

		var entryBody = $('.nv-entries.nv-type-3'),
			entryBodyType2 = $('.nv-entries.nv-type-2');

		if(entryBody.length){

			entryBody.WTSameHeight({
				target: '.nv-entry-body-area',
				isIsotope: entryBody.closest('.nv-isotope').length
			});

		}

		if(entryBodyType2.length){

			entryBodyType2.WTSameHeight({
				target: '.nv-entry-body-area',
				isIsotope: entryBodyType2.closest('.nv-isotope').length
			});

		}

		/* ------------------------------------------------
				End of SameHeight
		------------------------------------------------ */

		/* ------------------------------------------------
				Parallax
		------------------------------------------------ */

			var parallax = $('.nv-no-touchevents .nv-parallax[data-fw-bg-image] .nv-bg-element');

			if(parallax.length && !$.nuovi.ISTOUCH){

				setTimeout(function(){

					parallax.parallax("50%", 0.1);

				}, 200);

			}

		/* ------------------------------------------------
				End of Parallax
		------------------------------------------------ */

		/* ------------------------------------------------
				Pies
		------------------------------------------------ */

			var pies = $('.nv-pie');

			if(pies.length){

				pies.WTPieChart({
					thickness: 3,
					size: 160,
					animate: false,
					font: 'Roboto',
					fontSize: 16
				});

				// animate when scrolling
				$.nuovi.modules.animatedPies.init(pies);

			}

		/* ------------------------------------------------
				End Pies
		------------------------------------------------ */

	});

})(jQuery);