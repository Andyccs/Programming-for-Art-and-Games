ShitFactory = {
	createShit : function createShit(x,y,vx,vy){
		var IMAGE_WIDTH = 50;
		var IMAGE_HEIGHT = 50;

		Logger.debug("Initializing Shit");
		var me = new Sprite('images/shit.jpg', x, y, IMAGE_WIDTH, IMAGE_HEIGHT,{tracking:true});

		me.isActive = true;
		me.stepNumber = 1;
		me.vx = vx;	
		me.vy = vy;	

		me.step = function step(){
			me.vy = me.vy - g*dt;
			me.y = me.y + me.vy*dt;
			
			//particle falls to the ground	
			//note: the test for me.vy<0 is necessary to allow a
			//particle to be on ground and fly up	
			if (me.y<IMAGE_HEIGHT && me.vy<0){ 
				me.isActive = false;
				var hideAfterThat = setInterval(function () {
					me.hide();
					clearInterval(hideAfterThat);
				}, 2000);
			}
		}

		return me;
	}
}	