
/********************************************************
Canvas only library

6.0		style object
6.1		opacity		
6.2		dragging with mousedown

Problem: border extends shape, isInside should adjust
********************************************************/
//alert('Sprites6.2')



//*******************global variables********************
var Frame = (function(){
	//global namespace
	
	var canvasElemList = createObjList();

	
	//the frame object
	var frm = {
		//properties
		left: 0,
		top: 0,
		w: 500,
		h: 300,
		col: '#ccc',
		
		bdy: null, 		//dom body element
		canvas: null,	//dom canvas element
		ctx: null,		//2d context
		
		bkgndImg: null,
		fgndImg: null,
		
		//methods
		init: init,		//initialize the frame
		draw: draw,		//clear canvas and draw all objects
		addBkgndImg: addBkgndImg,
		addFgndImg: addFgndImg,
		purge: purge,	//remove all objects from canvas
		
		//layer management
		toBack: canvasElemList.toBack,
		toFront: canvasElemList.toFront,
		up: canvasElemList.up,
		down: canvasElemList.down,
		
		
		
		//internal only use
		draggedObj: null,	
		proto: new ProtoSprite(),
		
		discard: discard,
		register: register,
		showCanvas: showCanvas,//debugging aid
		//handleClick: handleClick,
		handleMouseMove: handleMouseMove,
		handleMouseDown: handleMouseDown,
	}
	
	
	var canvas;
	var ctx;
	
	var fgObj = {
		id: 'fgnd',
		visible: true,
		isInside: function(){return false;},
		draw: function(){
			ctx.drawImage(frm.fgndImg, frm.left, frm.top, frm.w, frm.h);
		}, //draw
	}
	
	var bgObj = {
		id: 'bkgnd',
		visible: true,
		isInside: function(){return false;},
		draw: function(){
			if (frm.bkgndImg){
				ctx.drawImage(frm.bkgndImg, frm.left, frm.top, frm.w, frm.h);
			} else if (frm.col!='none'){
				ctx.save();
				ctx.fillStyle = frm.col;
				ctx.fillRect(frm.left, frm.top, frm.w, frm.h);
				ctx.restore();
			}
		},//draw
	}
	
	//add bgElement
	canvasElemList.push(bgObj);
	
	
	function createObjList(){
		//me[0]: bgObj, optional fgObj. Objects can be moved up/down
		
		var me = [];
		var top = 1; //index of fgnd obj
		var bot = 1; //lowest obj index before bkgnd
		
		me.addFgnd = function(obj){
			me.top = me.length;   
			me.push(obj);
		}//addFgnd
		
		me.put = function(obj){
			me.splice(top++, 0, obj);
		}//put
		
		me.remove = function(obj){
			var k = me.indexOf(obj);
			if (k>=0){
				me.splice(k, 1);
				if (k<top) top--;
			}
		}//remove
		
		me.up = function(obj){ //alert('canvasElemList up')
			var k = me.indexOf(obj);
			if (k==me.length-1) return;
			me[k] = me[k+1];
			me[k+1] = obj;
			if (k==top-1) top--;
		}//up
		
		me.down = function(obj){
			var k = me.indexOf(obj);
			if (k==bot) return;
			me[k] = me[k-1];
			me[k-1] = obj;
			if (k==top+1) top--;
		}//up
		
		me.toBack = function(obj){
			var k = me.indexOf(obj);
			if (k==bot) return;
			me.splice(k, 1);
			me.splice(bot, 0, obj);
			if (k>top) top++;
		}//toBack
		
		me.toFront = function(obj){ //alert('ObjList.toFront')
			var k = me.indexOf(obj);
			if (k==me.length-1) return;
			me.splice(k, 1);
			me.splice(me.length, 0, obj);
			if (k<top) top--;
		}//toFront
		
		return me;
	}//createObjList

		
	
	/*function clickCanvas(x, y){ //alert('clickCanvas')  
		for (var i=canvasElemList.length-1; i>=0; i-=1){ 
			var obj = canvasElemList[i];
			if (obj.isInside(x, y) && obj.visible) { 
				if (obj.handleClick) {
					obj.handleClick(x, y); 
				}
			}
		}
	}//clickCanvas
	
	
	function handleClick(e){ //alert('frm.handleClick')
		//handler, assigned to document.onclick in method enableClicking
		if (frm.draggedObj){
			frm.draggedObj.stopDragging();
			frm.draggedObj = null;
		} else {
			var x = e.pageX - frm.X0;
			var y = frm.Y0 - e.pageY;
			clickCanvas(x, y);
		}
	}//handleClick*/
	
	
	


	var Xoffset, Yoffset;
	
	
	function handleMouseMove(e){//alert('move') 
		//mousemove handler assigned to document.onmousemove in method enableDragging
		
		var obj = frm.draggedObj;
		var xMouse = e.pageX - frm.X0;
		var yMouse = frm.Y0 - e.pageY;
		//var dx = obj.mouseOffsetX + xMouse - obj.x;
		//var dy = obj.mouseOffsetY + yMouse - obj.y;
		var dx = Xoffset + xMouse - obj.x;
		var dy = Yoffset + yMouse - obj.y;
		obj.displace(dx, dy);
		if (obj.handleDrag) obj.handleDrag(xMouse, yMouse);
		draw(); //draw frame
	}//handleMouseMove
	
		
	function handleMouseDown(e){//alert('down')
		var x = e.pageX - frm.X0;
		var y = frm.Y0 - e.pageY;
		for (var i=canvasElemList.length-1; i>=0; i-=1){ 
			var obj = canvasElemList[i];
			if (obj.isInside(x, y) && obj.visible) { 
				if (obj.isDragable) { //alert('dragable')
					//obj.startDragging(obj.handleDrag, x, y);
					Frame.draggedObj = obj;
					Xoffset = obj.x - x;
					Yoffset = obj.y - y;
					document.onmousemove = handleMouseMove;
					
				} else if (obj.isClickable) { //alert('clickable')
					if (obj.handleClick) obj.handleClick(x, y); 
				}
			}
		}
	}//handleMouseDown
	
	
	
	document.onmouseup = function(){  //alert('mouseup')
		Frame.draggedObj = null;
		document.onmousemove = null;
	}//onmouseup
	
	




	function init(left, top, w, h, col){
	// initialize the frame
	//
	// left: left margin
	// top:  top margin
	// w, h: widht, height
	// col [optional]: fill color, default is '#ccc'
	//
	// note: the origin is in the lower-left corner of the frame
	//       x-coordinate points to the right
	//       y-coordinate points upwards
	
		if (col) frm.col = col;
		else frm.col = '#ccc';
		
		frm.left = left;
		frm.top = top;
		frm.X0 = left; 	//frame origin in window coordinates
		frm.Y0 = top + h;	//frame origin in window coordinates
		frm.w = w;
		frm.h = h;
		
		//frm.bdy = document.getElementsByTagName('body')[0];
		frm.bdy = document.body;
		if (!frm.bdy) {alert('Frame.init called before body created'); return;}
		
		frm.bdy.style.marginTop = 0;
		frm.bdy.style.marginLeft = 0;
		
			
		canvas = document.createElement('canvas');
		frm.canvas = canvas;
		
		canvas.visible = true;
		canvas.typ = 'canvas';
		
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.style.left = 0;
		canvas.style.zIndex = 0;
		
		frm.bdy.appendChild(canvas);
	
		ctx = canvas.getContext('2d');  
		frm.ctx = ctx;
		
	}//init
	
	
	function draw(){ 
	// clear the canvas and draw all objects at their current position
	//
	// note: figures are visible only after a call to draw
	
		ctx.clearRect(0, 0,  canvas.width, canvas.height);
		//ctx.save();
		
		for (var i=0; i<canvasElemList.length; i++) { //alert('frm.draw i='+i)
			var o = canvasElemList[i]
			if (o.visible) {
				ctx.save();
				ctx.globalAlpha = o.opacity;
				o.draw();
				ctx.restore();
			}
		}
		
		//ctx.restore();
	}//draw
	

	function addBkgndImg(url){
	// adds a background image to the frame. This image is
	// in a layer below all the figures
	
		frm.bkgndImg = new Image();
		frm.bkgndImg.src = url;
		if (!frm.bkgndImg.complete) frm.bkgndImg.onload = function(){Frame.draw();}
	}//addBkgndImg
	
	
	function addFgndImg(url){ 
	// adds a foreground image. The layer of this image is
	// on top of all the figure layers. 
	// note: a forground image should be partially transparent
	
	
		frm.fgndImg = new Image();
		frm.fgndImg.src = url;
		if (!frm.fgndImg.complete) frm.fgndImg.onload = function(){Frame.draw();}
		
		canvasElemList.addFgnd(fgObj);
	}//addFgndImg
	
		
	function purge(){ 
	// completely deletes all images, except the background image
	
		canvasElemList = [canvasElemList[0]]; //keep bgObject
		if (ctx) ctx.clearRect(0, 0,  canvas.width, canvas.height);
	}//purge
	
	
	//auxiliary function for debugging
	function showCanvas(){ //alert('showCanvas')
		var txt = '';
		for (var i=0; i<canvasElemList.length; i++){
			txt+=canvasElemList[i].id+'  ';
		}
		alert(txt);
	}//showCanvas
	

	function discard(obj){ //alert('discard id='+obj.id)
		canvasElemList.remove(obj);
		//<-------------------------------  frm.draw()??????
	}//discard
	
	
	function register(obj){
		canvasElemList.put(obj);
	}//register
	
	
	
	
	return frm;
})(); //create the unique frame object





