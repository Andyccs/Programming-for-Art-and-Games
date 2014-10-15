MapChecker = {

	isBetween : function isBetween(bottom,top,value){
		return value>=bottom && value<=top;
	}
};

MapFactory = {
	
	createMap: function createMap(){
		
		var me = {};
		
		//level 1 parameters
		me.lvlOneBtm = 79;
		me.lvlOneTop = 235;
		
		me.lvlOneStep1Left = W - 235;	//x position of first step
		me.lvlOneStep1Btm = 108;		//y position of first step if object on top of step one
		me.lvlOneStep2Left = W - 184;
		me.lvlOneStep2Btm = 139;
		me.lvlOneStep3Left = W - 128;
		me.lvlOneStep3Btm = 170;

		//level 2 parameters
		me.lvlTwoBtm = 306;
		me.lvlTwoTop = 475;

		me.lvlTwoHoleLeft = 102;
		me.lvlTwoHoleRight = 158;

		//level 3 parameter
		me.lvlThreeBtm = 545;
		me.lvlThreeTop = window.innerHeight;
		
		me.isActive =  true;
		me.colliderList = [];

		me.colliderHandler = function colliderHandler(){
			for (var i=0; i< me.colliderList.length; i++) {
				var collider = me.colliderList[i];
				if(collider.level==undefined){
					//in first level
					if (MapChecker.isBetween(me.lvlOneBtm, me.lvlOneTop, collider.y)) {
						collider.level = 1;
					}
					//in second level
					else if(MapChecker.isBetween(me.lvlTwoBtm, me.lvlTwoTop, collider.y)){
						collider.level = 2;
					}
					//in third level
					else if(MapChecker.isBetween(me.lvlThreeBtm, me.lvlThreeTop, collider.y)){
						collider.level = 3;
					}
					Logger.debug("Shit at y:"+collider.y+", level :"+collider.level);
				}

				//collision on level 1
				if(collider.level == 1){
					if(
						(collider.x > me.lvlOneStep3Left && collider.y <= me.lvlOneStep3Btm) ||
						(collider.x > me.lvlOneStep2Left && collider.y <= me.lvlOneStep2Btm) ||
						(collider.x > me.lvlOneStep1Left && collider.y <= me.lvlOneStep1Btm) ||
						(collider.y <= me.lvlOneBtm)
						){
						collider.vx = 0;
						collider.vy = 0;
						collider.isActive = false;
					}
				}
				//collision on level 2
				else if(collider.level == 2 && collider.y <= me.lvlTwoBtm){

					//check whether it is at hole position
					if(MapChecker.isBetween(me.lvlTwoHoleLeft,me.lvlTwoHoleRight, collider.x)){
						collider.level = 1;

					}else{
						collider.vx = 0;
						collider.vy = 0;
						collider.isActive = false;
					}
				}
				//collision on level 3
				else if(collider.level == 3 && collider.y <= me.lvlThreeBtm){
					collider.vx = 0;
					collider.vy = 0;
					collider.isActive = false;
				}

				if(collider.x<=0){
					collider.x = 0;
					collider.vx = 0;
					collider.isActive = true;
				}
				else if (collider.x > W){
					collider.x = W;
					collider.vx = 0;
					collider.isActive = true;
				}

			}
		}
		return me;
	}

};
