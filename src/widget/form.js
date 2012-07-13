/**
 * Form widget
 * 
 * @author Benjamin Dezile
 * @date July 7, 2012
 */

$.widget("ui.form", {
	
	formId: null,
	fields: null,
	
	FT_TEXT: 'text',
	FT_PWD: 'pwd',
	FT_BOX: 'box',
	FT_SELECT: 'select',
	FT_TEXTAREA: 'textarea',
	FT_HIDDEN: 'hidden',
	
	_init: function() {
		var self = this;
		var validators = self.options.validators || {};
		var defaultValues = self.options['default'] || {};
		
		self.options.required = self.options.required || {};
		self.submitButton = $('#' + self.options.submit);
		self.formId = self.element.attr('id');
		self.fields = {};
		
		
		self.element.find('input, textarea, select')
		.each(function(i,el){
			
			var elem = $(el);
			
			if (el.tagName && el.tagName.toLowerCase() == "input") {
				elem.keyup(function(event){
					if (event.keyCode == 13) {
						// Submit when pressing enter
						self.submit();
						event.preventDefault();
					}
				});
			}
			
			var id = el.id;
			var defVal = defaultValues[id];
			var type = self._getFieldType(elem);
			
			if (defVal !== undefined && type !== self.FT_TEXTAREA) {
				elem.val(defVal)
				.focus(function(){
					if ($(this).val() == defVal) {
						$(this).val('');
					}
				})
				.blur(function(){
					if (!$(this).val()) {
						$(this).val(defVal);
					}
				});
			}
			
			self.fields[id] = {
				'group': elem.parent().parent(),
				'element': elem,
				'validator': validators[id],
				'default': defVal,
				'type': type,
				'required': (self.options.required[id] === true || self.options.required[id] === undefined) 
			};
		});
	},
	
	destroy: function() {
		self.formId = null;
		self.fields = null;
		self.options = null;
	},
	
	_getFieldType: function(el) {
		var elType = el.attr('type');
		if (elType) {
			switch(elType) {
				case 'text':
					return this.FT_TEXT;
				case 'password':
					return this.FT_PWD;
				case 'hidden':
					return this.FT_HIDDEN;
				case 'checkbox':
				case 'radio':
					return this.FT_BOX;
			}
		}
		var p = $(el).parent();
		var id = el.attr('id');
		if (p.find('textarea#' + id).length == 1) {
			return this.FT_TEXTAREA;
		}
		else if (p.find('select#' + id).length == 1) {
			return this.FT_SELECT;
		}
		return undefined;
	},
	
	submit: function() {
		if (this.validate()) {
			this.submitButton.click();
		}
	},
	
	validate: function() {
		var self = this;
		
		self.element
			.find('div.control-group.error')
				.removeClass('error')
			.end();
		
		var el, v, t, r, val;
		for (var k in self.fields) {
			el = self.fields[k].element;
			v = self.fields[k].validator;
			t = self.fields[k].type;
			r = self.fields[k].required;
			var success = true;
			if (r === true) {
				switch(t) {
					case self.FT_TEXTAREA:
						val = el.html();
						if (!val || (self.fields[k]['default'] && val == self.fields[k]['default'])) {
							success = false;
							break;
						}
						continue;
					case self.FT_BOX:
						val = (el.attr('checked') == 'checked');
						if (!val) {
							success = false;
							break;
						}
						continue;
					default:
						val = el.val();
						if (!val || (self.fields[k]['default'] && val == self.fields[k]['default'])) {
							success = false;
							break;
						}
				}
			}
			if (success === false || (v !== undefined && !v.call(this, el))) {
				self.fields[k].group.addClass('error');
				el.focus();
				return false;
			}
		}
		
		return true;
	},
	
	serialize: function() {
		var self = this;
		var data = {};
		
		var el, t, d;
		for (var k in self.fields) {
			el = self.fields[k].element;
			t = self.fields[k].type;
			switch(t) {
				case self.FT_TEXTAREA:
					data[k] = el.html();
					continue;
				case self.FT_PWD:
					data[k] = Base64.encode(el.val());
					continue;
				case self.FT_BOX:
					data[k] = (el.attr('checked') == 'checked') ? "1" : "0";
					continue;
				default:
					data[k] = el.val();
			}
			d = self.fields[k]['default'];
			if (d && data[k] == d) {
				data[k] = '';
			}
		}
		
		return data;
	},
	
	reset: function() {
		var self = this;
		
		var el, t, v;
		for (var k in self.fields) {
			el = self.fields[k].element;
			t = self.fields[k].type;
			v = self.fields[k]['default'];
			switch(t) {
				case self.FT_TEXTAREA:
					el.html(v);
					continue;
				case self.FT_BOX:
					el.attr('checked', v == true ? 'checked' : null);
					continue;
				default:
					el.val(v);
			}
		}
		
	}
	
});