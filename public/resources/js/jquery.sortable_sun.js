function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

function sortableInitValues(id, values) {
	values.sort();
	var ol = jQuerySun('[id$="' + id + '_container"] ol');
	var select = jQuerySun(ol).parent().find('.sortableListSelectContainer select');
	for (var i=0; i<values.length; i++) {
		var option = values[i];
		var key = option[1];
		addSortableItem(select, false, key, false);
	}
}

function makeSortable() {
	
	jQuerySun('.sortableList').unbind('sortupdate').sortable('destroy');
	jQuerySun('.sortableList').sortable().bind('sortupdate', function() {
		
		// TODO: Denne blir kalt to ganger per update, usikker på hvorfor.
	    makeSortableIcons();
	    updateSortableSavevar(this);

	}).each(function() {
		var min = jQuerySun(this).data('min');
		var max = jQuerySun(this).data('max');
		var width = jQuerySun(this).data('width');
		
		var sortableListContainer = jQuerySun(this).closest('.sortableListContainer');
		
		var listId = jQuerySun(sortableListContainer).attr('id').replace(/_container$/, "");

		var lis = jQuerySun(sortableListContainer).find('.sortableList > li');
		var selectContainer = jQuerySun(sortableListContainer).find('.sortableListSelectContainer')[0];
		
		// Finne ut bredden på legg-til-knappen og hele selecten
		var props = { position: "absolute", visibility: "hidden", display: "block" };
		/*
		//var button = jQuerySun(selectContainer).find('button')[0];
		//var buttonWidth = 0;
		
		jQuerySun.swap(jQuerySun(button).parents('.sortableListSelectContainer')[0], props, function(){
			buttonWidth = jQuerySun(button).outerWidth();
		});
		*/
		jQuerySun(selectContainer).find('select').width(width); // (width - buttonWidth - 10);
		jQuerySun(sortableListContainer).width(width+37);
		
		jQuerySun(lis).find('.sortableListContentContainer').width(width-105);
		var optionsLeft = (jQuerySun(selectContainer).find('option:not([disabled="disabled"])').length > 1); /* det finnes 1 tom option i tillegg! */
		
		var mustHave = (min !== undefined && min > 0) ? min : ((max !== undefined && max > 0) ? max : undefined);
		if (mustHave !== undefined || !optionsLeft) {
			var msgDone = jQuerySun(sortableListContainer).next('.sortableListMessageDone')[0];
			
			if ((max !== undefined && max > 0 && lis.length >= max) || !optionsLeft) {
				jQuerySun(selectContainer).hide();
			} else {
				jQuerySun(selectContainer).show();
			}

			if (lis.length >= mustHave) {
				jQuerySun(msgDone).show();
				jQuerySun('.sortableMustHaveEnough_' + listId).removeAttr('disabled');
			} else {
				jQuerySun(msgDone).hide();
				jQuerySun('.sortableMustHaveEnough_' + listId).attr('disabled', 'disabled');
			}
		}
		
		updateSortableSavevar(this);
		
	});

	makeSortableIcons();
}


function updateSortableSavevar(list) {
	var saveVar = jQuerySun(list).data('savevar');
	var lis = jQuerySun(list).children('li');
	var items = [];
	jQuerySun(lis).each(function() {
		items.push([jQuerySun(this).index(), jQuerySun(this).data('value'), jQuerySun(this).text()]);
	});
	jQuerySun('[id$="' + saveVar + '_hidden"]').val(JSON.stringify(items)).trigger('change');
}


