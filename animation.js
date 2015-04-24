// Circle.protytype.destx= -1;
// circle.prototype.desty = -1;
// circle.prototype.setdestination = functrion(){
// 	this.destx = randomfromt0(0,canvas.width);
// 	this.desty = randomfromto(0, canvas.htight);
// }

// circle.prototype.animate = function(){
// 	if(this.destx ==-1 || this.testhit(this,destx, this.desty))
// 	 this.setdestination();
// 	this.destx > this.x?this.x++:this.x--;
// 	this.desty > this.y?this.y++;this.y--
// }

function stop(){
	runanimation= false;
}

var runanimation = false;

function startAnimation(){
	runanimation=true;
	startAnimationHelper();
}

function startAnimationHelper(){
	if(!runanimation)
		return;
	// for(var i=0;i<shapes;i++)
	// 	shape[i].animate();
	pad.draw();
	window.setTimeout(startAnimationHelper, 10);
}