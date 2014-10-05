Initializer = {
	init : function init(){
		Logger.debug("Initializing Sprite Library");

		var left = (window.innerWidth-W)/2;
		var top = (window.innerHeight-H)/2;
		Frame.init(left,top,W,H);
	}
}