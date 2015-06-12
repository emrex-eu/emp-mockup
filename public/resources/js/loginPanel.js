function openLoginModule(module) {
	var windowsize = jQuerySun(window).width();

	if (windowsize > 815 && module != null) {
		jQuerySun(module).first()
			.map(function(i,e){
				jQuerySun(".login-module-box").hide();
				jQuerySun(".login-module-box." + e).show();
	
				jQuerySun(".login-flap").removeClass('active');
				jQuerySun(".login-flap." + e).addClass('active');
			});
	} else {
		jQuerySun(".login-module-box").show();
		jQuerySun(".login-flap").hide();
	}
}

function getModuleFromURI() {
	return jQuerySun(window.location.search.split("&"))
		.filter(function(i,e){ return e.match(/^loginModule=\w+/);}).first()
		.map(function(i,e){return "login-name-"+ e.substring(12);})
		.filter(function(i,e){ return jQuerySun(".login-module-box."+e).length > 0;});
}

function getModuleFromFlap() {
	return getLoginName(jQuerySun('.login-flap').first());
}

function getLoginName(obj) {
	return jQuerySun(jQuerySun(obj).attr("class").split(" "))
					.filter(function(i,e){return e.match(/^login-name-\w+/);}).first();
}

jQuerySun(document).ready(function() {
	jQuerySun('.login-flap').map(function (i,e) {
		jQuerySun(e).click(function() {	openLoginModule(getLoginName(e));});
	});
	var h = jQuerySun('#login-flaps').outerHeight();
	jQuerySun('.login-module-box').css('min-height', h);

	openLoginModule(jQuerySun.merge(getModuleFromURI(),
									getModuleFromFlap())
									.first());
});