window.onresize = function(){ //alert('onresize')
	Frame.canvas.width = window.innerWidth;
	Frame.canvas.height = window.innerHeight;
	Frame.draw();
}//onresize





//*******************************************************

function addOtherProperties(me){ 
	//add common properties to a sprite objects
	me.vx = 0;
	me.vy = 0;
	me.alpha = 0;  //turn angle rad from North
	me.style = {};			//the style object
	me.visible = true;
	me.opacity = 1.0;	//opacity of object
	
	//private, don't touch in user program
	me.bearing;				//for Sprite
	me.isClickable = false;
	me.handleClick = null;	//click handler
	me.isDragable = false;
	me.handleDrag = null;	//drag handler
	//me.mouseOffsetX = 0; 	//for dragging  //<----- move out
	//me.mouseOffsetY = 0;	//for dragging
}//addOtherProperties



function ProtoSprite(){ 
	//prototype of all Sprite objects, common methods 
	
	this.draw = function(){} //draw method (abstract)
	
	this.hide = function(){ this.visible = false;}
	this.show = function(){ this.visible = true; }
		
	this.isInside = function(x, y){} //abstract
	
	this.move = function(dt){
		//a time step in the simulation, displacement by v*dt
		this.displace(this.vx*dt, this.vy*dt);
	}//move
		
	
	this.displace = function(dx, dy){
		//shift object on the plane by dx,dy
		this.x += dx; 
		this.y += dy;
	}//displace

	
	this.moveTo = function(x, y){
		//shift to an absolute position
		this.x = x;
		this.y = y;
	}//moveTo
	
	
	this.rotate = function(alpha){
		//turns the object alpha radians clock-wise
		//initial angle to the north
		this.alpha += alpha;
	}//rotate
	
	
	this.setOpacity = function(opacity){
		//sets the opacity
		//opacity: number between 0 and 1
		opacity = Math.min(opacity, 1);
		opacity = Math.max(opacity, 0);
		this.opacity = opacity;
	}//setOpacity

	
	this.enableClicking = function(handleClick){ //alert('Proto.enableClicking, id='+this.id)
		this.isClickable = true;
		this.handleClick = handleClick;
		//if (handleClick) document.onclick = Frame.handleClick;
		document.onmousedown = Frame.handleMouseDown;
	}//enableClicking
	
	
	this.enableDragging = function(handleDrag){ //alert('enableDragging handleDrag='+handleDrag);
		this.isDragable = true;
		this.handleDrag = handleDrag;
		document.onmousedown = Frame.handleMouseDown;
	}//enableDragging


	/*this.startDragging = function(handleDrag, x, y){//alert('startDragging x='+x+' y='+y); 
		//x, y mouse coordinates at time of first click 
		Frame.draggedObj = this; 
		this.mouseOffsetX = this.x - x; //mouse offset rel to obj handle
		this.mouseOffsetY = this.y - y;
		//this.handleDrag = handleDrag;
		document.onmousemove = Frame.handleMouseMove;
	}//startDragging
	
	
	this.stopDragging = function(){ //alert('stopDragging')
		Frame.draggedObj = null;
		document.onmousemove = null;
	}//stopDragging
	
	
	this.enableDragging = function(handleDrag){ //alert('enableDragging handleDrag='+handleDrag);
		//when clicked, object attaches to mouse, when clicked again detaches
		//overwrites other click handler, if any
		this.handleDrag = handleDrag;
		this.enableClicking( 		
			function(x, y){//alert('click to start dragging x='+x+' y='+y);
				this.startDragging(this.handleDrag, x, y);
			}//clickToStartDragging
		);
	}//enableDragging*/
	
	
	
	
	
	this.toBack = function(){ Frame.toBack(this); }
	this.toFront = function(){ Frame.toFront(this); }
	this.up = function(){ Frame.up(this); }
	this.down = function(){ Frame.down(this); }
	this.discard = function(){ Frame.discard(this); }
	
}//ProtoSprite





