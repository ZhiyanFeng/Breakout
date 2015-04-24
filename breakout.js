$(function(){

var runanimation = false;
var bricks = [];
var color = ["red","green","yellow","brown","blue"];
var brickWidth=100;
var brickHeight =15;
var canvas = $("#bocanvas");
var ctx = canvas[0].getContext('2d');
var cols = (canvas[0].width)/brickWidth;
var rows =5;


addBricks(bricks);
//the following is the object
function Shape(canvas){
	if(canvas){
		this.ctx = canvas[0].getContext("2d");
		this.maxx = canvas[0].width;
		this.maxy = canvas[0].height;
	}
}



//-----------brick inherit from shape-------
function Brick(x,y,row){
	Shape.call(this, canvas);
	this.x=x;
	this.y=y;
	this.row = row;
	this.w = brickWidth;
	this.h = brickHeight;
	this.hit = false;
	this.draw = function(){
		if(this.hit == false){
			  this.ctx.beginPath();
		      this.ctx.rect(this.x, this.y, this.w, this.h);
		      this.ctx.fillStyle = color[row];
		      this.ctx.fill();
		      this.ctx.closePath;
			}
	}
}

function addBricks(array){
	for (i=0; i < rows; i++) {
		bricks[i] = [];
		for (j=0; j < cols; j++) {
		  bricks[i][j] = new Brick(j*brickWidth, i*brickHeight+i, i);
		}
	}
}

function drawBricks(){
	$.each(bricks,function(index,value){
		// console.log(value);
		$.each(value,function(index, brick){
			// console.log(brick);
				brick.draw();
		});
	});
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
		if((this.y) == paddle.y){
			this.dy = -this.dy;
		}
	}else if(this.y>paddle.y){
		runanimation = false;
	}
}

Ball.prototype.brickCollision = function(bricks){
	
	for(var i=0,rows=bricks.length;i<rows;i++){
	
		for(var j=0, cols=bricks[i].length;j<cols;j++){
			if(this.x>=bricks[i][j].x & this.x<=bricks[i][j].x+bricks[i][j].w){
				if((this.y+this.radius + this.dy ==bricks[i][j].y & this.y<bricks[i][j].y)|| 
					(this.y-this.radius <bricks[i][j].y+bricks[i][j].h) & (this.y>bricks[i][j].y+bricks[i][j].h)){
					this.dy = -this.dy;
					bricks[i].splice(j,1);
					return;
				}

			}
			
			if(this.y>=bricks[i][j].y & this.y <= bricks[i][j].y + bricks[i][j].h){
				if(this.x +this.radius == bricks[i][j].x || this.x - this.radius== bricks[i][j].x + bricks[i][j].w){
					this.dx = -this.dx;
					bricks[i].splice(j,1);
					return;

				}
			}
			if(Math.pow(bricks[i][j].x,2)+Math.pow(bricks[i][j].y, 2)==Math.pow(this.radius,2)
				|| Math.pow(bricks[i][j].x+bricks[i][j].w-this.x,2)+Math.pow(bricks[i][j].y-this.y, 2)==Math.pow(this.radius,2)
				|| Math.pow(bricks[i][j].x-this.x,2)+Math.pow(bricks[i][j].y+bricks[i][j].h-this.y, 2)==Math.pow(this.radius,2)
				|| Math.pow(bricks[i][j].x + bricks[i][j].w-this.x,2)+Math.pow(bricks[i][j].y+bricks[i][j].h-this.y, 2)==Math.pow(this.radius,2)
				)
			{
				this.dy = -this.dy;
				this.dx = -this.dx;
				bricks[i].splice(j,1);
				return;
			}

	};
		};
	
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
		this.ctx.clearRect(0,0, 1000, 1000);
		(this.ctx).fillStyle = "red";
		(this.ctx).fillRect(this.x,this.y,this.w,10);
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
	drawBricks();
	ball.paddleBounce(pad);
	ball.BoarderBounce();
	ball.brickCollision(bricks);
	setTimeout(startAnimationHelper, 10);
}

});


