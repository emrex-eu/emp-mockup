/* SUN FUN ver 1.0-SNAPSHOT, rev -1 */


/* Her tar vi vare på høyden til hjelpetekstboksene, dette for å kunne få til smooth animasjon  */
var helpHeight = (typeof helpHeight === "undefined") ? [] : helpHeight;
function fixHjelpetekstHeight(id) {
	if (typeof helpHeight[id] === "undefined") {
		var orig = jQuerySun("[id$='hjelp_"+id+"']");
		var tmp = jQuerySun(orig).clone().attr('id', 'tmpForHeight');
		jQuerySun(orig).after(tmp);
		helpHeight[id] = jQuerySun(tmp).show().height();
		jQuerySun(tmp).remove();
	}
	jQuerySun("[id$='hjelp_"+id+"']").css('height','0').show();
}


/* Funksjonalitet for hovedmeny - vennligst ikke rør!
*/
function createMenu(menu, menuitems, contextPath, servletPath, queryString) {
	var menuOpener = jQuerySun('#menuOpener')[0];
	if (typeof menuOpener === "undefined") {
		menuOpener = jQuerySun('<div id="menuOpener">').prependTo('#bar')[0];
		
		jQuerySun(menuOpener).attr('onclick', 'menuToggleWhole();');
	}

	
	if (menu == null) {
		menu = jQuerySun('<ul>').appendTo('nav#menuBar');
	}
	
	var fileRegexp = '\/([^\.]+).*';
	var selected = servletPath.replace(new RegExp(fileRegexp, 'g'), '$1');

	var currentURL = servletPath;
	if ("" != queryString) {
		currentURL += '?' + queryString;
	}
	
	for (var i=0; i<menuitems.length; i++) {
		var menuitem = menuitems[i];
		
		//var currentItemToMatch = menuitem[1].replace(new RegExp(fileRegexp, 'g'), '$1');
			
		if (menuitem == null || menuitem[3] == null || !menuitem[3])
			continue;
		
		var itemsToMatch = menuitem[2].split(',');
		//itemsToMatch.push(currentItemToMatch);
		var matched = (jQuerySun.inArray(selected, itemsToMatch) != -1) || (menuitem[1] == currentURL); // IE8 skjønner ikke indexOf: (itemsToMatch.indexOf(selected) != -1);
		
		var li = jQuerySun('<li>').appendTo(menu);
		if (matched) {
			li.addClass('active');
		}
		
		var link;
		if (menuitem[1] == '') {
			link = jQuerySun('<span>');
			link.attr('onclick', 'menuToggle(this);');
		} else {
			link = jQuerySun('<a>');
			link.attr('href', contextPath + menuitem[1]);
		}
		link.text(menuitem[0]);
		link.attr('title', menuitem[0]);

		if (matched && menuitem[4].length>0) {
			link.addClass('expanded');
		}
		li.append(link);

		if (menuitem[4].length > 0) {
			var ul = jQuerySun('<ul>').appendTo(li).addClass('submenu');
			if (matched) {
				ul.addClass('default-open');
			} else {
				ul.css('display', 'none');
			}	
			createMenu(ul, menuitem[4], contextPath, servletPath, queryString);
		}
		
	}
}

function menuToggle(menu) {
	var m = jQuerySun(menu);
	var s = m.siblings('.submenu').first();
	/*
	if (s.css('display') == 'none') {
		m.addClass('expanded');
	} else {
		m.removeClass('expanded');
	}
	*/
	s.slideToggle('fast', function(){});
}


function menuToggleWhole() {
	var s = jQuerySun('nav#menuBar');
	s.slideToggle('fast', function(){});
}


/* Top-bar (login, language, role...)
*/
function hideBar(bar) {
	jQuerySun(bar).removeClass('active').next('.dropdown-wrapper').removeClass('active');
}

