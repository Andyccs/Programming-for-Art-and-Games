Logger.debug("Initializing Global Variable");
var tick = 20;	//sim timer interval

var W = window.innerWidth;
var H = window.innerHeight;
var Donkey;

//physical constants
var g = 0.1;

//time step for physical simulation
var dt = 1;		

//the simulation objects
//all objects in this list are updated by the timer loop
var simList = [];

Initializer = {
	init : function init(){
		Logger.debug("Initializing Sprite Library");

		var left = (window.innerWidth-W)/2;
		var top = (window.innerHeight-H)/2;
		Frame.init(left,top,W,H,'#fff');


		window.setInterval(function simStep(){
			//called from the timer
			for (var i=0; i<simList.length; i++) 
				if (simList[i].isActive) 
					simList[i].step();
			Frame.draw();
		}, tick);

		Donkey = DonkeyFactory.createDonkey();
		simList.push(Donkey);
		
	}
}