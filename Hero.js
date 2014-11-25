
var BULLET_SPEED = 10;

HeroFactory = {
	createHero : function createHero(x,y){
		var IMAGE_WIDTH = 40;
		var IMAGE_HEIGHT = 40;
			
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
		me.firstKeyPressed = false;
		me.shootLimiter = 0;

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
				var bullet = BulletFactory.createBullet(me.x, me.y, me.vx);
				me.isShooting = true;
				document.getElementById("shootingSound").pause();
				document.getElementById("shootingSound").currentTime = 0;
				document.getElementById("shootingSound").play();
				me.shootLimiter = 15;
		}

		me.endshoot = function(){
			me.isShooting = false;
		}

		me.changeGround();
		
		document.onkeydown = function(e) {
			e = window.event;
			
			
			if (me.firstKeyPressed == false) {
				Frame.addFgndImg('');
				me.firstKeyPressed = true;
			}
			
			if (e.keyCode == '38') {
				me.upKey = true;
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


				document.getElementById("jumpSound").pause();
				document.getElementById("jumpSound").currentTime = 0;
				document.getElementById("jumpSound").play();
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
			
			if (me.shootLimiter >= 1) {
				me.shootLimiter = me.shootLimiter - 1;
			}
			
			if(me.isShooting && me.shootLimiter == 0){
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

BulletFactory = {
	createBullet : function(x, y, vx){
		var IMAGE_WIDTH = 20;
		var IMAGE_HEIGHT = 20;

		var me = new Sprite('images/fireball.png', x, y, IMAGE_WIDTH, IMAGE_HEIGHT , {centered: true,tracking: true});
		me.vx = vx==0?BULLET_SPEED:vx/Math.abs(vx)*BULLET_SPEED;
		me.isActive = true;
		me.w = IMAGE_WIDTH;
		me.h = IMAGE_HEIGHT;
		me.stepsTaken = 0;
		me.isCollide = function(victim){
			return victim.x-victim.w/2<this.x && this.x<victim.x+victim.w/2 && 
				victim.y-victim.h/2<this.y && this.y<victim.y+victim.h/2;
		};
		me.step = function(){
			//law of motion
			this.x = this.x + this.vx*dt;

			if(this.isCollide(Donkey)){
				Donkey.minusLife();
				me.hide();
				this.isActive = false;
			}

			if(this.isCollide(Minion1)&& Minion1.isActive){
				Minion1.hide();
				me.hide()
				this.isActive = false;
				Minion1.isActive = false;
				Donkey.stepMod = Donkey.stepMod - 40;
				Donkey.stepNumber = Donkey.stepNumber + 1;
			}
			
			if(this.isCollide(Minion2)&& Minion2.isActive){
				Minion2.hide();
				me.hide()
				this.isActive = false;
				Minion2.isActive = false;
				Donkey.stepMod = Donkey.stepMod - 40;
				Donkey.stepNumber = Donkey.stepNumber + 1;
			}
			
			me.stepsTaken = me.stepsTaken + 1;
			
			if(me.stepsTaken == 30) {
			me.vx = 0;
			me.hide();
			this.isActive = false;
			me.stepsTaken = 0;
			}
			
			if(me.x < 0 || me.x > 1000) {
			me.vx = 0;
			me.hide();
			this.isActive = false;
			}

		};
		simList.push(me);

		return me;
	},


};