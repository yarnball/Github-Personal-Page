/**
 * Same Height jQuery plugin
 * @author WingArt team
 * @version 1.0
 **/
;(function($){
	'use strict';

	function sameHeight(collection, options){

		this.config = {
			timeOut: 50,
			target: null,
			isIsotope: false
		}

		if(!options.target) throw new Error('\'target\' option should be specified in initialization of \'WTSameHeight\' plugin');
		else this.items = collection.find(options.target);

		if(!this.items.length) return;

		this.max = 0;
		$.extend(this.config, options);

		Object.defineProperty(this, 'prepare', {

			value: function(){

				this.run();

				$(window).on('resize.NuoviSameHeight', this.run.bind(this));

			}

		});

		Object.defineProperty(this, 'run', {

			value: function(){

				var self = this;

				if(this.timeoutId) clearTimeout(this.timeoutId);

				self.items.css('height', 'auto');

				this.timeoutId = setTimeout(function(){

					self.calcMax();

					self.items.css('height', self.max);
					if(self.config.isIsotope) collection.isotope('layout');

					self.max = 0;

				}, self.config.timeOut);

			}

		});

		Object.defineProperty(this, 'calcMax', {

			value: function(){

				var self = this;

				self.items.each(function(i, el){

					var $this = $(el),
						elHeight = $this.outerHeight();

					if(elHeight > self.max) self.max = elHeight;

				});

			}

		});

		this.prepare();

	}

	Object.defineProperty(sameHeight.prototype, 'appendItems', {

		value: function(items){

			this.items = this.items.add(items);

			this.run();

		}

	});

	Object.defineProperty(sameHeight.prototype, 'getOption', {

		value: function(value){

			if(!(value in this.config)) return;

			return this.config[value];

		}

	});

	$.fn.WTSameHeight = function(options){

		return this.each(function(i, el){

			var $this = $(this);

			if(!$this.data('sameHeight')){
				$this.data('sameHeight', new sameHeight($this, options));
			}

		});

	}

})(jQuery);