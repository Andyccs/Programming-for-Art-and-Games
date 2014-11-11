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
		me.isShooting = false;		
		me.bullet;
		me.w = IMAGE_WIDTH;
		me.h = IMAGE_HEIGHT;

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

		me.shoot = function(){
			if(me.bullet==null){
				me.bullet = new Rect(me.x,me.y,Math.abs(me.x-Donkey.x),10,{color:'red'});
			}else{
				me.bullet.w = Math.abs(me.x-Donkey.x);
				me.bullet.x = me.x<Donkey.x?me.x:Donkey.x;
				me.bullet.y = me.y;
			}
			me.bullet.setOpacity(1);
			me.isShooting = true;

			if(me.y>=Map.lvlThreeBtm){
				Donkey.minusLife();
			}
		}

		me.endshoot = function(){
			if(me.bullet!=null){
				me.bullet.setOpacity(me.bullet.opacity-0.01);
				if(me.bullet.opacity<=0){
					me.bullet = null;
				}
			}
			me.isShooting = false;
		}

		me.changeGround();
		
		document.onkeydown = function(e) {
			e = window.event;
			
			if (e.keyCode == '38') {
				me.upKey = true;
				Logger.debug(Portal1);
				if(Portal1.isInside(me.x,me.y)){	
					me.y = 307;
					me.level = 2;
				}

				if(Portal2.isInside(me.x,me.y)){
					me.y = 546;
					me.level = 3;
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
				me.vy = 5;
			}
			else if(e.keyCode == '90'){
				me.isShooting = true;
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
			else if(e.keyCode == '90'){
				me.isShooting = false;;
			}
		}
		
		me.step = function() {
			if(me.isDied){
				return;
			}
			if(me.isShooting){
				me.shoot();
			}else{
				me.endshoot();
			}
			if(Math.abs(me.vx)>0){
				if(me.rightKey == false && me.leftKey == false){
					me.vx = me.vx - me.vx*0.1;
				}
				if(Math.abs(me.vx)<EPS){
					me.vx = 0;
				}
			}

			if(me.vy==0){
				me.isFlying = false;
			}

			//gravity
			me.vy = me.vy - g*dt;

			me.y = me.y + me.vy*dt;
			me.x = me.x + me.vx*dt;

		}
		
		return me;
	}
};