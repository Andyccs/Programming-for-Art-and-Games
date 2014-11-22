MinionFactory = {
	spawnRandomMinion : function(){
		var IMAGE_WIDTH = 30;
		var IMAGE_HEIGHT = 30;

		var randomInt = randInt(2);
		var randomX = 0;
		var randomY = randomInt==0?78.9:305.9;
		randomX = randInt(300)+300;

		var me = new Sprite('images/minion.png', randomX, randomY, IMAGE_WIDTH, IMAGE_HEIGHT , {centered: true});
		me.vx = 3;
		me.h = IMAGE_HEIGHT;
		me.w = IMAGE_WIDTH;
		me.isActive = true;
		me.step = function(){
			this.x = this.x + this.vx*dt;

			if(this.x<randomX-100){
				this.x = randomX-100;
				this.vx = -this.vx;
			}
			else if(this.x>randomX+100){
				this.x = randomX+100;
				this.vx = -this.vx;
			}
		};
		collider.push(me);

		return me;
	}
}