//*******************************************************
// Rectangle
//*******************************************************
Rect.prototype = Frame.proto;

function Rect(x, y, w, h, style){   
// draws a rectangle with an optional text
//
// x, y: position
// w, h: widht, height
// style: [optional argument] object with properties:
//		centered [Boolean]
//			true:  x, y refers to the center point
//			false: x, y refers to lower-left corner [default]
//		color [default 'black']
//		borderWidth [default 1]
//		borderColor [default 'black']
//		borderRadius [default 0]
//		font [default Arial]
//		fontColor [i.e. font color, default 'black']
//		fontSize [default 18]
//		baseLineOffset [default 0]
//
// note: any style properties can be chosen. Undefined<br>
// style properties take their default values 
	
	
	//properties
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.text = '';
	
	
	//add and initialize common properties
	addOtherProperties(this);
	
	
		
	//set default styles
	if (!style) style = {};
	
	//style.centered = style.centered || false; //default false
	style.fontSize = style.fontSize || 18;	
	style.font = style.font || 'Arial';
	style.fontColor = style.fontColor || 'black';
	style.baseLineOffset = style.baseLineOffset || 0; //base line offset
	style.borderWidth = style.borderWidth || 0;
	style.borderColor = style.borderColor ||'black';
	style.color = style.color || 'black';
	style.borderRadius = style.borderRadius || 0;	
	
	this.style = style;
	
	
	this.write = function(txt, dy){
		if (dy) this.style.baseLineOffset = dy;
		this.text = txt;
	}//write
		
	
	this.setBorder = null;
	
	
	this.changeStyle = function(stl){
		for (var p in stl) {
			this.style[p] = stl[p];
		}
	}//changeStyle
	
	
	this.draw = function(){ //alert('Rect.draw borderColor='+this.style.borderColor)
		//Note: the translated origin MUST be the pivot
		if (!Frame.ctx){ alert('err: Sprite method called without frame'); return};
		
		var a90 = Math.PI/2, a180 = Math.PI, a270 = 3*Math.PI/2;
		
		//offset from handle 
		if (this.style.centered){
			var dx = this.w/2; 
			var dy = this.h/2;
		} else {
			dx = 0; dy = 0;
		}
		
		var r = this.style.borderRadius;

			
		//Frame.ctx.save();
		Frame.ctx.globalAlpha = this.opacity;
		
		Frame.ctx.translate(Frame.X0 + this.x, Frame.Y0 - this.y);
		if (this.alpha) Frame.ctx.rotate(this.alpha);
		
		if (r!=0){
			//make path of rounde rect
			Frame.ctx.beginPath();
			Frame.ctx.arc(r-dx, -r+dy, r, a90, a180); 
			Frame.ctx.arc(r-dx, -h+r+dy, r,  a180, a270);
			Frame.ctx.arc(w-r-dx, -h+r+dy, r, a270, 0);
			Frame.ctx.arc(w-r-dx, -r+dy, r, 0, a90);
			Frame.ctx.closePath();
		}
		
		//fill rect
		if (this.style.color!='none'){ 
			Frame.ctx.fillStyle = this.style.color;
			if (r==0) Frame.ctx.fillRect(-dx, dy, this.w, -this.h);
			else Frame.ctx.fill(); 
			
		}
		//draw a border
		if (this.style.borderWidth){ //alert('border '+this.style.borderColor)
			Frame.ctx.strokeStyle = this.style.borderColor;
			Frame.ctx.lineWidth = this.style.borderWidth;
			if (r==0) Frame.ctx.strokeRect(-dx, dy, this.w, -this.h); 
			else Frame.ctx.stroke();
		}
				
		//write text
		if (this.text) {
			Frame.ctx.fillStyle = this.style.fontColor;
			Frame.ctx.font = this.style.fontSize+'px '+this.style.font; 
			//var txtm = Frame.ctx.measureText('kaka bussi');
			Frame.ctx.textAlign = 'center';
			Frame.ctx.fillText(	this.text, 
								-dx + this.w/2, 
								dy-this.h/2+this.style.fontSize/2-this.style.baseLineOffset
								);
		}	

		//Frame.ctx.restore();
	}//draw
	

	this.isInside = function(x0, y0){ //alert('Rect.isInside x0='+x0+' y0='+y0+' alpha='+this.alpha)
		//rotate to vertical
		var P0 = rot([x0, y0], this.alpha); //the rotated test pt
		var P = rot([this.x, this.y], this.alpha); //the rotated handle
			
		var x0_ = P0[0], y0_ = P0[1];
		var x_ = P[0],   y_ = P[1];
		if (this.style.centered) {
			x_ = x_ - this.w/2;
			y_ = y_ - this.h/2;
		}

		return (x0_ > x_) && (x0_ < x_+this.w) && (y0_ > y_) && (y0_ < y_+this.h) ;				
	}//isInside
	
		
	Frame.register(this);
}//Rect






