/*global jasmine, beforeEach, describe, expect, it, spyOn, require*/
const _ = require('underscore'),
	MapModel = require('../src/map-model'),
	content = require('mindmup-mapjs-model').content,
	jQuery = require('jquery');

require('./helpers/jquery-extension-matchers');
require('../src/map-toolbar-widget');
describe('mapToolbarWidget', function () {
	'use strict';
	let mapModel, element;
	beforeEach(function () {
		mapModel = new MapModel(function () {
			return [];
		});
		element = jQuery(
			'<div>' +
			'<input type="button" class="resetView" value="0"></input>' +
			'<input type="button" class="scaleUp" value="+"></input>' +
			'<input type="button" class="scaleUp" value="+"></input>' +
			'<input type="button" class="scaleDown" value="-"></input>' +
			'<input type="button" class="addSubIdea" value="++"></input>' +
			'<input type="button" class="editNode" value="edit"></input>' +
			'<input type="button" class="removeSubIdea" value="remove"></input>' +
			'<input type="button" class="insertIntermediate" value="insert parent"></input>' +
			'<input type="button" class="addSiblingIdea" value="insert parent"></input>' +
			'<input type="button" class="undo" value="undo"></input>' +
			'<input type="button" class="redo" value="redo"></input>' +
			'<input type="button" class="cut" value="cut"></input>' +
			'<input type="button" class="copy" value="copy"></input>' +
			'<input type="button" class="paste" value="paste"></input>' +
			'<input type="button" class="openAttachment" value="open attachment"></input>' +
			'<input data-mm-target-property="color" type="text" class="updateStyle" value=""></input>' +
			'</div>'
		);
		element.appendTo('body');
	});
	it('should be used as a jquery plugin', function () {
		const result = element.mapToolbarWidget(mapModel);

		expect(result).toBe(element);
	});
	it('should invoke underlying method on map model when button is clicked', function () {
		const methods = ['scaleUp', 'scaleDown', 'removeSubIdea', 'editNode', 'addSubIdea', 'insertIntermediate', 'addSiblingIdea', 'undo', 'redo', 'cut', 'copy', 'paste', 'openAttachment', 'resetView'];
		_.each(methods, function (method) {
			spyOn(mapModel, method);
			element.mapToolbarWidget(mapModel);
			element.find('.' + method).click();
			expect(mapModel[method]).toHaveBeenCalledWith('toolbar');
		});
	});

	it('should invoke updateStyle on map model when value changes', function () {
		spyOn(mapModel, 'updateStyle');
		element.mapToolbarWidget(mapModel);
		element.find('.updateStyle').val('yellow');
		element.find('.updateStyle').change();
		expect(mapModel.updateStyle).toHaveBeenCalledWith('toolbar', 'color', 'yellow');
	});
	it('updates mm-target-property values on selection change', function () {
		const input = element.find('.updateStyle'),
			spy = jasmine.createSpy('changed');
		element.mapToolbarWidget(mapModel);
		input.change(spy);
		mapModel.getSelectedStyle = function (v) {
			if (v === 'color') {
				return 'x';
			}
		};
		mapModel.setIdea(content({}));
		mapModel.dispatchEvent('nodeSelectionChanged');
		expect(input.val()).toBe('x');
		expect(spy).toHaveBeenCalled();
	});
});