function makeSortableIcons() {
	var imgPath = "./resources/img/icons_d/16x16/";
	var imgDeleteSrc = imgPath + "Delete-16x16.png";
	var imgUpSrc = imgPath + "Arrow-up-16x16.png";
	var imgDnSrc = imgPath + "Arrow-down-16x16.png";
	
	jQuerySun('.sortableListContainer').each(function() {
		var cur = 0;
		var lis = jQuerySun(this).find('.sortableList > li');

		lis.each(function() {
			var textDelete = jQuerySun(this).parent().data('textdelete');
			var textUp = jQuerySun(this).parent().data('textmoveup');
			var textDn = jQuerySun(this).parent().data('textmovedn');
				
			var imgDelete = '<a href="#" title="' + textDelete + '" class="icon iconAction" onClick="removeSortableItem(this); return false;"><img alt="' + textDelete + '" src="' + imgDeleteSrc + '"/></a>';
			var imgUp = '<a href="#" title="' + textUp + '" class="icon iconAction" onClick="moveSortableItemUp(this); return false;"><img alt="' + textUp + '" src="' + imgUpSrc + '"/></a>';
			var imgDn = '<a href="#" title="' + textDn + '" class="icon iconAction" onClick="moveSortableItemDown(this); return false;"><img alt="' + textDn + '" src="' + imgDnSrc + '"/></a>';
			var empty = '<div style="width: 22px; display: inline-block;"/>';

			jQuerySun(this).find('.sortableListIconContainer').remove();
			var cont = jQuerySun('<span class="sortableListIconContainer"/>');
			jQuerySun(this).prepend(cont);

			var textDragAndDrop = jQuerySun(this).parent().data('textdraganddrop');
			var itemValue = jQuerySun(this).data('value');
			var itemText = jQuerySun(this).find('.sortableListContentContainer').text();
			
			jQuerySun(this).attr('title', textDragAndDrop);
			jQuerySun(this).find('.sortableListContentContainer').attr('title', itemText);
			
			var imgs = [imgUp, imgDn, imgDelete]; 

			for (var i=0; i<imgs.length; i++) {
				imgs[i] = imgs[i].replace(/%ITEM%/g, escapeHTML(itemText)).replace(/%PLACE_UP%/g, cur).replace(/%PLACE_DN%/g, cur+2);
			}
				
			if (cur > 0 ) {
				jQuerySun(imgs[0]).appendTo(cont);
			}
			if (cur+1 < lis.length) {
				jQuerySun(imgs[1]).appendTo(cont);
			} else {
				jQuerySun(empty).appendTo(cont);
			}
			jQuerySun(imgs[2]).appendTo(cont);
			
			cur++;
		});
		
		fixSortNumberHeights(lis);
	});
	
}

function moveSortableItemUp(item) {
	var li = jQuerySun(item).parent().parent();
	var prev = jQuerySun(li).prev();
	var callback = function() {
		prev.insertAfter(li);
	    makeSortableIcons();
	    prev.slideDown(200);
		updateSortableSavevar(li.parent());
    };
    prev.slideUp(210, callback);
}

function moveSortableItemDown(item) {
	var li = jQuerySun(item).parent().parent();
	var next = jQuerySun(li).next();
	var callback = function() {
		li.insertAfter(next);
	    makeSortableIcons();
		updateSortableSavevar(li.parent());
    };
    next.slideUp(200, callback).slideDown(200);
}

function removeSortableItem(item) {
	var li = jQuerySun(item).parent().parent();
	var select = jQuerySun(li).parent().parent().find('select')[0];
	var val = li.attr('data-value');
	//jQuerySun(select).append('<option value="' + val + '">' + val + '</li>');
	jQuerySun(select).find('option[value="' + val + '"]').removeAttr('disabled');

	var callback = function() {
		jQuerySun(li).remove();
		makeSortable();
		fixAll();
	};
	li.slideUp(200, callback);

}

function fixSortNumberHeights(lis) {
	// Dette må gjøres i en ny loop pga bug i IE
	// Reset height first
	jQuerySun('.sortableListContainer').find('div.sortNumber').height('');
	cur = 0;
	lis.each(function() {
		cur++;
		// Fiks høyden på tilsvarende tall, og ja, de begynner fra 1
		jQuerySun(this).closest('.sortableListContainer').find('div.sortNumber[data-value="'+cur+'"]').height(jQuerySun(this).outerHeight());
	});
}

