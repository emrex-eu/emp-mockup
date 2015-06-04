var allSelectableNodes, xml;

function displayXml(rebuild, fnr) {
	var j = jQuerySun;
	var resultsDiv = j('#results');
	j(resultsDiv).children().remove();

	var internalId = 0;
	allSelectableNodes = [];
	var singleCourses = [];
	var degree;
	var fileId = 0;
	
	var orig = j('#elmo').val();
	if (orig == null) return;
	if (rebuild) {
		//orig = UTF8.decode(j('[id$="elmo"]').val()); // jQuerySun('[id$="elmo"]').val(); //UTF8.decode(orig)).val()
		/*
		if (orig.match(/^\&lt;xml/)) {
			orig = $('<div/>').html(orig).text();
		}
		*/
		xml = j.parseXML(orig);
	}
	
	/* Report
	*/
	j(xml).find('report').each(function() {
		var report = this;

		var issuer = getTag('title', j(report).find('issuer'));
		//j('<header>' + issuer + '</header>').appendTo(resultsDiv);
		
		degree = "";
		var t = j('<table/>');
		j('<tr><th class="issuer" colspan="6">' + issuer + "</th></tr>").appendTo(t);
		
		j(report).children('learningOpportunitySpecification').each(function() {
			addRow(t, this, false, 0);
		});
		

		if (singleCourses.length > 0) {
			var tr = j('<tr class="degree"></tr>');
			j('<th class="check"><input type="checkbox" class="degree_' + null + '" onclick="checkDegreeCourses(this, null);"></input></th><th colspan="5">Courses without a programme</th>').appendTo(tr);
			j(tr).appendTo(t);
			degree = null;
			
			singleCourses.forEach(function(spec) {
				addRow(t, spec, true, 0);
			});
		}
		
		j(t).appendTo(resultsDiv);
	});


	lastInternalId = internalId;
	j('input[type="checkbox"]').prop('checked','true');

	j('#results a').each(function() {
		j(this).on('click', function() {
			var descr = j(this).next('.descr');
			j(descr).slideToggle();
			return false;
		});
	});


	/* Attachments
	*/
	j(xml).find('attachments').each(function () {
		j(this).find('file').each(function () {
			fileId++;
			j(this).attr('fileId', fileId);
			var link = j('<div class="attachment">Attachment: </div>');
			//j('<a target="_new" href="data:'+ j(this).attr('contentType') + ';' + j(this).attr('encoding') + ',' + j(this).text().replace(/[^-A-Za-z0-9+/=]/g, '') +'">' + j(this).attr('name') + '</a>').appendTo(link);
			j('<a href="#" onclick="getFile(' + fileId + '); return false;">' + j(this).attr('descr') + '</a>').appendTo(link);
			link.appendTo(resultsDiv);
		});
	});


	function addRow(t, spec, erEnkelt, partLevel) {
		var type = j(spec).find('type').first().text().toLowerCase();
		var qualification = j(spec).children('qualification');
		var specifies = j(spec).children('specifies');
		var parent = j(spec).parent();
		var parentType = (j(parent).prop("tagName").toLowerCase() === "report") ? "report" : j(parent).find('type').first().text().toLowerCase(); 
		
		if (type === "module" && parentType == "report" && !erEnkelt) {
			singleCourses.push(spec);
			return;
		}

		isTopLevel = (partLevel < 2);

		if (isTopLevel) {
			internalId++;
			elmoIdTag = j(spec).children('identifier[type="elmo"]');
			var elmoId = internalId; 
			if (elmoIdTag.length == 1) {
				elmoId = j(elmoIdTag).text();
				allSelectableNodes[elmoId] = spec;
			/*
			} else {
				j('<identifier type="elmo">' + internalId + '</identifier>').appendTo(spec);
				elmoId = internalId;
			*/
			}
		}

		var tr = j('<tr></tr>');

		switch (type) {
			case "degree":
				degree = j(qualification).first().children('identifier[type="elmo"]').text();
				degreeQ = "'" + degree + "'";
				var th = j('<th class="check"></th>').appendTo(tr);
				if (isTopLevel) {
					j('<input type="checkbox" class="degree_'+degree+'" name="id['+elmoId+']" onclick="checkDegreeCourses(this, ' + degreeQ + ');"></input>').appendTo(th);
				}

				var name = getTag('title', spec);

				var descr = "";

				var programme = getTag('educationLevel', qualification);
				if (programme !== "") {
					descr += "Programme: " + programme + "<br>";
				}

				var field = getTag('qualificationMainStudyField', qualification);
				if (field !== "") {
					descr += "Field: " + field + "<br>";
				}

				var date = getTag('date', j(spec).find('learningOpportunityInstance'));
				if (date !== "") {
					descr += "Date: " + date + "<br>";
				}

				j('<th colspan="5"><a href="#">'+ name + '</a><div class="descr">' + descr + '</div></th>').appendTo(tr);
				tr.addClass('degree');
				break;

			default:
				var kode = j(spec).children('identifier[type="fs"]').text();
				degreeQ = "'" + degree + "'";

				var td = j('<td class="check"></td>').appendTo(tr);
				if (isTopLevel) {
					j('<input type="checkbox" class="emne_'+degree+'" name="id['+elmoId+']" onclick="checkDegreeForOneCourse(this, ' + degreeQ + ')"></input>').appendTo(td);

				} else {
					tr.addClass('partOnly');
				}

				var name = getTag('title', spec);
				
				var descr = getTag('educationLevel', qualification);
				if (descr !== "") {
					descr = 'Level: ' + descr + '';
				}

				var creds = j(spec).children('credit').children('value').text();
				if (creds == 0) { creds = ""; }

				var scheme = j(spec).children('credit').children('scheme').text();

				var result = j(specifies).find('result').text();

				if (descr !== "") {
					descr = '<div class="descr">' + descr + '</div>';
					name  = '<a href="#">' + name + '</a>';
				}
				
				j('<td class="emnekode">'+ kode +'</td><td>'+ name + descr + '</td><td class="creds">'+ creds +'</td><td class="scheme">' + scheme + '</td><td class="result">'+ result +'</td>').appendTo(tr); 
				break;
		}
		j(tr).appendTo(t); 

		//if (!erEnkelt) {
		//if (type === "degree" || (parentType === "degree" && type === "module")) {
			j(spec).children('hasPart').each(function() {
				j(this).children('learningOpportunitySpecification').each(function() {
					addRow(t, this, false, partLevel+1);
				});
			});
		// }
	}
	
	function getTag(tagName, parent) {
		var res = "";
		j(parent).children(tagName).each(function() {
			var lang = j(this).attr('xml:lang');
			var text = j(this).text();
			if (text !== "" && (res === "" || lang === "en")) {
				res = text;
			}
		});
		return res;
	}
}


