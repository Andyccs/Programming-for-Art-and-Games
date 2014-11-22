Logger.debug("Initializing Global Variable");
var tick = 20;	//sim timer interval

// var W = window.innerWidth;
// var H = window.innerHeight;
var W = 1000;
var H = 700; //the frame width and height
var Donkey;
var Map;
var Hero;
var Minion;
var Portal1;
var Portal2;
//physical constants
var g = 0.1;

//time step for physical simulation
var dt = 1;	

//tolerance
var EPS = 0.01;	

//the simulation objects
//all objects in this list are updated by the timer loop
var simList = [];

var collider = [];

isCollide = function(hero,collider){
	return hero.x>collider.x-collider.w/2 && hero.x<collider.x+collider.w/2 &&
		hero.y>collider.y-collider.h/2 && hero.y<collider.y+collider.h/2;
}

Initializer = {
	init : function init(){
		Logger.debug("Initializing Sprite Library");
		Frame.addBkgndImg('images/map1.png');

		var left = (window.innerWidth-W)/2;
		var top = (window.innerHeight-H)/2;
		Frame.init(left,top,W,H,'#fff');
		Map = MapFactory.createMap();

		window.setInterval(function simStep(){
			//called from the timer
			for (var i=0; i<simList.length; i++) {
				if (simList[i].isActive) {
					simList[i].step();
				}
			}

			for (var i=0; i<collider.length; i++) {
				if (isCollide(Hero,collider[i])) {
					Hero.isDied = true;
					collider[i].isActive = false;
				}
			}

			Map.colliderHandler();

			Frame.draw();
		}, tick);

		Donkey = DonkeyFactory.createDonkey();
		simList.push(Donkey);
		collider.push(Donkey);

		Hero = HeroFactory.createHero(0,100);
		simList.push(Hero);
		Map.colliderList.push(Hero);

		Portal1 = PortalFactory.createPortal(W-50, Map.lvlOneStep3Btm);
		Portal2 = PortalFactory.createPortal(50, Map.lvlTwoBtm);

		Minion = MinionFactory.spawnRandomMinion();
		simList.push(Minion);

		window.onmousedown = function(e){
			var x = getMouseX(e);	//get mouse-x in Frame coordinates	
			var y = getMouseY(e);	//get mouse-y in Frame coordinates
			
			newBall = BallFactory.createBall(x, y, 20, 0, 1);
			simList.push(newBall);
			Map.colliderList.push(newBall);
		}	
	}
}