function addSortableItem(obj, isButton, key, refreshAll) {
	var selectContainer = jQuerySun(obj).parent();
	var select = jQuerySun(selectContainer).find('select');
	
	var list   = jQuerySun(selectContainer).parent().children('ol,ul');
	
	var itemValue;
	
	if (isButton) {
		itemValue = jQuerySun(select).val();
	} else {
		itemValue = key;
	}

	if (itemValue == '') {
		return;
	}
	
	var option = jQuerySun(select).find('option[value="' + itemValue + '"]');
	
	// Hvis ønsket nøkkel ikke finnes i lista så er det ikke mye mer vi kan gjøre her
	if (option.length == 0) {
		return;
	}
	
	var itemText = jQuerySun(option).text();
	jQuerySun(option).attr('disabled','disabled');
	
	jQuerySun(select).val(jQuerySun(select).find('option:not([disabled="disabled"])')[0].value);
	//select.val('');
	//var ph = jQuerySun('<li class="sortable-placeholder" style="border: none; box-shadow: none; display: none;"></li>').appendTo(list);
	var width = list.data('width');
	var ny = jQuerySun('<li style="display: none;" data-value="' + escapeHTML(itemValue) + '"><div class="sortableListContentContainer">' + escapeHTML(itemText) + '</div></li>').appendTo(list).width(width);

	if (isButton) {
		var callback = function() {
			if (ny == null) return;
			ny = null;
			if (refreshAll) {
				makeSortable();
				fixAll();
			}
			
			// Denne må kjøres pga en bug i IE, se STWJS-334; (og den MÅ ha en liten delay)
			sleep(10, function() { fixSortNumberHeights(jQuerySun(list).children('li')); });
		};
		
		var max = list.data('max');
		var cur = list.children('li').length;
		var optionsLeft = jQuerySun(select).find('option:not([disabled="disabled"])').length; /* det finnes 1 tom option i tillegg! */
		if ((max !== undefined && cur > max) || optionsLeft == 1) {
			selectContainer.slideUp(200);
		}
		ny.slideDown(200, callback);
	} else {
		jQuerySun(ny).show();
		if (refreshAll) {
			makeSortable();
			fixAll();
		}
	}
	
}


/*
 * HTML5 Sortable jQuery Plugin
 * http://farhadi.ir/projects/html5sortable
 * 
 * Copyright 2012, Ali Farhadi
 * Released under the MIT license.
 */
(function($) {
var dragging, placeholders = $();
$.fn.sortable = function(options) {
	var method = String(options);
	options = $.extend({
		connectWith: false
	}, options);
	return this.each(function() {
		if (/^enable|disable|destroy$/.test(method)) {
			var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('connectWith items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			return;
		}
		var isHandle, index, items = $(this).children(options.items);
		var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
		/* Matija */
		var width = $(this).data('width');
		if (width != '') {
			$(placeholder).width(width);
		}
		/* /Matija */
		
		items.find(options.handle).mousedown(function() {
			isHandle = true;
		}).mouseup(function() {
			isHandle = false;
		});
		$(this).data('items', options.items)
		placeholders = placeholders.add(placeholder);
		if (options.connectWith) {
			$(options.connectWith).add(this).data('connectWith', options.connectWith);
		}
		items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
			if (options.handle && !isHandle) {
				return false;
			}
			isHandle = false;
			var dt = e.originalEvent.dataTransfer;
			dt.effectAllowed = 'move';
			dt.setData('Text', 'dummy');
			index = (dragging = $(this)).addClass('sortable-dragging').index();
		}).on('dragend.h5s', function() {
		    if (!dragging) { 
		    	return; 
		    }
		    dragging.removeClass('sortable-dragging').show();
			placeholders.detach();
			if (index != dragging.index()) {
				dragging.parent().trigger('sortupdate', {item: dragging});
			}
			dragging = null;
		}).not('a[href], img').on('selectstart.h5s', function() {
			this.dragDrop && this.dragDrop();
			return false;
		}).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
			if (!items.is(dragging) && options.connectWith !== $(dragging).parent().data('connectWith')) {
				return true;
			}
			if (e.type == 'drop') {
				e.stopPropagation();
				placeholders.filter(':visible').after(dragging);
				dragging.trigger('dragend.h5s');
				return false;
			}
			e.preventDefault();
			e.originalEvent.dataTransfer.dropEffect = 'move';
			if (items.is(this)) {
				if (options.forcePlaceholderSize) {
					placeholder.height(dragging.outerHeight());
				}
				dragging.hide();
				$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
				placeholders.not(placeholder).detach();
			} else if (!placeholders.is(this) && !$(this).children(options.items).length) {
				placeholders.detach();
				$(this).append(placeholder);
			}
			return false;
		});
	});
};
})(jQuerySun);
