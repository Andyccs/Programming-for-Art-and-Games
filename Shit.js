ShitFactory = {
	createShit : function createShit(x,y,vx,vy){
		var IMAGE_WIDTH = 55;
		var IMAGE_HEIGHT = 55;

		var me = new Sprite('images/fireballround.png', x, y, IMAGE_WIDTH, IMAGE_HEIGHT,{tracking:true});

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
			if (me.y<50 && me.vy<0){ 
				me.isActive = false;
				var hideAfterThat = setInterval(function () {
					me.hide();
					clearInterval(hideAfterThat);
				}, 300);
			}
		}

		return me;
	}
}	