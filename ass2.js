$(function(){

var runanimation = false;
//the following is the object
function Shape(canvas){
	if(canvas){
		this.ctx = canvas[0].getContext("2d");
		this.maxx = canvas[0].width;
		this.maxy = canvas[0].height;
	}
}



//-----------brick inherit from shape-------
function Brick(canvas){
	Shape.call(this, canvas);
}

//-----------ball inherit from shape--------
function Ball(canvas){
	Shape.call(this, canvas);
	this.x = this.maxx*0.5;
	this.y = this.maxy*0.5;
	this.dx = 4;
	this.dy = 2;
	this.radius = 10;
	this.paddleX;
	this.paddleY;
	this.draw = function(){
		 //draw a circle
		this.ctx.beginPath();
		this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true); 
		this.ctx.closePath();
		this.ctx.fillStyle = "#2F4F4F";
		this.ctx.fill();

	}
}
Ball.prototype.BoarderBounce = function(){
	//algorithm for the moving
	if (this.x + this.dx > this.maxx || this.x + this.dx < 0)
	    this.dx = -this.dx;
	if (this.y + this.dy < 0)
	    this.dy = -this.dy;
	this.x += this.dx;
	this.y += this.dy;
}

Ball.prototype.paddleBounce = function(paddle){
	if(this.x>=paddle.x-this.radius & this.x<=paddle.x+paddle.w + this.radius){
		if((this.y+10) == paddle.y +10){
			this.dy = -this.dy;
		}
	}else if(this.y>paddle.y){
		runanimation = false;
	}
}



//-----------paddle inherit from shape-------
function Paddle(canvas){
	var self = this;
	var maxLeft = $("canvas").offset().left;
	
	Shape.call(this,canvas);
	this.w = 100;
	this.h = 10;
	this.x = (this.maxx)*0.5 - this.w;
	this.y = this.maxy - this.h;
	var maxRight = maxLeft + this.maxx - this.w;
	
	this.draw = function(){
		self.ctx.clearRect(0,0, 1000, 1000);
		(self.ctx).fillStyle = "red";
		(self.ctx).fillRect(self.x,self.y,this.w,10);
	}

	this.modify = function(e){
		if(e.pageX >= maxLeft & e.pageX <= maxRight)
			self.x = e.pageX - maxLeft;
	}
};

var canvas = $("#bocanvas");
//draw a paddle
var pad = new Paddle(canvas);
var ball = new Ball(canvas);

//get a reference to the bocanvas
// window.addEventListener("mousemove", show,false);


$(document).mousemove(pad.modify);
startAnimation();

// animation function----------------------------------------
function stop(){
	runanimation= false;
}



function startAnimation(){
	if(runanimation==false){
		runanimation=true;
		startAnimationHelper();
	}
}

function startAnimationHelper(){
	if(!runanimation)
		return;
	// for(var i=0;i<shapes;i++)
	// 	shape[i].animate();

	pad.draw();
	ball.draw();
	ball.paddleBounce(pad);
	ball.BoarderBounce();
	console.log(ball.x);
	console.log("paddle left" + pad.x)
	setTimeout(startAnimationHelper, 10);
}

});


