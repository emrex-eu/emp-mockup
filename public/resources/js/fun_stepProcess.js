var stepsForId;

if (typeof stepsForId === "undefined") {
	 stepsForId = [];
}

function createStepProcess(id, currentStep, steps) {
	var j = jQuerySun;
	var sp = j('[id$=":'+id+'"] ul');
	sp.empty();
	
	if (typeof steps === "undefined" && typeof stepsForId[id] !== "undefined") {
		steps = stepsForId[id];
	} else {
		stepsForId[id] = steps;
	}
	
	var done = -1;
	for (var i=0; i<steps.length; i++) {
		var step = steps[i], stepNr = step[0], stepName = step[1], stepDescr = step[2];
		var li = j('<li class="step"/>').appendTo(sp);

		if (done === -1 && stepNr === currentStep) done = 0;
		j(li).addClass((done == -1) ? 'done' : ((done == 0) ? 'current' : 'todo'));


		var top = j('<div class="processTop"/>').appendTo(li);

		var left = j('<div class="left"/>').appendTo(top);
		if (i > 0) {
			j('<div class="line"/>').appendTo(left);
		}
		j('<div class="idx">'+stepNr+'</div>').appendTo(top);
		
		var right = j('<div class="right"/>').appendTo(top); 
		if (i<steps.length-1) {
			j('<div class="line"/>').appendTo(right);
		}

		j('<div class="name">' + stepName + '</div>').appendTo(li);
		if (typeof stepDescr !== "undefined" && stepDescr !== "") {
			j('<div class="desc">' + stepDescr + '</div>').appendTo(li);
		}
		
		if (done === 0) done = 1;
	}
	
}