//*******************************************************
// Disk
//*******************************************************
Disk.prototype = Frame.proto;

function Disk(x, y, r, style){ 

// draw a disk figure
// x, y: position (coordinates of center)
// r: radius
// style: [optional argument] object with properties:
//		color [default 'black']
//		borderWidth [default 0]
//		borderColor [default 'black']
//
// note: any style properties can be chosen. Undefined<br>
// style properties take their default values 
	
	//properties
	this.x = x;
	this.y = y;
	this.r = r;

	//add and initialize common properties
	addOtherProperties(this);
	
	//default styles
	if (!style) style = {};
	
	style.borderWidth = style.borderWidth || 0;
	style.borderColor = style.borderColor || 'black';	
	style.color = style.color	|| 'black';
	
	this.style = style;
		
	
	this.changeStyle = function(stl){
		for (var p in stl) {
			this.style[p] = stl[p];
		}
	}//changeStyle
	
	
	this.draw = function(){
		 
		//alert('Disk.draw id='+this.id+' x='+this.x+' y='+this.y+' r='+this.r+' col='+this.style.color+' border='+this.style.border);
		
		if (!Frame.ctx){ alert('err: Disk method called without frame'); return};
		
		//Frame.ctx.save();
		Frame.ctx.beginPath();
		Frame.ctx.arc(Frame.X0 + this.x, Frame.Y0 - this.y, this.r, 0, 2*Math.PI); 
		Frame.ctx.closePath();
		
		if (this.style.borderWidth){ 
			Frame.ctx.strokeStyle = this.style.borderColor;
			Frame.ctx.lineWidth = this.style.borderWidth;
			Frame.ctx.stroke(); 
		}
		
		if (this.style.color!='none') {
			Frame.ctx.fillStyle = this.style.color;
			Frame.ctx.fill();  
		}
		
		//Frame.ctx.restore();		
	}//draw
	
	
	this.isInside = function(x, y){
		var dx = x - this.x;
		var dy = y - this.y;
		return dx*dx+dy*dy <= this.r*this.r
	}//isInside
	
	Frame.register(this);
}//Disk



