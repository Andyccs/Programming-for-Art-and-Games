HeroFactory = {
	createHero : function createHero(x,y){
		var IMAGE_WIDTH = 40;
		var IMAGE_HEIGHT = 40;

		Logger.debug("Initializing Hero");
			
		var me = new Sprite('images/hero.png', x, y, IMAGE_WIDTH, IMAGE_HEIGHT , {centered: true});
		me.isActive = true;
		me.upKey = false;
		me.leftKey = false;
		me.rightKey = false;
		me.spaceKey = false;
		me.isFlying = false;
		me.x = x;
		me.y = y;
		me.vx = 0;
		me.vy = 1;
		me.smootTransition = 0;

		me.ground = 0;

		me.changeGround = function(){
			var prevGround = me.ground;
			if(me.y<Map.lvlTwoBtm){
				me.ground = Map.lvlOneBtm;
				if(me.x>Map.lvlOneStep3Left){
					me.ground = Map.lvlOneStep3Btm;
				}else if(me.x > Map.lvlOneStep2Left){
					me.ground = Map.lvlOneStep2Btm;
				}else if(me.x>Map.lvlOneStep1Left){
					me.ground = Map.lvlOneStep1Btm;
				}
			}else if(me.y<Map.lvlThreeBtm){
				me.ground = Map.lvlTwoBtm;
				if(me.x>Map.lvlTwoHoleLeft+IMAGE_WIDTH/2 && me.x<Map.lvlTwoHoleRight-IMAGE_WIDTH/2){
					me.ground = Map.lvlOneBtm;
				}
			}else{
				me.ground = Map.lvlThreeBtm;
			}

			return me.ground != prevGround;
		}

		me.changeGround();
		
		document.onkeydown = function(e) {
			e = window.event;
			
			if (e.keyCode == '38') {
				me.upKey = true;
				Logger.debug(Portal1);
				if(Portal1.isInside(me.x,me.y)){	
					me.y = 307;
				}

				if(Portal2.isInside(me.x,me.y)){
					me.y = 546;
				}
			}
			else if (e.keyCode == '37') {
				me.leftKey = true;
				me.rightKey = false;
				me.vx = -3;
			}
			else if (e.keyCode == '39') {
				me.rightKey = true;
				me.leftKey = false;
				me.vx = 3;
			}
			else if (e.keyCode == '32' && !me.isFlying) {
				me.spaceKey = true;
				me.isFlying = true;
				me.vy = 2.5;
			}
		}

		document.onkeyup = function(e){
			e = window.event;

			if (e.keyCode == '38') {
				me.upKey = false;
			}
			else if (e.keyCode == '37') {
				me.leftKey = false;
			}
			else if (e.keyCode == '39') {
				me.rightKey = false;
			}
			else if (e.keyCode == '32') {
				me.spaceKey = false;
			}
		}
		
		me.step = function() {
			if(Math.abs(me.vx)>0){
				if(me.rightKey == false && me.leftKey == false){
					me.vx = me.vx - me.vx*0.1;
				}
				if(Math.abs(me.vx)<EPS){
					me.vx = 0;
				}
			}

			//gravity
			me.vy = me.vy - g*dt;

			//update wall information
			var leftWall = IMAGE_WIDTH/2;
			var rightWall = W - IMAGE_WIDTH/2;

			if(me.ground < Map.lvlTwoBtm){

				//765
				if(me.x<=Map.lvlOneStep1Left){
					rightWall = Map.lvlOneStep1Left;
				}
				//816
				else if(me.x<=Map.lvlOneStep2Left){
					rightWall = Map.lvlOneStep2Left;
				}
				//872
				else if(me.x<=Map.lvlOneStep3Left){
					rightWall = Map.lvlOneStep3Left;
				}
			}

			me.y = me.y + me.vy*dt;
			me.x = me.x + me.vx*dt;

			//check for left/right walls
			if (me.x < leftWall) {
				me.x = leftWall;
			}else if(me.x > W - IMAGE_WIDTH/2){
				me.x = W - IMAGE_WIDTH/2;
			}else if (me.x > rightWall-1) {
				if(me.isFlying){
					// Logger.debug("Flying");
				}else{
					// Logger.debug("Walking");
					me.x = rightWall-1;				
				}
			}

			//prevent drop below ground
			if (me.y < me.ground){
				me.y = me.ground;
				me.vy = 0;
				me.isFlying = false;
			}

			me.changeGround();

		}
		
		return me;
	}
};