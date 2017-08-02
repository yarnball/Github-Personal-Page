/**
 * Clientside validator module
 * @author WingArt team
 * @version 1.0
 **/
; var Validator = (function(){

	'use strict';

	function extend(firstObj, secondObj){

		for(var key in secondObj){

			if(!secondObj.hasOwnProperty(key)) continue;

			firstObj[key] = secondObj[key];

		}

		return firstObj;

	}

	function addClass(element, classN){

		if(element.classList){
			element.classList.add(classN);
		}
		else{
			element.className += ' ' + classN;
		}

	}

	function removeClass(element, classN){

		if(element.classList){
			element.classList.remove(classN)
		}
		else{
			element.className = element.className.replace(' ' + classN, '');
		}

	}

	function Validator(config){

		this.errors = [];

		this.defOptions = {
			form: null,
			cssPrefix: null,
			incorrectClass: 'incorrect',
			correctClass: 'valid',
			showValid: true,
			rules: null,
			ajax: true
		}

		this.options = extend(this.defOptions, config);

		Object.defineProperties(this, {

			iClass: {

				get: function(){

					return this.options.cssPrefix ? this.options.cssPrefix + this.options.incorrectClass : this.options.incorrectClass;

				}

			},

			vClass: {

				get: function(){

					return this.options.cssPrefix ? this.options.cssPrefix + this.options.correctClass : this.options.correctClass;

				}

			}

		});

		Object.defineProperty(this, 'form', {

			get: function(){

				return this.options.form;

			}

		});

		/**
		 * Return to the default state
		 * @return undefined;
		 **/
		Object.defineProperty(this, 'reset', {

			value: function(){

				this.errors = [];
				this.unbindErrors();

			}

		});


		/**
		 * Starts process of fields validation
		 * @return Boolean;
		 **/
		Object.defineProperty(this, 'test', {

			value: function(){

				var rules = this.options.rules,
					valid = true;

				for(var i = 0; i < rules.length; i++){

					var methods = rules[i]['rules'];

					for(var rule in methods){

						var mName = 'test' + rule,
							param = methods[rule];

						if(!this[mName](rules[i]['element'], rules[i]['name'], param)) valid = false;

					}

				}

				return valid;

			}

		});

		/**
		 * Appends error messages to form elements
		 * @return undefined;
		 **/
		Object.defineProperty(this, 'bindErrors', {

			value: function(){

				for(var i = 0; i < this.errors.length; i++){

					var error = this.errors[i];

					addClass(error['element'], this.iClass);

				}

			}

		});

		/**
		 * Removes error messages from form elements
		 * @return undefined;
		 **/
		Object.defineProperty(this, 'unbindErrors', {

			value: function(){

				var incorrectFields = this.form.querySelectorAll('.' + this.iClass);

				for(var i = 0; i < incorrectFields.length; i++){

					removeClass(incorrectFields[i], this.iClass);

				}

			}

		});

		/**
		 * Binds necessary events to form
		 * @protected
		 * @return undefined;
		 **/
		Object.defineProperty(this, 'bindEvents', {

			value: function(){

				var self = this;

				if(!this.form || !(this.form instanceof HTMLFormElement)){

					throw new Error(' \'form\' property in config object should be specified and should be instance of HTMLFormElement class');

				}

				this.form.addEventListener('submit', function(e){

					self.reset();

					if(self.options.ajax) e.preventDefault();

					if(!self.test()){

						self.bindErrors();
						self.options.onIncorrect.call(self.form, self.errorsList);

						e.preventDefault();
						e.stopPropagation();
						return false;

					}
					else self.options.onCorrect.call(self.form);

				}, false);

			},

			configurable: false,
			writable: false

		});

		this.bindEvents();

	}

	/**
	 * Detects empty field
	 * @param HTMLInputElement | HTMLTextAreaElement input
	 * @return Boolean;
	 **/
	Object.defineProperty(Validator.prototype, 'testempty', {

		value: function(input, name){

			if(!input.value.length){

				this.errors.push({
					element: input,
					message: 'Field \'' + name + '\' should be filled!'
				});

				return false;

			}

			return true;

		}

	});

	/**
	 * Detects fields, which don't match specified pattern
	 * @param HTMLInputElement | HTMLTextAreaElement input
	 * @param String pattern
	 * @return Boolean;
	 **/
	Object.defineProperty(Validator.prototype, 'testpattern', {

		value: function(input, name, pattern){

			var rE = new RegExp(pattern);

			if(!rE.test(input.value)){

				this.errors.push({
					element: input,
					message: 'The value of field \'' +name+ '\' is incorrect!'
				});

				return false;

			}

			return true;

		}

	});

	/**
	 * Detects fields, which don't contain specified amount of symbols
	 * @param HTMLInputElement | HTMLTextAreaElement input
	 * @param Number min
	 * @return Boolean;
	 **/
	Object.defineProperty(Validator.prototype, 'testmin', {

		value: function(input, name, min){

			if(input.value.length < min){
				
				this.errors.push({
					element: input,
					message: 'The amount of characters in \'' + name + '\' field should be grater than ' + min +'!'
				});

				return false;

			}

			return true;

		}

	});

	/**
	 * Returns list of errors
	 * @return String;
	 **/
	Object.defineProperty(Validator.prototype, 'errorsList', {

		get: function(){

			var errors = '';

			this.errors.forEach(function(el, i, arr){

				errors += el.message + "\r\n";

			});

			return errors === '' ? null : errors;

		}

	});

	return Validator;

})();