//*******************************************************
// Sprite
//*******************************************************

Sprite.prototype = Frame.proto;
//add common methods

function Sprite(url, x, y, w, h, style){ //alert('Sprite');
// displays a picture, typically used in an animation
//
// url: picture source
// x, y: coordinates of mid-point (note: always centered)
// w, h: widht, height
// style: [optional argument] object with properties:
//		centered [Boolean]: meaning of x and y
//			true:  x, y refers to the center point [default]
//			false: x, y refers to lower-left corner
//		tracking [Boolean]: 
//			true:  sprite turns into direction of velocity
//			false: sprite has fixed orientation [default]
//		borderWidth [default 0]
//		borderColor [default 'black']
//
// note1: any style properties can be chosen. Undefined<br>
//        style properties take their default values 
//
// note2: animated gif's are not animated

	//properties
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
		
	//add and initialize common properties
	addOtherProperties(this);
	
	//default styles
	if (!style) style = {};
	
	style.borderWidth = style.borderWidth || 0;
	style.borderColor = style.borderColor || 'black';
	if (typeof style.centered!='boolean') style.centered = true;
	style.tracking = style.tracking || false;
	
	this.style = style;
	
	
	this.bearing = 0;	//angle from North 
	
	this.img = new Image();
	this.img.parent = this;
	this.img.src = url;
	if (!this.img.complete) this.img.onload = function(){ //alert('Sprite img load')
		if (Frame.bdy) Frame.draw();
	}
	
	
	this.changeStyle = function(stl){
		for (var p in stl) {
			this.style[p] = stl[p];
		}
	}//changeStyle
	
		
	this.draw = function(){ //alert('Sprite.draw id='+this.id)
		if (!Frame.ctx){ alert('err: Sprite method called without frame'); return};
		
		//offset from handle 
		if (this.style.centered){
			var dx = this.w/2; 
			var dy = this.h/2;
		} else {
			dx = 0; dy = this.h;
		}
		
		
		
		//bearing from north cw
		if (this.style.tracking) this.bearing = this.alpha + bearingRad(this.vx, this.vy);
				
		//Frame.ctx.save();
		
		Frame.ctx.translate(Frame.X0 + this.x, Frame.Y0 - this.y);
		if (this.bearing) Frame.ctx.rotate(this.bearing);
		
		Frame.ctx.drawImage(this.img, -dx, -dy, this.w, this.h);
		
		if (this.style.borderWidth){ 
			Frame.ctx.strokeStyle = this.style.borderColor;
			Frame.ctx.lineWidth = this.style.borderWidth;
			Frame.ctx.strokeRect(-dx, -dy, w, h);  
		}

		//Frame.ctx.restore();
	}//draw
	
	
	this.startTracking = function(){ 
		this.style.tracking = true; 
	}//startTracking
	
	
	this.stopTracking = function(){ 
		this.style.tracking = false; 
	}//stopTracking
	
	
	this.rotate = function(alpha){ //alert('rotate')
		this.alpha += alpha;
		if (!this.style.tracking) this.bearing = this.alpha;
	}//rotate
	
	
	this.changeSrc = function(newSrc){ //alert('Sprite.changeSrc')
		this.img.src = newSrc;
	}//changeSrc
	
	
	this.changeImg = function(newImg){
		//newImg is a JS Image object
		this.img = newImg;
		if (!newImg.complete) newImg.onload = function(){ //alert('Sprite img load')
			if (Frame.bdy) Frame.draw();
		}
	}//changeImg
	
	
	this.isInside = function(x0, y0){ //alert('Rect.isInside x0='+x0+' y0='+y0+' alpha='+this.alpha)
		//rotate to vertical
		var P0 = rot([x0, y0], this.bearing); //the rotated test pt
		var P = rot([this.x, this.y], this.bearing); //the rotated handle
		
		var x0_ = P0[0], y0_ = P0[1];
		var x_ = P[0],   y_ = P[1];
		if (this.style.centered) {
			x_ = x_ - this.w/2;
			y_ = y_ - this.h/2;
		}
		
		return (x0_ > x_) && (x0_ < x_+this.w) && (y0_ > y_) && (y0_ < y_+this.h);				
	}//isInside

		
	Frame.register(this);		
}//Sprite