jQuerySun(window).load(function() {
	var activeBar = null;
	var activeBarTimeout = null;

	jQuerySun('.dropdown-link.arrow').click(function barClick() {
		var chosen = this;
		if (activeBar != null && activeBar != chosen) {
			hideBar(activeBar);
			clearTimeout(activeBarTimeout);
		}
		activeBar = chosen;
		
		jQuerySun(chosen).toggleClass('active').next('.dropdown-wrapper').toggleClass('active');
	
		if (jQuerySun(activeBar).hasClass('active')) {
			jQuerySun(activeBar).parent('.dropdown').mouseout(function mouseOut() {
				if (activeBarTimeout) {
					clearTimeout(activeBarTimeout);
				}
				
				activeBarTimeout = setTimeout(function barTimeout() {
					hideBar(activeBar);
					activeBar = null;
				}, 500);
	
				jQuerySun(activeBar).parent('.dropdown').mouseover(function mouseOver() {
					clearTimeout(activeBarTimeout);
				});
			});
		
		} else {
			activeBar = null;
		}
		
		return false;
	});
	
	/* Fjerne border fra tabeller som blir generert rundt radioknapper 
	 */
	jQuerySun('input[type="radio"]').parent('td').css('border','none').parent('tr').css('border','none');
});

function showInfocontainer(id) {
	jQuerySun('[id="' + id + '"]').css('display','block');
}

function showInfocontainer(id, ms) {
	jQuerySun('[id="' + id + '"]').show(ms);
}

function hideInfocontainer(id) {
	jQuerySun('[id="' + id + '"]').css('display','none');
}

function fixErrorMessages() {
	//jQuerySun('.errorMessageInplace:not(:contains("Feilmelding"))').prepend('<h4>Feilmelding: </h4>');
	jQuerySun('.errorMessageInplace:not([value=""])').closest('.validateRegion').each(function() {
		// p:calendar lager en span rundt inputfeltet, og det er den som får validateField-klassen
		//		jQuerySun(this).find('.validateField, .validateField input:not(.select2-input), div.select2-container.validateField').addClass('validateFieldError');
		//		jQuerySun(this).find('div.select2-container ul, .select2-choice').css('border', 'none');
		jQuerySun(this).find('.validateField:not(.select2-container), .validateField input:not(.select2-input), div.select2-container.validateField .select2-choices, div.select2-container.validateField .select2-choice').addClass('validateFieldError');
		jQuerySun(this).find('.validateField.select2-container').removeClass('validateFieldError'); 
		jQuerySun(this).find('.validateFieldError input[type="checkbox"],input[type="radio"]').removeClass('validateFieldError');
		
		jQuerySun(this).find('.validateLabel:not(:has(div.errorMessageIcon))').append('<div class="iconInplaceSmall varselTrekant errorMessageIcon"></div>');
	});
}

function removeErrorMessages() {
	jQuerySun('*').removeClass('validateFieldError');
	jQuerySun('.iconInplaceSmall.varselTrekant.errorMessageIcon').remove();
}

function showPopup(popupId) {
	if (typeof PF === "undefined")
		window[popupId].show();
	else
		PF(popupId).show(); //bruker "convenience-objektet" som primefaces genererer. Trenger ikke lenger å finne riktig richfaces-objekt etter id.
	
	// Fiks for IE8 som ikke tolker riktig z-index hvis shadow-diven ligger sist i treet.
	var div = jQuerySun('.ui-widget-overlay');
	if (div != null) {
		jQuerySun('body').prepend(div);
	}
}


function hidePopup(popupId) {
	if (typeof PF === "undefined")
		window[popupId].hide();
	else
		PF(popupId).hide();
}


jQuerySun(document).keyup(function(keyPressEvent) {
    // evaluate key code
    var key = keyPressEvent.keyCode ? keyPressEvent.keyCode : keyPressEvent.which ? keyPressEvent.which : keyPressEvent.charCode;
    if (key == 27) { //escape
        closeOnEscape(); 
    }
});


