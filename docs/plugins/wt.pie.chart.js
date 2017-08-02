/**
 * Pie Chart jQuery plugin
 * @author WingArt team
 * @version 1.0
 **/
;(function($){
	'use strict';

	/**
	 * Pie Constructor
	 * @param jQuery el
	 * @param Object options
	 * @return undefined;
	 **/
	function Pie(el, options){

		this.config = {
			animate: false,
			fgColor: '#e5a01e',
			bgColor: null,
			thickness: 10,
			rtl: false,
			font: 'Arial',
			fontSize: 16,
			textVOffset: 10,
			captionPosition: 'inside', // only 'inside' in version 1.0,
			showPercentage: true,
			percentagePosition: 'bottom' // only 'bottom' in version 1.0
		}

		if(options !== undefined && $.isPlainObject(options)) $.extend(this.config, options);

		/**
		 * Creates canvas element
		 * @return undefined;
		 **/
		Object.defineProperty(this, 'prepare', {

			value: function(){

				if(this.canvas !== undefined) return;

				this.value = el.data('value');
				this.caption = el.data('caption');

				this.canvas = document.createElement("canvas");
				el.append(this.canvas);

				this.packCanvas();

			},
			writable: false,
			configurable: false,
			enumerable: false

		});


		Object.defineProperty(this, 'packCanvas', {

			value: function(){

				this.ctx = this.canvas.getContext("2d");

				this.canvas.height = this.canvas.width = this.oldWidth = this.oldHeight = this.config.size ? this.config.size : el.outerWidth();

				if(this.config.showPercentage){
					this.canvas.height = this.oldHeight = this.canvas.height + this.config.fontSize + this.config.textVOffset;
				}

				if (this._ratio > 1) {
				    this.oldWidth = this.canvas.width,
				    this.oldHeight = this.canvas.height;

				    this.canvas.width = this.oldWidth * this._ratio;
				    this.canvas.height = this.oldHeight * this._ratio;


				    this.canvas.style.width = this.oldWidth + 'px';
				    this.canvas.style.height = this.oldHeight + 'px';

				    this.ctx.scale(this._ratio , this._ratio);

				}
				

				// apply settings 
				this.ctx.lineWidth = this.config.thickness;
				this.ctx.strokeStyle = this.config.fgColor;
				this.ctx.lineCap = 'round';
				this.ctx.textAlign = 'center';
				this.ctx.font = this.config.fontSize + "px " + this.config.font;

				this.ctx.width = this.canvas.width;
				this.ctx.height = this.canvas.height;



			}

		});

		Object.defineProperty(this, '_ratio', {

			get: function(){

				var dPixelRatio = window.devicePixelRatio || 1,
					bsPixelRatio = this.ctx.webkitBackingStorePixelRatio || 
								   this.ctx.mozBackingStorePixelRatio ||
								   this.ctx.msBackingStorePixelRatio ||
								   this.ctx.oBackingStorePixelRatio ||
								   this.ctx.backingStorePixelRatio || 1;


				return dPixelRatio / bsPixelRatio;

			}

		});

		Object.defineProperty(this, 'offset', {

			value: 0

		});

		Object.defineProperty(this, 'centerX', {

			get: function(){

				return this.oldWidth / 2;

			}

		});

		Object.defineProperty(this, 'centerY', {

			get: function(){

				return this.oldWidth / 2;

			}

		});

		Object.defineProperty(this, 'radius', {

			get: function(){

				return (this.oldWidth - this.config.thickness) / 2;

			}

		});

		Object.defineProperty(this, 'toRadians', {

			value: function(degree){

				return Math.PI / 180 * degree;

			},
			writable: false,
			enumerable: false,
			configurable: false

		});

		Object.defineProperty(this, 'toDegrees', {

			value: function(percentage){

				return 360 * percentage / 100;

			},
			writable: false,
			enumerable: false,
			configurable: false

		});

		Object.defineProperty(this, 'renderFigure', {

			value: function(value){

				this.ctx.beginPath();
				this.ctx.arc(this.centerX, this.centerY, this.radius, 0 - this.toRadians(90), this.toRadians(this.toDegrees(value)) - this.toRadians(90), this.config.rtl);
				this.ctx.stroke();
				this.ctx.closePath();

			},
			writable: false,
			enumerable: false,
			configurable: true

		});

		this.prepare();

		if(this.value) this.render(this.value, this.config.animate);
		
	}

	Object.defineProperty(Pie.prototype, 'reset', {

		value: function(){

			this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);

		}

	});

	/**
	 * Run rendering process
	 * @return undefined;
	 **/
	Object.defineProperty(Pie.prototype, 'render', {

		value: function(value, animate){

			if(value < 0 || value > 100) throw new Error('Incorect value. The value must be in range from 0 to 100');

			this.reset();

			if(animate){

				var self = this;

				self.currentValue = 0;
				
				this.intervalID = setInterval(function(){

					self.currentValue++;
					self.reset();

					self.renderFigure(self.currentValue);
					if(self.caption) self.drawText(self.caption, self.centerX, self.centerY + (self.config.fontSize / 2));
					if(self.config.showPercentage) self.drawText(self.currentValue + ' %', self.centerX, self.oldHeight - 1);

					if(self.currentValue === value){
						self.currentValue = 0;
						clearInterval(self.intervalID);
					}

				}, 7);

			}
			else{
				this.reset();
				this.renderFigure(value);
				if(this.caption) this.drawText(this.caption, this.centerX, this.centerY + (this.config.fontSize / 2));
				if(this.config.showPercentage) this.drawText(value + ' %', this.centerX, this.oldHeight - 1);
			}

		}

	});

	Object.defineProperty(Pie.prototype, 'drawText', {

		value: function(text, positionX, positionY){

			this.ctx.fillText(text, positionX, positionY);

		}

	});

	$.fn.WTPieChart = function(options){

		return this.each(function(i, el){

			var $this = $(el);

			if(!$this.data('pieChart')){

				$this.data('pieChart', new Pie($this, options));

			}

		});

	}


})(jQuery);