//*******************************************************
// Line
//*******************************************************
Line.prototype = Frame.proto;

function Line(x1, y1, x2, y2, style){ 
// draws a line
//
// x1, y1: start point of line
// x2, y2: end point of line
// style: [optional argument] object with properties:
//		color [default 'black']
//		lineCap [default 'butt']
//		width [default 1]
//
// note1: any style properties can be chosen. Undefined<br>
//        style properties take their default values 

//
// note2: line is centered around ideal line
// note3: when lineCap='round', click insensitive in semi-circles at ends

	//properties
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	
	//common properties
	addOtherProperties(this);
	
	//default styles
	if (!style) style = {};
	
	style.color = style.color || 'black';
	style.width = style.width || 1;
	style.lineCap = style.lineCap || 'butt';
	
	this.style = style;
	
	
	this.changeStyle = function(stl){
		for (var p in stl) {
			this.style[p] = stl[p];
		}
	}//changeStyle
	
	
	this.draw = function(){ 
		if (!Frame.ctx){ alert('err: Rect method called without frame'); return};
		
		//Frame.ctx.save();

		Frame.ctx.strokeStyle = this.style.color;
		Frame.ctx.lineWidth = this.style.width;
		Frame.ctx.lineCap = this.style.lineCap;
		Frame.ctx.beginPath();
		Frame.ctx.moveTo(Frame.X0 + this.x1, Frame.Y0 - this.y1);
		Frame.ctx.lineTo(Frame.X0 + this.x2, Frame.Y0 - this.y2);
		Frame.ctx.stroke();
		Frame.ctx.closePath();
		
		//Frame.ctx.restore();
	}//draw
	
	
	this.dist = function(x, y){
		//note: dist>0, x,y is on right side of line
		//      dist<0, x,y is on left side of line
		
		var w = this.x2 - this.x1;
		var h = this.y2 - this.y1;
		
		var d = Math.sqrt(w*w + h*h);
		return (h*x - w*y + this.y1*w - this.x1*h)/d;
	}//dist
	
	
	this.rotate = function(alpha){
		//rotate around x1, y1
		
		var w = this.x2 - this.x1;
		var h = this.y2 - this.y1;

		var P = rot([w, h], -alpha);
		
		this.x2 = this.x1 + P[0];
		this.y2 = this.y1 + P[1];
	}//rotate
	
	
	this.changeTo = function(x, y){
		var dx = x - this.x1;
		var dy = y - this.y1;
		this.x1 = this.x1 + dx;
		this.y1 = this.y1 + dy;
		this.x2 = this.x2 + dx;
		this.y2 = this.y2 + dy;
	}//changeTo
	
	
	this.displace = function(dx, dy){
		this.x1 = this.x1 + dx;
		this.y1 = this.y1 + dy;
		this.x2 = this.x2 + dx;
		this.y2 = this.y2 + dy;
	}//displace
	
	
	this.isInside = function (x, y){ //alert('Line.isInside x='+x+' y='+y)
		//note: correct for 'butt' but not for 'round' and 'square'
		var dx = this.x2 - this.x1;
		var dy = this.y2 - this.y1;
		var d = Math.sqrt(dx*dx + dy*dy);
		
		//sine and cosine
		var si = dy/d; 
		var co = dx/d; 
		
		//turn to horizontal
		var x1_ =  this.x1*co  + this.y1*si;
		var y1_ = -this.x1*si  + this.y1*co;
		
		var x2_ =  (this.x2)*co  + (this.y2)*si;
				
		var x_ =  x*co  + y*si;
		var y_ = -x*si  + y*co;
		
		return (Math.abs(y_ - y1_) < this.style.width/2) && (x_ > x1_)  && (x_ < x2_); 
	}//isInside
	
	Frame.register(this);
}//Line