function closeOnEscape() {
    var closeable;
    var indexHighest = 0;   
    jQuerySun(".ui-dialog.ui-widget.ui-widget-content.ui-overlay-visible").has('.ui-dialog-titlebar-close:visible').each(function() {
        var indexCurrent = parseInt($(this).css("zIndex"), 10);
        if (indexCurrent > indexHighest) {
            indexHighest = indexCurrent;
            closeable = this;
        }
    });   

    if (closeable != null) {
    	//jQuery(closeable).hide();
        jQuerySun(closeable).removeClass('ui-overlay-visible').addClass('ui-overlay-hidden');
        jQuerySun(closeable).css({'visibility':'', 'z-index':'', 'display':''});
        var modal = '[id="' + jQuery(closeable).attr('id') + '_modal"]';
        jQuerySun(modal).remove();
    }
}


function fixWidths() {
    jQuerySun(".rf-sel").each(function() {
    	  if (jQuerySun(this).attr("class")) {
	          var wfind = jQuerySun(this).attr("class").match(/^.*?cwidth(\d+).*?/);
	          if (wfind!=null) {
	                  var w = wfind[1];
	                  //alert(this + ": " + w);
	                  jQuerySun(this).width(w);
	                  jQuerySun(this).find('.rf-sel-opt,.rf-sel-sel,.rf-sel-cntr,.rf-sel-lst-scrl,.rf-sel-lst-dcrtn').width(w);
	                  jQuerySun(this).find('.rf-sel-inp').width(w-15);
	          }
    	  }
    });                                          
    jQuerySun("input[type=text],textarea,th,td").each(function() {
    	  if (jQuerySun(this).attr("class")) {
	          var wfind = jQuerySun(this).attr("class").match(/^.*?cwidth(\d+).*?/);
	          if (wfind!=null) {
	                  var w = wfind[1];
	                  if (jQuerySun(this).is('input')) {
	                	  w-=4;
	                  }
	                  jQuerySun(this).width(w);
	          }
    	  }
    });
     
}


function fixSelect2() {
	jQuerySun('select.chzn-select, select.chzn-select-deselect').each(function() {
		/* Vi henter alle klasser som ikke er automatisk tildelt av Select2
		 * og kopierer dem over til dropdownen
		 */
		var cl = jQuerySun(this).attr('class').replace(/(select2-|validate)[^\s$]+/g, '');
		var minW  = jQuerySun(this).outerWidth();
		
		var width = 'auto';
		if (cl.match(/fixed-width/)) {
			width = undefined;
		}

		var allowClear = false;
		if (cl.match(/chzn-select-deselect/)) {
			allowClear = true;
		}

		jQuerySun(this).select2('destroy');
		jQuerySun(this).select2({
			placeholder: jQuerySun(this).data('placeholder') ? jQuerySun(this).data('placeholder') : "Velg fra lista",
			dropdownCss: { 'width': width, 'min-width': minW  },
			allowClear: allowClear,
			dropdownCssClass: cl
		});
	});
}

function fixPlaceholder(id, text) {
	var selector = "";
	if (typeof id !== "undefined" && id != null && id != '') {
		selector = '[id$='+id+']';
	}
	jQuerySun('select' + selector + '.chzn-select, select' + selector + '.chzn-select-deselect').attr('placeholder', text).each(function() {
		if (jQuerySun(this).select2('val') === "NULL" || jQuerySun(this).select2('val') === "") {
			jQuerySun(this).select2('val', '');
		}
	});
}


/* Må ha dette for at hjelpeteksten skal havne til høyre for feltet
 */
function fixFloatOnFields() {
	jQuerySun('.select2-container:not(.nofloat)').css('float', 'left');
}


function fixExternalLinks() {
	if (typeof window.funSetup === "undefined") window.funSetup = {};
	if (typeof window.funSetup.contextPath === "undefined") window.funSetup.contextPath = "/";

	jQuerySun('a.link[href^="http"]:not([href*="' + window.funSetup.contextPath + '/"])').
		addClass('externalLink').
		attr('target','_blank');
	jQuerySun('.fixExternalLinks a') // Alle lenker innenfor en container skal være eksterne.  CKEditor legger ikke til klasser vi ønsker. 
		.addClass('link externalLink')
		.attr('target','_blank');
}

