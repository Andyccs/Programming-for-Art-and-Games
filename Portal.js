PortalFactory = {
	createPortal : function createPortal(x,y){
		var IMAGE_WIDTH = 40;
		var IMAGE_HEIGHT = 40;

		var me = new Sprite('images/portal.png', x, y, IMAGE_WIDTH, IMAGE_HEIGHT , {centered: true});
		me.x = x;
		me.y = y;

		me.isInside = function isInside(x,y){
			return me.x-IMAGE_WIDTH<x && x<me.x+IMAGE_WIDTH && y<me.y+IMAGE_HEIGHT && y>me.y-IMAGE_HEIGHT;
		}
		return me;
	}
	
}