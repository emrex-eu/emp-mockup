/*
var multiSelectInited;

jQuerySun(window).load(function() {
	if (typeof multiSelectInited === "undefined") {
		multiSelectInited = true;
		multiSelectSetupAll();
	}
});

function multiSelectSetupAll() {
	jQuerySun("select.fun-multiselect, input.fun-multiselect-ajax").each(function() {
		multiSelectSetup(this);
	});
}
*/

jQuerySun(window).load(function() {
	jQuerySun("select.fun-multiselect, input.fun-multiselect-ajax").each(function() {
		multiSelectSetup(this);
	});
});

function multiSelectSetup(sel) {
	var isAjax = jQuerySun(sel).hasClass('fun-multiselect-ajax');
	var id = jQuerySun(sel).data('update-list');
	var ul = jQuerySun('[id="' + id + '"]');
	var save = jQuerySun(ul).find('input');

	if (typeof sel.alreadyInited !== "undefined") {
		return;
	}
	sel.alreadyInited = true;


	jQuerySun(ul).width(jQuerySun(sel).outerWidth());

	var preSelected = jQuerySun(save).val();

	if (preSelected !== "" && typeof preSelected !== "undefined") {
		lis = JSON.parse(preSelected);
		for (var i=0; i<lis.length; i++) {
			var li = funMultiselectAdd(lis[i][0], lis[i][1]);
			jQuerySun(li).show();
		}
	}
	
	funMultiselectHideIfEmpty();

	
	function funMultiselectAdd(val, label) {
		var opt, optText, found = false;
		
		// Sjekk om verdien allerede ligger i lista
		jQuerySun(ul).find('li').each(function() {
			var sjekkVal = jQuerySun(this).data('value');
			if (sjekkVal === val) {
				found = true;
				return;
			}
		});

		if (found)
			return;
		
		if(!isAjax) {
			opt = jQuerySun(sel).find('option[value="'+val+'"]');
			jQuerySun(opt).attr('disabled', 'disabled');
			optText = jQuerySun(opt).html();
		} else 
			optText = label;

		var li = jQuerySun("<li>" + optText + "</li>");
		jQuerySun(li).data('value', val).data('label', optText).hide();

		var img = jQuerySun('<a href="#" class="fun-multiselect-choice-close icon iconAction"></a>');
		jQuerySun(img).prependTo(li);

		jQuerySun(img).on('click', function() {
			var liClick = jQuerySun(this).parent();
			var valClick = jQuerySun(liClick).data('value');
			jQuerySun(sel).find('option[value="'+valClick+'"]').removeAttr('disabled');

			jQuerySun(liClick).slideUp(200, function() {
				jQuerySun(liClick).remove();
				jQuerySun(sel).parents('.hideIfEmpty').show(); //slideDown(200).css('overflow','');

				funMultiselectUpdateReturnValue();
			});
			return false;

		});

		jQuerySun(li).appendTo(ul);
		return li;
	}


	function funMultiselectUpdateReturnValue() {
		var ret = [];
		/* retAjax = []; Denne skal hjelpe med å filtrere duplikater - funker ikke ennå */ 
		jQuerySun(ul).find('li').each(function() {
			var item = [];
			var val = jQuerySun(this).data('value');
			var label = jQuerySun(this).data('label');
			item.push(val);
			item.push(label); 
			ret.push(item);
			// retAjax.push(val);
		});
		jQuerySun(save).val(JSON.stringify(ret)).trigger("change");
		//if (isAjax) {
		//	jQuerySun(sel).val(retAjax.join(','));
		//}
	}


	function funMultiselectHideIfEmpty() {
		if (!isAjax) {
			var left = jQuerySun(sel).find('option[disabled!="disabled"][value!=""][value!="NULL"]').length;
			if (left == 0) {
				jQuerySun(sel).parents('.hideIfEmpty').hide(); //slideUp(200);
			}
		}
	}
	
	
	jQuerySun(sel).on('change', function() {
		var val = jQuerySun(this).val();
		var label = jQuerySun(this).select2('data').text;

		var li = funMultiselectAdd(val, label);

		jQuerySun(li).slideDown(200, function() {
			funMultiselectHideIfEmpty();
		});
		
		jQuerySun(this).select2("val", "");
		
		/* Oppdater hidden-inputfeltet
		*/
		funMultiselectUpdateReturnValue();
		
	});

}