function fixFileuploadComponents() {
    //jQuerySun('.ui-fileupload-content .ui-messages-error').addClass('errorMessageInplace').css('display', 'table-cell');
    jQuerySun('.ui-fileupload-buttonbar').addClass('iconButtonContainer');
    jQuerySun('.ui-fileupload .ui-button').addClass('small grey iconButton verticalButton');
    jQuerySun('.ui-fileupload-buttonbar .ui-fileupload-cancel').addClass('deleteIcon');
    jQuerySun('.ui-fileupload-buttonbar .ui-fileupload-choose').addClass('addIcon');
    jQuerySun('.ui-fileupload-buttonbar .ui-fileupload-upload').addClass('arrowUpIcon'); 
}

function fixFun() {
	fixWidths();
	fixSelect2();
	fixFloatOnFields();
	fixExternalLinks();
	fixFileuploadComponents();
}


/* Optional */

function fixMobileCheckboxHeights() {
	jQuerySun('.checkboxContainerMobile').each(function() {
		var maxH = 0;
		jQuerySun(this).find('label').each(function() {
			var tempH = jQuerySun(this).outerHeight();
			if (tempH > maxH) {
				maxH = tempH;
			}
		});
		jQuerySun(this).find('label').height(maxH);
	});
}


function performHilightCalendarDays(id, dates) {
	for (var year in dates) {
		for (var month in dates[year]) {
			jQuerySun('[id$=":' + id + '"] td[data-month="' + (month-1) + '"][data-year="' + year + '"] > a').each(function() { 
				if (jQuerySun.inArray(parseInt(jQuerySun(this).text()), dates[year][month]) >= 0) {
					jQuerySun(this).addClass('calendarHasEvents');
				};
			} );
		}
	}
}


function hilightCalendarDays(id, dates) {
	performHilightCalendarDays(id, dates);
	jQuerySun('.ui-datepicker-prev, .ui-datepicker-next, [data-handler="selectDay"]').on('click', function() {
		hilightCalendarDays(id, dates);
	});
	jQuerySun('.ui-datepicker-month, .ui-datepicker-year').on('change', function() {
		hilightCalendarDays(id, dates);
	});
}


function performHilightCalendarWeek(id, weeknr) {
	jQuerySun('[id$=":' + id + '"] td.ui-datepicker-week-col').each(function() {
		if (parseInt(jQuerySun(this).text()) === weeknr) {
			jQuerySun(this).siblings().addClass('calendarIsCurrentWeek');
		}
	});
}

function hilightCalendarWeek(id, weeknr) {
	performHilightCalendarWeek(id, weeknr);
	jQuerySun('.ui-datepicker-prev, .ui-datepicker-next, [data-handler="selectDay"]').on('click', function() {
		hilightCalendarWeek(id, weeknr);
	});
	jQuerySun('.ui-datepicker-month, .ui-datepicker-year').on('change', function() {
		hilightCalendarWeek(id, weeknr);
	});
}

var escapeHTML = (function () {
    'use strict';
    var chr = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return function (text) {
        return text.replace(/[\"&<>]/g, function (a) { return chr[a]; });
    };
}());


/* Fiks ting som må fikses etter at vinduet har blitt resizet
 */
jQuerySun(window).resize(function() {
    checkWindowWidth();
});

function checkWindowWidth() {
	var windowsize = jQuerySun(window).width();
	
	if (windowsize > 360) {
		jQuerySun("nav#menuBar").show();
	} else {
		jQuerySun("nav#menuBar").hide();
	}
	
	if (windowsize < 815) {
		if (typeof(openLoginModule) !== "undefined") {
			openLoginModule(null);
		}
	}
}