function getFile(fileId) {
	var j = jQuerySun;
	var file = j(xml).find('file[fileId="'+fileId+'"]');
	var link = j('<a target="_new"></a>');
	var dataBase64 = j(file).text().replace(/[^-A-Za-z0-9+/=]/g, '');
	var dataUrl = 'data:' + j(file).attr('contentType') + ';' + j(file).attr('encoding') + ',' + dataBase64;

	if(window.navigator.msSaveOrOpenBlob) {
		var binary = decodeBase64(dataBase64);
		var bytes = new Uint8Array(binary.length);
		for (var i=0; i<binary.length; i++)
		    bytes[i] = binary.charCodeAt(i);
		    
    	blobObject = new Blob([bytes], { 'type': j(file).attr('contentType') });
    	j(link).click(function(){
    		window.navigator.msSaveOrOpenBlob(blobObject, j(file).attr('name'));
    	});
    } else {
		j(link).attr('href', dataUrl);
	}
	j(link)[0].click();
}
	

function checkDegreeCourses(check, degree) {
	jQuerySun('#results').find('input[type="checkbox"].emne_' + degree).each(function() {this.checked=check.checked});
}

function checkDegreeForOneCourse(check, degree) {
	if (check.checked) {
		jQuerySun('#results').find('input[type="checkbox"].degree_' + degree).each(function() {this.checked=true});
	}
}

function enableDisableFetch() {
	var fetch = jQuerySun('[id$=":fetch"]');
	var disabled = jQuerySun('select[id$=":inst"]').val() === "" ? true : false;
	if (disabled)
		jQuerySun(fetch).attr("disabled", disabled);
	else
		jQuerySun(fetch).removeAttr("disabled");
}


function updateXml() {
	for (var id in allSelectableNodes) {
		if (allSelectableNodes.hasOwnProperty(id)) {
			var checked = jQuerySun('input[name="id['+id+']"]').prop("checked");
			if (!checked) {
				var item = allSelectableNodes[id];
				var isHasPart = jQuerySun(item).closest('hasPart');
				if (isHasPart.length > 0) 
					jQuerySun(isHasPart).remove();
				else
					jQuerySun(item).remove();
			}
		}
	}

	var ret = (new XMLSerializer()).serializeToString(xml);
	//ret = UTF8.decode(ret);
	var ids = [];
	jQuerySun(xml).find('identifier[type="elmo"]').each(function(i, sel) {
		ids[i] = jQuerySun(sel).text();
	});
	jQuerySun('#selectedElmoIds').text('Selected Elmo IDs: ' + ids.join(', ')).show();
	
	jQuerySun('#elmo').val(ret);
}


function hideExportForm() {
	jQuerySun('#exportForm').hide();
}

function showExportForm() {
	jQuerySun('#exportForm').show();
}


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/geral/utf-8 [v1.0]

UTF8 = {
	encode: function(s){
		for(var c, i = -1, l = (s = s.split("")).length, o = String.fromCharCode; ++i < l;
			s[i] = (c = s[i].charCodeAt(0)) >= 127 ? o(0xc0 | (c >>> 6)) + o(0x80 | (c & 0x3f)) : s[i]
		);
		return s.join("");
	},
	decode: function(s){
		for(var a, b, i = -1, l = (s = s.split("")).length, o = String.fromCharCode, c = "charCodeAt"; ++i < l;
			((a = s[i][c](0)) & 0x80) &&
			(s[i] = (a & 0xfc) == 0xc0 && ((b = s[i + 1][c](0)) & 0xc0) == 0x80 ?
			o(((a & 0x03) << 6) + (b & 0x3f)) : o(128), s[++i] = "")
		);
		return s.join("");
	}
};


decodeBase64 = function(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};
