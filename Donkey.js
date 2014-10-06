DonkeyFactory = {
	createDonkey : function createDonkey(){
		var IMAGE_WIDTH = 100;
		var IMAGE_HEIGHT = 100;

		Logger.debug("Initializing Donkey");
		var me = new Sprite('images/dk.jpg', 100, H-100, IMAGE_WIDTH, IMAGE_HEIGHT,{centered:true});

		me.isActive = true;
		me.stepNumber = 1;
		me.step = function step(){
			if(me.x>W-IMAGE_WIDTH || me.x<IMAGE_WIDTH){
				//reverse the direction here
				me.stepNumber = -me.stepNumber;
			}

			if(me.x%100==0){
				//create shit here
				shit = ShitFactory.createShit(me.x,me.y,1,1);
				simList.push(shit);
			}

			//start moving
			me.x = me.x + me.stepNumber;
		}

		return me;
	}
}	