//*****************END Sprites***************************








//******************auxiliary functions******************
//random integers
function randInt(n){
	//random integer between 0 ... n-1
	return Math.floor(Math.random()*n);
}//randInt

function randBetween(a, b){
	return a + Math.random()*(b-a);
}//randBetween


function shuffle(p){//random shuffle of array p
	var rand, temp, n;
	for (var n=p.length-1; n>0; n--){
		rand = Math.floor(Math.random()*(n+1));
		temp = p[n]; p[n] = p[rand]; p[rand] = temp;
	}//for
}//shuffle

function bearingRad(vx, vy){
	//angle of vector vx, vy to north
	//0 = 2pi = north, angle measured clockwise
	if(vx==0 && vy==0) return 0;
	var a = Math.asin(vy/Math.sqrt(vx*vx + vy*vy));
	if (vx>=0) return (Math.PI/2) - a;
	else return (3*Math.PI/2) + a;	
}//bearingRad

//get mouse coordinates from event
function getMouseX(e){
	return e.pageX - Frame.X0;
}//getMouseX

function getMouseY(e){
	return Frame.Y0 - e.pageY;
}//getMouseY

function rot(xVect, alpha){
	//rotate vector anti-clockwise
	var x = xVect[0], y = xVect[1];
	var si = Math.sin(alpha);
	var co = Math.cos(alpha);
	var x$ = co*x - si*y;
	var y$ = si*x + co*y;
	return [x$, y$];
}//rot


