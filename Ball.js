BallFactory = {
	createBall : function createBall(x, y, r, vx, vy){
		
		var me = new Sprite('images/shit.png', x, y, 2*r, 2*r);
		
		//initialize vx and vy
		me.vx = vx;
		me.vy = vy;
		
		me.step = function(){
			me.vy = me.vy - g*dt;
			me.x = me.x + me.vx*dt;
			me.y = me.y + me.vy*dt;

			if (me.y<2*r && me.vy<0){ 
				me.isActive = false;
			}

		}
		
		me.isActive = true; 
		
		return me;
	}
};