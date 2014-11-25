DonkeyFactory = {
	createDonkey : function createDonkey(){
		var IMAGE_WIDTH = 100;
		var IMAGE_HEIGHT = 70;
		var me = new Sprite('images/boss.png', 100, Map.lvlThreeBtm+IMAGE_HEIGHT/4, IMAGE_WIDTH, IMAGE_HEIGHT,{centered:true});

		me.lifebarRed = new Rect(50,H-50,W-100,10,{color:'red'});
		me.lifebarGreen = new Rect(50,H-50,W-100,10,{color:'green'});
		me.isActive = true;
		me.stepNumber = 1;
		me.stepMod = 120;

		me.life = 100;

		me.minusLife  = function(){
			me.life -= 1;
			if(me.life<0){
				me.life = 0;
			}
			me.lifebarGreen.w = (W-100)/100 * me.life;
		};

		me.step = function step(){
			
			if(me.x>W-IMAGE_WIDTH || me.x<IMAGE_WIDTH){
				//reverse the direction here
				me.stepNumber = -me.stepNumber;
			}
			
			if(me.x%me.stepMod==0){
				//create shit here
				shit = ShitFactory.createShit(me.x,me.y,1,1);
				simList.push(shit);
				collider.push(shit);

				document.getElementById("shittingSound").pause();
				document.getElementById("shittingSound").currentTime = 0;
				document.getElementById("shittingSound").play();
			}

			//start moving
			me.x = me.x + me.stepNumber;

			if(me.life<=0){
				me.isActive = false;
				Hero.isActive = false;
				GameOver = new Rect(W/2, H/2, 200, 200,
					{	centered:true,
						color:"transparent", 
						fontSize:100});
				GameOver.text = "You Win";

				document.getElementById("victoryMusic").play();
			}
		};

		return me;
	}
};