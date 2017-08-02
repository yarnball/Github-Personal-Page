;(function($){
	'use strict';

	$.nuovi = {

		/**
		 * Main Constants
		 **/
		ISRTL: getComputedStyle(document.body).direction === 'rtl',
		TRANSITIONDURATION: 350, // base jQuery animation duration

		FLEXBOXSUPPORTED: $('html').hasClass('nv-flexbox'),
		ISTOUCH: $('html').hasClass('nv-touchevents'),
		ANIMATIONSUPPORTED: $('html').hasClass('nv-cssanimations'),

		TRANSITIONEND : "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
		ANIMATIONEND: "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",

		/**
		 * Calls some modules when DOM Structure has been loaded
		 * @return undefined;
		 **/
		DOMReady: function(){

			// initialization of full screen area
			if($('.nv-fullscreen-area').length) this.templateHelpers.fullScreenArea.init();

			// main navigation init
			if($('.nv-navigation').length) this.modules.navigation();

			if($('.nv-fw-section, .nv-halfpage-cols-container').length) this.templateHelpers.fullWidthSection.init();
			if($('[class*="nv-fw-section-bg"]').length) this.templateHelpers.fullWidthSectionBg.init();

			// back to top button init
			this.modules.backToTop({
				easing: 'easeOutQuint',
				speed: 550,
				cssPrefix: 'nv-'
			});

			// init animation for progress bars
			if($('.nv-progress-bars-container').length) this.modules.animatedProgressBars.init({
				speed: 800,
				easing: 'easeOutQuart'
			});

			// initialization event of occurrence of a modal window
			if($('.nv-modal').length) this.events.modalWindow();

			// initialization of subscribe form
			if($('.nv-subscribe').length) this.modules.subscribeForm.init();

			// initialization of contact form
			if($('.nv-contactform').length) this.modules.contactForm.init();

			// initialization google maps
			if($('.nv-gmap').length) this.modules.googleMaps.init();

			// prealoader init
			if($('#preloader').length) this.modules.preloader();

			// initialize of synchronized carousels
			if($('.owl-carousel[data-sync]').length) this.templateHelpers.owlSync.init();

			// fancybox helper
			if($('.fancybox[data-rel]').length) this.templateHelpers.fancyboxGalleryHelper();

			// initialization of fixed transparent header
			if($('#header[class*="nv-transparent"]')) this.templateHelpers.fixedHeader.init({
				breakpoint: 50,
				activeClass: 'nv-over'
			});

			if($('html.nv-no-placeholder').length) this.templateHelpers.placeholder.init();

			if($('.nv-portfolio.nv-type-3').length) this.templateHelpers.freeStylePortfolio.init();

			if('RetinaImage' in window) this.templateHelpers.extendRetinaJS();

		},

		/**
		 * Calls some modules when Outer Resources has been loaded
		 * @return undefined;
		 **/
		OuterResourcesLoaded: function(){

			// dynamically set background image 
			if($('[data-bg-image]').length) this.templateHelpers.bgImage();

			// init animation for counters
			if($('.nv-counters-container').length) this.modules.animatedCounters.init();

			// owl carousel adaptive
			if($('.owl-carousel').length) this.templateHelpers.owlAdaptive();

			// fullscreen layout type
			if($('.nv-layout-fullscreen').length) this.templateHelpers.fullScreenLayout.init();

			// initialization of isotope
			if($('.nv-isotope').length) this.isotope.init();

			// sticky section init
			if($('.nv-sticky').length) this.modules.stickySection.init();

			// initialization of animated content
			if($('.nv-cssanimations [data-animation]').length) this.modules.animatedContent(200);

		},

		jQueryExtend: function(){

			$.fn.extend({

				nuoviImagesLoaded : function () {

				    var $imgs = this.find('img[src!=""]');

				    if (!$imgs.length) {return $.Deferred().resolve().promise();}

				    var dfds = [];

				    $imgs.each(function(){
				        var dfd = $.Deferred();
				        dfds.push(dfd);
				        var img = new Image();
				        img.onload = function(){dfd.resolve();};
				        img.onerror = function(){dfd.resolve();};
				        img.src = this.src;
				    });

				    return $.when.apply($,dfds);

				}

			});

		},

		baseOwlConfig: {
			items: 1,
			smartSpeed: 350,
			dots: false,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			animateIn: 'fadeIn',
			animateOut: 'fadeOut',
			lazyLoad: true,
			loop: true,
			nav: true,
			autoHeight: true,
			navText: ['', ''],
			rtl: getComputedStyle(document.body).direction === 'rtl'
		},

		modules: {

			/**
			 * Initialize main navigation
			 * @return undefined;
			 **/
			navigation: function(){

				var navigation = {

					init: function(){

						this.navigation = $('.nv-navigation');
						this.navWrap = this.navigation.parent();
						this.body = $('body');
						this.bindEvents();
						this.controls = null;
						this.baseWWidth = $(window).width();

						if($(window).width() < 991) this.insertControls();

					},

					bindEvents: function(){

						var self = this,
							$w = $(window);

						this.navigation.on('mouseenter.smart', 'li', this.smartPosition);
						this.navigation.on('mouseleave.smart', '.nv-dropdown', this.resetSmartPosition);
						this.navigation.on('click.mobilenav', 'li > a', {self: this}, this.linkRouter);

						$(document).on('click.mobilefocusout', function(e){

							if($w.width() < 991) return;
							if(!$(e.target).closest(self.navigation).length && !$(e.target).hasClass('nv-nav-btn')) self.cleanMenu();

						});

						$w.on('resize.navigation', function(){

							if($w.width() === self.baseWWidth) return false;

							self.cleanMenu();
							self.baseWWidth = $w.width();
							if(self.controls === null && $w.width() < 991) self.insertControls();

						});

					},

					smartPosition: function(e){

						var $this = $(this),
							$wW = $(window).width();

						if($wW < 991) return false;

						var child = $this.children('.nv-dropdown');

						if(!child.length) return false;

						var posX = child.offset().left,
							oW = child.outerWidth();

						e.preventDefault();

						if(posX + oW > $wW) child.addClass('nv-reverse');

					},

					resetSmartPosition: function(e){

						var $this = $(this),
							$wW = $(window).width();

						if($wW < 991) return false;

						setTimeout(function(){

							$this.find('.nv-reverse').removeClass('nv-reverse');

						}, $.nuovi.TRANSITIONDURATION);

					},

					linkRouter: function(e){

						var $wW = $(window).width(),
							self = e.data.self;

						if($wW >= 991 && $wW <= 1280){
							self.tabletHandler.call($(this), e);
						}
						else if($wW < 991){
							self.mobileHandler.call($(this), e);
						}

					},

					tabletHandler: function(e){

						var $this = $(this);

						if(!$this.hasClass('nv-prevented') && $this.siblings('.nv-dropdown').length){

							$this.addClass('nv-prevented');
							e.preventDefault();

							$this
								.parent('li')
								.addClass('nv-t-active')
								.siblings('li')
								.removeClass('nv-t-active')
								.children('a')
								.removeClass('nv-prevented');

						}

					},

					mobileHandler: function(e){

						var $this = $(this);

						if(!$this.hasClass('nv-prevented') && $this.siblings('.nv-dropdown').length){

							e.preventDefault();

							$this
								.addClass('nv-prevented')
								.next('.nv-dropdown')
								.stop()
								.slideDown()
								.parent()
								.addClass('nv-m-active')
								.siblings()
								.removeClass('nv-m-active')
								.children('a')
								.removeClass('nv-prevented')
								.next('.nv-dropdown')
								.stop()
								.slideUp();

						}

					},

					cleanMenu: function(){

						this.navWrap.removeClass('nv-nav-mobile');
						if($(window).width() < 991) this.navWrap.find('.nv-dropdown').hide();

						this.navigation.find('.nv-prevented, .nv-m-active, .nv-t-active').removeClass('nv-prevented nv-m-active nv-t-active');

					},

					insertControls: function(){

						var self = this;

						if(this.controls !== null) return;

						this.openBtn = $('<a></a>', {
							class: 'nv-nav-open-btn',
							href: '#',
							html: '<i class="fa fa-bars"></i>'
						});

						this.closeBtn = $('<a></a>', {
							href: '#',
							class: 'nv-nav-close-btn nv-custom-close nv-large'
						});

						this.openBtn.on('click', function(e){

							e.preventDefault();

							self.navWrap.addClass('nv-nav-mobile');
							self.body.addClass('nv-scroll-locked');

						});

						this.closeBtn.on('click', function(e){

							e.preventDefault();

							self.navWrap.removeClass('nv-nav-mobile');
							self.body.removeClass('nv-scroll-locked');

						});

						this.openBtn.insertBefore(this.navWrap);
						this.navWrap.prepend(this.closeBtn);
						this.controls = true;

					}

				};

				navigation.init();

			},

			/**
			 * Page preloader
			 * @return jQuery;
			 **/
			preloader: function(options){

				var config = {
						waitAfterLoad: 1000,
						duration: 1000
					},
					loader = $('#preloader');

				$.extend(config, options);

				$('body').nuoviImagesLoaded().then(function(){

					setTimeout(function(){

						loader.fadeOut(config.duration, function(){
							$(this).remove();
						});

					}, config.waitAfterLoad);

				});

				return loader;

			},

			/**
			 * Generates back to top button
			 * @return Object Core;
			 **/
			backToTop: function(config){

				var backToTop = {

					init: function(config){
						
						var self = this;

						if(config) this.config = $.extend(this.config, config);

						this.btn = $('<button></button>', {
							class: self.config.cssPrefix+'back-to-top animated stealthy',
							html: '<span class="fa fa-angle-up"></span>'
						});

						this.bindEvents();

						$('body').append(this.btn);

					},

					config: {
						breakpoint: 700,
						showClass: 'zoomIn',
						hideClass: 'zoomOut',
						easing: 'linear',
						speed: 500,
						cssPrefix: ''
					},

					bindEvents: function(){

						var page = $('html, body'),
							self = this;

						this.btn.on('click', function(e){

							page.stop().animate({

								scrollTop: 0

							}, {
								easing: self.config.easing,
								duration: self.config.speed
							});

						});

						this.btn.on($.nuovi.ANIMATIONEND, function(e){

							e.preventDefault();
							
							var $this = $(this);

							if($this.hasClass(self.config.hideClass)){

								$this
									.addClass('stealthy')
									.removeClass(self.config.hideClass + " " + self.config.cssPrefix + "inview");

							}

						});

						$(window).on('scroll.backtotop', { self: this}, this.toggleBtn);

					},

					toggleBtn: function(e){

						var $this = $(this),
							self = e.data.self;

						if($this.scrollTop() > self.config.breakpoint && !self.btn.hasClass(self.config.cssPrefix + 'inview')){

							self.btn
									.addClass(self.config.cssPrefix + 'inview')
									.removeClass('stealthy');

							if($.nuovi.ANIMATIONSUPPORTED){
								self.btn.addClass(self.config.showClass);
							}

						}
						else if($this.scrollTop() < self.config.breakpoint && self.btn.hasClass(self.config.cssPrefix + 'inview')){

							self.btn.removeClass(self.config.cssPrefix + 'inview');

							if(!$.nuovi.ANIMATIONSUPPORTED){
								self.btn.addClass('stealthy');
							}
							else{
								self.btn.removeClass(self.config.showClass)
										.addClass(self.config.hideClass);
							}

						}

					}

				};

				backToTop.init(config);

				return this;

			},

			/**
			 * Sticky header section
			 **/
			stickySection: {

				STICKYPADDING: 10,
				MAXSTICKYHEIGHT: 90,

				init: function(){

					this.body = $('body');
					this.sticky = $('#header').find('.nv-sticky');

					if(!this.sticky.length) return;

					this.bindEvents();
					this.updateDocumentState();

				},

				updateDocumentState: function(){
					
					var self = this;

					if(self.resizeTimeoutId) clearTimeout(self.resizeTimeoutId);

					self.resizeTimeoutId = setTimeout(function(){

						self.reset();

						self.sticky.removeAttr('style');

						if($(window).width() < 768) return;

						self.stickyHeight = self.sticky.outerHeight();

						if(self.stickyHeight > self.MAXSTICKYHEIGHT){

							self.needScale = true;

							self.defPaddingTop = parseInt(self.sticky.css('padding-top'), 10);
							self.defPaddingBottom = parseInt(self.sticky.css('padding-bottom'), 10);

							self.stickyOffset = self.sticky.offset().top + self.defPaddingTop - self.STICKYPADDING;

						}
						else{

							self.needScale = false;
							self.stickyOffset = self.sticky.offset().top;

						}					

						$(window).trigger('scroll.sticky');

					}, 120);

				},

				reset: function(){

					var $w = $(window);

					this.sticky.removeClass('nv-sticked');

					this.freeSpace();

					if($w.width() < 768 && this.hasEvents){

						var spacer = this.sticky.siblings('.nv-sticky-spacer');
						if(spacer.length) spacer.remove();

						$w.off('scroll.sticky');
						this.hasEvents = false;

						return;

					}
					else if($w.width() >= 768 && !this.hasEvents){

						$w.on('scroll.sticky', {self: this}, this.scrollHandler);
						this.hasEvents = true;

					}

				},

				bindEvents: function(){

					var $w = $(window),
						self = this;

					$w.on('scroll.sticky', {self: this}, this.scrollHandler);
					$w.on('resize.sticky', function(){

						self.updateDocumentState();

					});
					self.hasEvents = true;

				},

				scrollHandler: function(e){

					var $w = $(this),
						self = e.data.self;

					if($w.scrollTop() > self.stickyOffset && !self.sticky.hasClass('nv-sticked')){

						self.sticky.addClass('nv-sticked');

						if(self.needScale){

							self.sticky.css({
								'padding-top': self.STICKYPADDING,
								'padding-bottom': self.STICKYPADDING
							});

						}

						self.fillSpace();

					}
					else if($w.scrollTop() <= self.stickyOffset && self.sticky.hasClass('nv-sticked')){

						self.sticky.removeClass('nv-sticked');

						if(self.needScale){
						
							self.sticky.css({
								'padding-top': self.defPaddingTop,
								'padding-bottom': self.defPaddingBottom
							});

						}

						self.freeSpace();

					}

				},

				fillSpace: function(){

					var self = this,
						parent = self.sticky.parent(),
						spacer = parent.children('.nv-sticky-spacer');

					if(spacer.length){
						spacer.show().css('height', self.stickyHeight);
						return false;
					}
					else{

						spacer = $('<div></div>', {
							class: 'nv-sticky-spacer',
							style: 'height:' + self.stickyHeight + 'px'
						});

						parent.append(spacer);

					}

				},

				freeSpace: function(){

					var self = this,
						parent = self.sticky.parent(),
						spacer = parent.children('.nv-sticky-spacer');

					if(spacer.length) spacer.hide();

				}

			},

			animatedProgressBars: {

				init: function(config){

					this.collection = $('.nv-pb-element');
					if(!this.collection.length) return;

					this.holdersCollection = $('.nv-progress-bars-container');
					this.w = $(window);

					this.preparePBars();

					$.extend(this.config, config);

					this.updateDocumentState();

					this.w.on('resize.animatedprogressbars', this.updateDocumentState.bind(this));

					this.w.on('scroll.animatedprogressbars', {self: this}, this.scrollHandler);

					this.w.trigger('scroll.animatedprogressbars');

				},

				config: {
					speed: $.fx.speed,
					easing: 'linear',
					animated: true
				},

				updateDocumentState: function(){

					this.breakpoint = this.w.height() / 1.4;

				},

				preparePBars: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							indicator = $this.children('.nv-pb-indicator'),
							value = $this.data('value');

						$this.add(indicator).data('r-value', value);
						$this.add(indicator).attr('data-value', 0);

						indicator.css('width', 0);

					});

				},

				scrollHandler: function(e){

					var self = e.data.self;

					self.holdersCollection.each(function(i, el){

						var holder = $(el);

						if(self.w.scrollTop() + self.breakpoint >= holder.offset().top && !holder.hasClass('nv-animated')){

							self.animateAllBarsIn(holder);
							holder.addClass('nv-animated');

							if(i === self.holdersCollection.length - 1) self.destroy();

						}

					});


				},

				animateAllBarsIn: function(holder){

					var self = this,
						pbarsCollection = holder.find('.nv-pb-element');

					pbarsCollection.each(function(i, el){

						var pbar = $(el),
							indicator = pbar.children('.nv-pb-indicator'),
							value = pbar.data('r-value');

						indicator.stop().animate({
							width: value + '%'
						}, {
							duration: self.config.speed,
							easing: self.config.easing,
							step: function(now){
								pbar.add(indicator).attr('data-value', Math.round(now));
							}
						});

					});

				},

				destroy: function(){

					this.w.off('scroll.animatedprogressbars');

				}

			},

			animatedPies: {

				init: function(collection){

					this.collection = collection ? collection : $('.nv-pie');
					if(!this.collection.length) return;

					this.w = $(window);

					this.prepare();

				},

				updateDocumentState: function(){

					if(this.timeoutId) clearTimeout(this.timeoutId);

					var self = this;

					this.timeoutId = setTimeout(function(){

						self.breakpoint = self.w.height() / 1.4;
						self.w.trigger('scroll.animatedPies');

					}, 120);

				},

				prepare: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							pieInterface = $this.data('pieChart');

						if(pieInterface === undefined) return;

						pieInterface.render(0);

					});

					this.w.on('scroll.animatedPies', {self: this}, this.handler);
					this.w.on('resize.animatedPies', this.updateDocumentState.bind(this));

					this.updateDocumentState();

				},

				handler: function(e){

					var w = $(this),
						self = e.data.self;

					self.collection.each(function(i, el){

						var $this = $(el),
							pieInterface = $this.data('pieChart');

						if(w.scrollTop() + self.breakpoint > $this.offset().top && !$this.hasClass('nv-animated')){
							pieInterface.render($this.addClass('nv-animated').data('value'), true);

							if(i === self.collection.length - 1){
								self.w.off('scroll.animatedPies');
								self.w.off('resize.animatedPies');
							}

						}

					});

				}

			},

			animatedCounters: {

				init: function(){

					this.collection = $('.nv-counter');
					if(!this.collection.length) return;

					this.w = $(window);

					this.prepareCounters();
					this.updateDocumentState();

					this.w.on('scroll.animatedcounter', {self: this}, this.scrollHandler);
					this.w.on('resize.animatedcounter', this.updateDocumentState.bind(this));

					this.w.trigger('scroll.animatedcounter');

				},

				updateDocumentState: function(){

					this.breakpoint = this.w.height() / 1.4;

				},

				prepareCounters: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							value = $this.data('value');

						$this.data('r-value', value);
						$this.attr('data-value', 0);

					});

				},

				scrollHandler: function(e){

					var self = e.data.self;

					self.collection.each(function(i, el){

						var counter = $(el);

						if(self.w.scrollTop() + self.breakpoint > counter.offset().top && !counter.hasClass('nv-animated')){

							counter.addClass('nv-animated');
							self.animateCounter(counter);

							if(i === self.collection.length - 1) self.destroy();

						}

					});

				},

				animateCounter: function(counter){

					var value = counter.data('r-value'),
						intId, currentValue = 0;

					intId = setInterval(function(){

						counter.attr('data-value', currentValue+=3);

						if(currentValue >= value){
							counter.attr('data-value', value);
							clearInterval(intId);
						}

					}, 4);

				},

				destroy: function(){

					this.w.off('scroll.animatedcounter');
					this.w.off('resize.animatedcounter');

				}

			},

			/**
			 * Subscribe form
			 **/
			subscribeForm: {

				init: function(){

					this.collection = $('.nv-subscribe');
					if(!this.collection.length) return;

					this.prepare();

				},

				prepare: function(){

					var self = this,
						form = this.collection[0];

					this.validator = new Validator({
						form: form,
						cssPrefix: 'nv-',
						incorrectClass: 'incorrect',
						correctClass: 'correct',
						rules: [
							{
								element: form.elements.email,
								name: 'Email',
								rules: {
									empty: null,
									pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
								}
							}
						],
						onIncorrect: function(errorsList){

							var $this = $(this);

							$.nuovi.templateHelpers.showMessageBox({
								element: $this,
								type: 'fail',
								icon: 'frown-o',
								message: errorsList
							});

						},
						onCorrect: self.send
					});

				},

				send: function(){

					var $this = $(this);

					$.ajax({
						type: 'POST',
						url: 'php/subscribe_handler.php',
						dataType: 'json',
						data: $this.serialize(),
						success: function(response){

							var msgBoxOptions;

							if(response.status == 'success'){

								msgBoxOptions = {
									element: $this,
									type: 'success',
									icon: 'smile-o',
									message: response.statusText
								};

							}
							else if(response.status == 'fail'){

								msgBoxOptions = {
									element: $this,
									type: 'fail',
									icon: 'frown-o',
									message: response.errors
								};

							}

							$.nuovi.templateHelpers.showMessageBox(msgBoxOptions);
							$this.find('input:not([type="submit"]), textarea').val('');

						},
						error: function(jqXHR, response, errorThrown){

							$.nuovi.templateHelpers.showMessageBox({
								element: $this,
								type: 'fail',
								icon: 'frown-o',
								message: errorThrown
							});

						}
					});

				}

			},

			/**
			 * Subscribe form
			 **/
			contactForm: {

				init: function(){

					this.collection = $('.nv-contactform');
					if(!this.collection.length) return;

					this.prepare();

				},

				prepare: function(){

					var self = this,
						form = this.collection[0];

					this.validator = new Validator({
						form: form,
						cssPrefix: 'nv-',
						incorrectClass: 'incorrect',
						correctClass: 'correct',
						rules: [
							{
								element: form.elements.cf_name,
								name: 'Name',
								rules: {
									empty: null
								}
							},
							{
								element: form.elements.cf_subject,
								name: 'Subject',
								rules: {
									empty: null
								}
							},
							{
								element: form.elements.cf_message,
								name: 'Message',
								rules: {
									empty: null,
									min: 10
								}
							},
							{
								element: form.elements.cf_email,
								name: 'Email',
								rules: {
									empty: null,
									pattern: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
								}
							}
						],
						onIncorrect: function(errorsList){

							var $this = $(this);

							$.nuovi.templateHelpers.showMessageBox({
								element: $this,
								type: 'fail',
								icon: 'frown-o',
								message: errorsList
							});

						},
						onCorrect: self.send
					});

				},

				send: function(){

					var $this = $(this);

					$.ajax({
						type: 'POST',
						url: 'php/contactform_handler.php',
						dataType: 'json',
						data: $this.serialize(),
						success: function(response){

							var msgBoxOptions;

							if(response.status == 'success'){

								msgBoxOptions = {
									element: $this,
									type: 'success',
									icon: 'smile-o',
									message: response.statusText
								};

							}
							else if(response.status == 'fail'){

								msgBoxOptions = {
									element: $this,
									type: 'fail',
									icon: 'frown-o',
									message: response.errors
								};

							}

							$.nuovi.templateHelpers.showMessageBox(msgBoxOptions);

							$this.find('input:not([type="submit"]), textarea').val('');

						},
						error: function(jqXHR, response, errorThrown){

							$.nuovi.templateHelpers.showMessageBox({
								element: $this,
								type: 'fail',
								icon: 'frown-o',
								message: errorThrown
							});

						}
					});

				}

			},

			/**
			 * Google Maps
			 * Requires: maplace-0.1.3.min.js
			 **/
			googleMaps: {

				config: {

					map_options: {
						zoom: 16,
						scrollwheel: false,
						styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
					},
					locations: [
						{
							lat: 40.7707307,
							lon: -74.0210859,
							icon: 'images/marker.png',
							title: 'Main office'
						}
					],
					generate_controls: false,
					controls_on_map: false,
					view_all: false

				},

				init: function(config){

					var self = this;

					this.collection = $('.nv-gmap');
					if(!this.collection.length) return;

					this.MapPlaceCollection = [];

					if(config) $.extend(this.config, config);

					this.collection.each(function(i, el){

						var $this = $(el),
							options = {};

						if($this.data('locations')) options.locations = $this.data('locations');

						options.map_div = '#' + $this.attr('id');
						self.MapPlaceCollection.push(new Maplace($.extend({}, self.config, options)).Load());

					});

					this.bindEvents();

				},

				bindEvents: function(){

					var self = this;

					$(window).on('resize.map', function(){

						if(self.mapTimeoutId) clearTimeout(self.mapTimeoutId);

					 	self.mapTimeoutId = setTimeout(function(){

						 	self.MapPlaceCollection.forEach(function(elem, index, arr){
						 		elem.Load();
						 	});

						 }, 100);

		            });

				}

			},

			/**
			 * Handling animation when page has been scrolled
			 * @return jQuery collection;
			 **/
			animatedContent : function(delay){

				var collection = $('[data-animation]');
				if(!collection.length) return;

				setTimeout(function(){

					collection.addClass('animated');

					$("[data-animation]").each(function(){

						var self = $(this),
							scrollFactor = self.data('scroll-factor') ? self.data('scroll-factor') : -240;

						if($(window).width() > 767){

							self.appear(function() {

								var delay = (self.attr("data-animation-delay") ? self.attr("data-animation-delay") : 1);

								if(delay > 1) self.css("animation-delay", delay + "ms");
								self.addClass("nv-visible " + self.attr("data-animation"));	
								self.on($.nuovi.ANIMATIONEND, function(){
									self.addClass('nv-animation-end');
								});

							}, {accX: 0, accY: scrollFactor});

						}
						else {

							self.addClass("nv-visible");

						}

					});

				}, delay ? delay : 0);

				return collection;

			}

		},

		events: {

			/**
			 * Initialization event of occurrence of a modal window
			 * @param jQuery collection
			 * @return collection;
			 **/
			modalWindow: function(collection, customConfig){

				var c = collection ? collection : $('.nv-modal');
				if(!c.length) return;

				var baseConfig = {
					type: 'ajax',
					ajax: {
						type: 'GET',
						cache: false
					},
					closeEffect: {
						type: 'fade',
						speed: 250
					},
					openEffect: {
						type: 'fade',
						speed: 250
					},
					overlay: {
						css: {
							backgroundColor: '#191919',
							opacity: 0.9
						}
					},
					afterOpen: function(data, el){

						var closeBtn = $('<button></button>', {
							type: 'button',
							class: 'arcticmodal-close nv-custom-close nv-large'
						}), placeholders;

						closeBtn.on('click', function(){
							data.body.arcticmodal('close');
						});

						data.body.append(closeBtn);

						setTimeout(function(){

							closeBtn.addClass('nv-showed');

						}, 100);

						placeholders = data.body.find('[placeholder]');

						if($('html.nv-no-placeholder').length && placeholders.length) $.nuovi.templateHelpers.placeholder.init(placeholders);

					}
				};

				if(customConfig !== undefined) baseConfig = $.extend({}, baseConfig, customConfig);

				c.on('click.modal', function(e){

					e.preventDefault();

					var url = $(this).data('modal-path');

					if(baseConfig.type === 'ajax') baseConfig.url = url;
					$.arcticmodal(baseConfig);

				});

				return c;

			}

		},

		isotope: {

			baseConfig: {
				itemSelector: '.nv-col',
				percentPosition: true,
				transitionDuration: '0.5s'
			},

			init: function(){

				this.collection = $('.nv-isotope');
				if(!this.collection.length) return;

				if(window.navigator.userAgent.toLowerCase().indexOf('android') !== -1) this.collection.addClass('nv-android');

				$.extend(this.baseConfig, {
					isOriginLeft: !$.nuovi.ISRTL
				});

				this.run();

			},

			run: function(){

				var self = this;

				this.collection.each(function(i, el){

					var container = $(el),
						config = $.extend({
							layoutMode: container.data('masonry') ? 'masonry' : 'fitRows'
						}, self.baseConfig);

					if(container.data('filter')){

						self.initFilter(container);

					}

					if(container.data('load-more-element')){

						self.initLoadMore(container);

					}

					container.nuoviImagesLoaded().then(function(){

						container.isotope(config);

					});

				});

			},

			initFilter: function(isotope){

				var filterElement = $(isotope.data('filter'));

				if(!filterElement.length) return;

				filterElement.on('click.filter', '[data-filter]', function(e){

					e.preventDefault();

					var $this = $(this);

					$this
						.addClass('nv-active')
						.parent()
						.siblings()
						.children('[data-filter]')
						.removeClass('nv-active');

					isotope.isotope({filter: $this.data('filter')});

				});

			},

			initLoadMore: function(container){

				var self = this,
					loadMoreElement = $(container.data('load-more-element'));

				if(!loadMoreElement.length) return;

				loadMoreElement.on('click', function(e){

					var $this = $(this);

					$this.addClass('nv-loading');

					e.preventDefault();

					self.loadMore(container, $this);

				});

			},

			loadMore: function(container, invoker){

				var self = this,
					maxItems = container.data('max-items'),
					loadedItems = container.data('loaded-items') ? container.data('loaded-items') : container.find('.nv-col').length,
					handlerUrl = container.data('ajax-handler-path');

				if(loadedItems >= maxItems || !handlerUrl){
					invoker.removeClass('nv-loading');
					return;
				}

				$.ajax({
					url: handlerUrl,
					type: 'GET',
					dataType: 'json',
					cache: false
				}).done(function(response){

					self.insertNewItems(container, response.items);

				}).fail(function(response){

					$.nuovi.templateHelpers.showMessageBox({
						element: invoker.parent(),
						type: 'fail',
						icon: 'frown-o',
						message: response.status + ' ' + response.statusText
					});

				}).always(function(){

					invoker.removeClass('nv-loading');

				});

			},

			insertNewItems: function(container, items){

				var self = this,
					type = container.data('isotope-type'),
					newItems = [],
					amountOfNewItems = items.length,
					loadedItems = container.data('loaded-items') ? container.data('loaded-items') : container.find('.nv-col').length,
					maxItems = container.data('max-items');

				$.each(items, function(i, data){

					if(type === 'portfolio'){

						newItems.push($(Handlebars.compile(self.templates.portfolio[data.type])(data)));	

					}
					else if(type === 'blog'){

						newItems.push($(Handlebars.compile(self.templates.blog[data.type])(data)));

					}

				});

				container
					.append(newItems)
					.isotope('appended', container.children().not('[style]'));

				$.nuovi.templateHelpers.bgImage(container.find('[data-bg-image]:not([style*="background-image:"])'));

				if(container.data('sameHeight')){

					var SHInterface = container.data('sameHeight'),
						target = SHInterface.getOption('target');

					SHInterface.appendItems(container.find(target).not('[style*="height:"]'));

				}

				container.nuoviImagesLoaded().then(function(){

					container.isotope('layout');

				});

				loadedItems = loadedItems + amountOfNewItems;

				container.data('loaded-items', loadedItems);

				if(loadedItems >= maxItems) self.hideLoadMoreElement(container);

			},

			hideLoadMoreElement: function(container){

				var element = $(container.data('load-more-element'));

				element.parent('[class*="align-"]').slideUp({
					duration: $.nuovi.TRANSITIONDURATION,
					easing: 'easeOutQuart',
					complete: function(){
						$(this).remove();
					}
				});

			},

			templates: {
				portfolio: {

					'default': '<div class="nv-col{{#categories}} nv-{{classname}}{{/categories}}">\
						<figure class="nv-project">\
							<img class="nv-project-image" src="{{thumbnail}}" alt="{{project_name}}">\
							<figcaption class="nv-project-description">\
								<div class="nv-pdescription-outer">\
									<div class="nv-pdescription-inner">\
										<h4 class="nv-project-name"><a href="{{project_link}}">{{project_name}}</a></h4>\
										<ul class="nv-project-cats">\
											{{#categories}}\
											<li><a href="{{link}}">{{name}}</a></li>\
											{{/categories}}\
										</ul>\
										<div class="nv-project-actions">\
											<a class="fancybox" title="{{project_name}}" href="{{project_image}}"><i class="fa fa-search"></i></a>\
											<a href="{{project_link}}"><i class="fa fa-link"></i></a>\
										</div>\
									</div>\
								</div>\
							</figcaption>\
						</figure>\
					</div>',

					'photoshoot': '<div class="nv-col {{#if categories}}{{#categories}} nv-{{classname}}{{/categories}}{{/if}}">\
						<figure class="nv-project">\
							<img class="nv-project-image" src="{{thumbnail}}" alt="{{project_name}}">\
							<figcaption class="nv-project-description">\
								<div class="nv-pdescription-outer">\
									<div class="nv-pdescription-inner">\
										<h4 class="nv-project-name"><a href="{{project_link}}">{{project_name}}</a></h4>\
										<ul class="nv-details-list">\
											{{#project_info}}\
												<li><span class="nv-info-item-name">{{item_name}}</span><span class="nv-info-item-value">{{item_value}}</span></li>\
											{{/project_info}}\
										</ul>\
										<div class="nv-project-actions">\
											<a class="nv-continue-reading" href="{{project_link}}">{{read_more_link_text}}</a>\
										</div>\
									</div>\
								</div>\
							</figcaption>\
						</figure>\
					</div>'
				},
				blog: {
					'1': '<div class="nv-col {{#if entry_categories}}{{#entry_categories}} nv-{{classname}}{{/entry_categories}}{{/if}}">\
								<article class="nv-entry">\
									<div class="nv-entry-thumb-area">\
										<ul class="nv-entry-cats">\
											{{#entry_categories}}\
											<li><a href="{{link}}">{{name}}</a></li>\
											{{/entry_categories}}\
										</ul>\
										<a href="{{entry_permalink}}" class="nv-entry-thumb"><img src="{{entry_thumb_src}}" alt="{{entry_title}}"></a>\
										{{#if entry_author}}<div class="nv-byline">by <a href="{{entry_author.link}}">{{entry_author.fullname}}</a></div>{{/if}}\
									</div>\
									<div class="nv-entry-body-area">\
										<h4 class="nv-entry-title"><a href="{{entry_permalink}}">{{entry_title}}</a></h4>\
										{{#if entry_excerpt}}\
										<div class="nv-entry-excerpt">\
											<p>{{entry_excerpt}}</p>\
										</div>\
										{{/if}}\
										<ul class="nv-entry-meta">\
											{{#if entry_date}}<li><time datetime="{{entry_date.formated}}">{{entry_date.inview}}</time></li>{{/if}}\
											{{#if entry_comments}}<li><a href="{{entry_comments.link}}">{{entry_comments.inview}}</a></li>{{/if}}\
											{{#if entry_likes}}<li><a href="{{entry_likes.link}}">{{entry_likes.inview}}</a></li>{{/if}}\
										</ul>\
										<footer class="nv-entry-extra">\
											<a href="{{entry_permalink}}" class="nv-continue-reading">{{read_more_link_text}}</a>\
										</footer>\
									</div>\
								</article>\
							</div>',
					'3': '<div class="nv-col {{#if entry_categories}}{{#entry_categories}} nv-{{classname}}{{/entry_categories}}{{/if}}">\
								<article class="nv-entry">\
									<div class="nv-entry-thumb-area">\
										<a href="{{entry_permalink}}" class="nv-entry-thumb" data-bg-image="{{entry_thumb_src}}"></a>\
									</div>\
									<div class="nv-entry-body-area">\
										{{#if entry_categories}}\
										<ul class="nv-entry-cats">\
											{{#entry_categories}}\
											<li><a href="{{link}}">{{name}}</a></li>\
											{{/entry_categories}}\
										</ul>\
										{{/if}}\
										<h4 class="nv-entry-title"><a href="{{entry_permalink}}">{{entry_title}}</a></h4>\
										{{#if entry_excerpt}}\
										<div class="nv-entry-excerpt">\
											<p>{{entry_excerpt}}</p>\
										</div>\
										{{/if}}\
										<ul class="nv-entry-meta">\
											{{#if entry_date}}<li><time datetime="{{entry_date.formated}}">{{entry_date.inview}}</time></li>{{/if}}\
											{{#if entry_comments}}<li><a href="{{entry_comments.link}}">{{entry_comments.inview}}</a></li>{{/if}}\
											{{#if entry_likes}}<li><a href="{{entry_likes.link}}">{{entry_likes.inview}}</a></li>{{/if}}\
										</ul>\
										<footer class="nv-entry-extra">\
											<a href="{{entry_permalink}}" class="nv-continue-reading">{{read_more_link_text}}</a>\
										</footer>\
									</div>\
								</article>\
							</div>'
				}
			}

		},

		templateHelpers: {

			extendRetinaJS: function(){

				$(window).on('resize.retina', function(){

					var collection = $('img[src*="@2x"]');

					if(window.retinaTimeOutId) clearTimeout(window.retinaTimeOutId);

					window.retinaTimeOutId = setTimeout(function(){

						collection.each(function(i, el){

							var $this = $(el);

							$this.removeAttr('width');
							$this.removeAttr('height');

							$this.attr('src', $this.attr('src').replace('@2x', ''));

							new RetinaImage($this.get(0));

						});

					}, 201);

				});

			},

			/**
			 * Dynamically set background image
			 * @return jQuery collection;
			 **/
			bgImage: function(collection){

				collection = collection ? collection : $('[data-bg-image]');
				if(!collection.length) return;

				collection.each(function(i, el){

					var $this = $(el),
						imageSrc = $this.data('bg-image');

					if(imageSrc) $this.css('background-image', 'url('+imageSrc+')');

				});

				return collection;

			},

			fullWidthSectionBg: {

				init: function(){

					var self = this;

					this.collection = $('[class*="nv-fw-section-bg"]');
					if(!this.collection.length) return;

					this.container = $('.container');
					this.w = $('[class*="nv-layout-"]');

					this.updateViewportInfo();
					this.render();

					$(window).on('resize.fullwidthsection', function(){

						if(self.timer) clearTimeout(self.timer);

						self.timer = setTimeout(function(){

							self.updateViewportInfo();
							self.render();

						}, 50);

					});

				},

				updateViewportInfo: function(){

					this.freeSpace = this.w.width() - this.container.width();
					this.out = this.freeSpace / -2;

				},

				render: function(){

					var self = this;

					this.collection.each(function(i, el){

						var $this = $(el),
						bgImage = $this.data('fw-bg-image'),
						bgElement = $this.find('.nv-bg-element');

						if(!bgElement.length){

							bgElement = $('<div></div>', {
								class: 'nv-bg-element'
							});

							if(bgImage) bgElement.css('background-image', 'url(' +bgImage+ ')');

							$this.prepend(bgElement);

						};

						bgElement.css({
							'margin-left': self.out,
							'margin-right': self.out
						});

					});

				}

			},

			fullWidthSection: {

				init: function(){

					var self = this;

					this.collection = $('.nv-fw-section, .nv-halfpage-cols-container');
					if(!this.collection.length) return;

					this.container = $('.container');
					this.w = $('[class*="nv-layout-"]');

					this.updateViewportInfo();
					this.render();

					$(window).on('resize.fullwidthsection', function(){

						if(self.timer) clearTimeout(self.timer);

						self.timer = setTimeout(function(){

							self.updateViewportInfo();
							self.render();

						}, 50);

					});

				},

				updateViewportInfo: function(){

					this.freeSpace = this.w.width() - this.container.width();
					this.out = this.freeSpace / -2;

				},

				render: function(){

					var self = this;

					this.collection.each(function(i, el){

						$(el).css({
							'margin-left': self.out,
							'margin-right': self.out
						});

					});

				}

			},

			/**
			 * Shows message box
			 * @param Object options
			 * @requires: handlebars-v4.0.5.js
			 * @return undefined;
			 **/
			showMessageBox: function(options){

				var defOptions = {
					element: null,
					delay: 4000,
					type: 'info',
					icon: 'info-circle',
					message: null
				},

				template = '<div class="nv-message-box nv-{{type}}" style="display:none;">\
								<div class="nv-mbox-inner">\
									<i class="fa fa-{{icon}} nv-mbox-icon"></i>{{message}}\
								</div>\
							</div>';

				if(options) defOptions = $.extend({}, defOptions, options);

				var mBox = $(Handlebars.compile(template)(defOptions));

				if(defOptions.element){

					mBox
						.appendTo(defOptions.element)
						.slideDown({
							duration: $.nuovi.TRANSITIONDURATION,
							easing: 'easeOutQuart'
						})
						.delay(defOptions.delay)
						.slideUp({
							duration: $.nuovi.TRANSITIONDURATION,
							easing: 'easeOutQuart',
							complete: function(){
								$(this).remove();
							}
						});

				}

			},

			owlAdaptive: function(collection){

				collection = collection ? collection : $('.owl-carousel');
				if(!collection.length) return;

				collection.nuoviImagesLoaded().then(function(){

					collection.each(function(i, el){

						var $this = $(el);

						$this.on('resized.owl.carousel', function(e){

							$.nuovi.templateHelpers.owlContainerHeight($this);

						});

						$this.on('changed.owl.carousel', function(e){

							$.nuovi.templateHelpers.owlContainerHeight($this);

						});

					});

				});

			},

			owlContainerHeight: function(owl){

				setTimeout(function(){

					var max = 0,
						items = owl.find('.owl-item'),
						activeItems = items.filter('.active').children();

					items.children().css('height', 'auto');

					activeItems.each(function(i, el){

						var $this = $(el),
							height = $this.outerHeight();

						if(height > max) max = height;

					});

					owl.find('.owl-stage-outer').stop().animate({
						height: max
					}, {
						duration: 150
					});

				}, 20);

			},

			owlNav: function(owl){

				setTimeout(function(){

					var settings = owl.data('owlCarousel').settings;
					if(settings.autoplay || settings.loop) return;

					var prev = owl.find('.owl-prev'),
						next = owl.find('.owl-next');

					if(owl.find('.owl-item').first().hasClass('active')) prev.addClass('nv-disabled');
					else prev.removeClass('nv-disabled');

					if(owl.find('.owl-item').last().hasClass('active')) next.addClass('nv-disabled');
					else next.removeClass('nv-disabled');

				}, 100);

			},

			owlSync: {

				init: function(){

					this.collection = $('.owl-carousel[data-sync]');
					if(!this.collection.length) return;

					this.prepare();

				},

				prepare: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							sync = $($this.data('sync'));

						sync.on('changed.owl.carousel', function(e){

							var index = e.item.index;

							if(!sync.data('afterClicked')) $this.trigger('to.owl.carousel', [index, 350, true]);

							sync.data('afterClicked', false);

						});

						$this.on('prev.owl.carousel', function(){

							sync.trigger('prev.owl.carousel');

						});

						$this.on('next.owl.carousel', function(){

							sync.trigger('next.owl.carousel');

						});

						$this.on('click.owlSync', '.owl-item', function(e){

							e.preventDefault();

							var index = $(this).index();

							sync.data('afterClicked', true);

							sync.trigger('to.owl.carousel', [index, 350, true]);

						});

					});

				}

			},

			fullScreenLayout: {

				init: function(collection){

					this.collection = collection ? collection : $('.nv-layout-fullscreen');
					if(!this.collection.length) return;

					this.pW = $('.nv-page-content-wrap');
					if(!this.pW.length) return;

					var self = this;

					this.collection.nuoviImagesLoaded().then(function(){

						self.updateDocumentState();

					});

					$(window).on('resize.fullScreenLayout', this.updateDocumentState.bind(this));

				},

				updateDocumentState: function(){

					var self = this,
						$w = $(window);

					if(this.timeoutId) clearTimeout(this.timeoutId);

					this.timeoutId = setTimeout(function(){

						self.reset();

						self.pWH = self.pW.outerHeight();
						self.wH = $w.height();

						self.run();

					}, 50);

				},

				run: function(){

					var self = this;

					if(self.pWH < self.wH){

						self.collection.css({
							'padding-top': (self.wH - self.pWH) / 2,
							'padding-bottom': (self.wH - self.pWH) / 2
						});

					}
					else{
						self.reset();
					}

				},

				reset: function(){

					this.collection.css({
						'padding-top': 0,
						'padding-bottom': 0
					});

				}

			},

			fullScreenArea: {

				init: function(){

					var self = this;

					this.collection = $('.nv-fullscreen-area');
					if(!this.collection.length) return;

					this.defPaddingTop = parseInt(this.collection.css('padding-top'), 10);
					this.defPaddingBottom = parseInt(this.collection.css('padding-bottom'), 10);

					this.w = $(window);

					this.run();

					this.w.on('resize.fullscreen', this.run.bind(this));

					return this.collection;

				},

				reset: function(){

					if(!this.collection) return;

					this.run();

				},

				updateDocumentState: function(){

					var self = this;

					this.collection.css({
						'padding-top': self.defPaddingTop,
						'padding-bottom': self.defPaddingBottom
					})

					this.wH = this.w.height();
					this.cH = this.collection.outerHeight();

				},

				run: function(){

					var self = this;

					this.updateDocumentState();

					if(this.timeoutId) clearTimeout(this.timeoutId);

					this.timeoutId = setTimeout(function(){

						if(self.cH < self.wH){

							var diff = (self.wH - self.cH) / 2;

							self.collection.css({
								'padding-top': diff + self.defPaddingTop,
								'padding-bottom': diff + self.defPaddingBottom
							});

						}

					}, 100);

				}

			},

			fancyboxGalleryHelper: function(){

				var collection = $('.fancybox[data-rel]');
				if(!collection.length) return;

				collection.each(function(i, el){

					var $this = $(el);

					$this.attr('rel', $this.data('rel'));

				});

			},

			/**
			 * Changes header background when scrolling
			 **/
			fixedHeader: {

				init: function(config){

					this.header = $('#header[class*="nv-transparent"]');
					this.pageContentWrap = $('.nv-page-content-wrap');

					if(!this.pageContentWrap.length) return false;

					this.config = {
						breakpoint: 50,
						activeClass: 'nv-over'
					}

					if(config !== undefined && $.isPlainObject(config)) $.extend(this.config, config);

					this.bindEvents();

					$(window).trigger('scroll.fixedHeader');

				},

				bindEvents: function(){

					var $w = $(window),
						self = this;

					$w.on('resize.fixedHeader', {self: this}, this.updateDocumentState);
					if($w.width() > 767) $w.on('scroll.fixedHeader', {self: this}, this.scrollHandler);

				},

				updateDocumentState: function(event){

					var self = event.data.self,
						$w = $(window);

					if(self.timeoutID) clearTimeout(self.timeoutID);

					self.timeoutID = setTimeout(function(){

						if($w.width() < 768){

							self.reset();

						}
						else{

							$w.on('scroll.fixedHeader', {self: self}, self.scrollHandler);
							$w.trigger('scroll.fixedHeader');

						}

					}, 40);

				},

				reset: function(){

					$(window).off('scroll.fixedHeader');
					this.header.removeClass('nv-over');

				},

				scrollHandler: function(e){

					var $this = $(this),
						self = e.data.self;

					if($this.scrollTop() > self.config.breakpoint && !self.header.hasClass(self.config.activeClass)){
						self.header.addClass(self.config.activeClass);
					}
					else if($this.scrollTop() <= self.config.breakpoint && self.header.hasClass(self.config.activeClass)){
						self.header.removeClass(self.config.activeClass);
					}

				}

			},

			placeholder: {

				init: function(collection){

					this.collection = collection ? collection : $('[placeholder]:not([value])');
					if(!this.collection.length) return false;

					this.prepare();

				},

				prepare: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							placeholder = $this.attr('placeholder');

						$this.val(placeholder);
						$this.data('placeholder', placeholder);

					});

					this.collection.on('focus blur', function(e){

						var $this = $(this),
							val = $this.val(),
							placeholder = $this.data('placeholder');

						if(e.type === 'focus' && val === placeholder){
							$this.val('');
						}
						else if(e.type === 'blur' && val === ''){
							$this.val(placeholder);
						}

					});

				}

			},

			/**
			 * Helper object for "Free Style" portfolio only, which is responsible for the positioning of more than 5 portfolio items.
			 * 
			 */
			freeStylePortfolio: {

				init: function(){

					this.collection = $('.nv-portfolio.nv-type-3');
					if(!this.collection.length) return;

					var _self = this;

					this.collection.nuoviImagesLoaded().then(function(){

						_self.collection.each(function(i, el){
							_self.positioning($(el));
							_self.initFilter($(el));
						});

					});

					$(window).on('resize.freeStylePortfolio', function(){

						if(_self.timeOutId) clearTimeout(_self.timeOutId);

						_self.timeOutId = setTimeout(function(){

							_self.collection.each(function(i, el){

								_self.positioning($(el));

							});

						}, 50);

					});

				},

				getParams: function(items){

					this.n1OffsetTop = items.eq(0).position().top;

					var n2 = items.eq(1),
						n3 = items.eq(2),
						n4 = items.eq(3),
						n5 = items.eq(4);

					if(n2.length){
						this.n2OffsetTop = n2.position().top;
					}

					if(n3.length){
						this.n3OffsetTop = n3.position().top;
					}

					if(n4.length){
						this.n4OffsetTop = n4.position().top;
					}

					if(n5.length){
						this.n5OffsetTop = n5.position().top;
					}

				},

				positioning: function(container){

					var items = container.find('.nv-col');
					if(!items.length) return;

					container.add(items).removeAttr('style');
					items.show();

					items.each(function(i, el){

						$(this).css('z-index', items.length - i + 1);

					});

					if($(window).width() < 768) return;

					var _self = this,
						containerHeight = container.outerHeight();

					this.getParams(items);

					items.filter(':nth-child(5n+1)').each(function(i, el){
						$(el).css('top', i * containerHeight + _self.n1OffsetTop);
					});

					items.filter(':nth-child(5n+2)').each(function(i, el){
						$(el).css('top', i * containerHeight + _self.n2OffsetTop);
					});

					items.filter(':nth-child(5n+3)').each(function(i, el){
						$(el).css('top', i * containerHeight + _self.n3OffsetTop);
					});

					items.filter(':nth-child(5n+4)').each(function(i, el){
						$(el).css('top', i * containerHeight + _self.n4OffsetTop);
					});

					items.filter(':nth-child(5n+5)').each(function(i, el){
						$(el).css('top', i * containerHeight + _self.n5OffsetTop);
					});

					container.css('height', items.last().position().top + items.last().outerHeight());

				},

				initFilter: function(container){

					var filter = container.data('filter') ? $(container.data('filter')) : null;
					if(!filter) return;

					container.addClass('nv-filtered');

					filter.on('click.portfolioFilter', '[data-filter]', function(e){

						var $this = $(this),
							criterion = $this.data('filter'),
							items = container.find('.nv-col');

						items.removeClass('nv-out');

						$this
							.addClass('nv-active')
							.parent()
							.siblings()
							.children('[data-filter]')
							.removeClass('nv-active');

						items.not(criterion).addClass('nv-out');

						e.preventDefault();

					});

				}

			}

		}

	}

	$.nuovi.jQueryExtend();

	$(function(){

		$.nuovi.DOMReady();

	});

	$(window).load(function(){

		$.nuovi.OuterResourcesLoaded();

	});

})(jQuery);