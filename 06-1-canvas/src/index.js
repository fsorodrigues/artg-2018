import * as d3 from 'd3';

/***
  Week 6: Basics of canvas API
	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
***/

//6.1 Create canvas element
//Remember to set width and height explicitly
const canvas = d3.select('.container')
  .append('canvas')
  // setting up pixel dimensions for canvas
  // .style/CSS width and height are independent from this dimensions
  .attr('height', 500)
  .attr('width', 1000)
  .node();

const ctx = canvas.getContext('2d');

//6.2 Customize fill, stroke, lineWidth
ctx.fillStyle = 'rgb(255,0,0)'
// ctx.strokeStyle = 'green'

//6.3 Draw
//Primitive shapes: rectangle
// ctx.fillRect(0,0,500,250)
// ctx.fillStyle = 'rgb(0,255,0)'
// ctx.strokeStyle = 'rgb(0,0,255)'
// ctx.strokeRect(100,100,500,250)

//Primitive shapes: text
// ctx.fillText('Hello world', 500, 250)

//Path : line
ctx.strokeStyle = 'rgba(0,0,0,.3)'
ctx.beginPath();
ctx.moveTo(0,250);
ctx.lineTo(1000,250);
ctx.closePath();
// ctx.fill();
ctx.stroke();

// grid at 50px
// draw horizontal grid lines
ctx.beginPath();
for (let y = 0; y <= 500; y += 50) {
  ctx.moveTo(0,y);
  ctx.lineTo(1000,y);
}
// draw vertical grid lines
for (let x = 0; x <= 1000; x += 50) {
  ctx.moveTo(x,0);
  ctx.lineTo(x,500);
}
ctx.closePath();
ctx.stroke();


// arcs and circles are drawn as arcs. arcs are just incomplete circles.
//Path : arc
ctx.strokeStyle = 'rgb(0,0,255)'
ctx.beginPath();
ctx.arc(500,250,100,0,Math.PI/2,true); // expects angles in radians | optional argument can draw counter clockwise
// ctx.closePath();
// ctx.fill();

//Path : circle
ctx.moveTo(900,250)
// ctx.beginPath();
ctx.arc(800,250,100,0,Math.PI*2)
ctx.closePath();
ctx.stroke();

//Path : curves
ctx.beginPath();
ctx.moveTo(0,0);
ctx.bezierCurveTo(0, 500, 1000, 500, 1000, 0);
// ctx.closePath();
ctx.stroke();

ctx.beginPath();
ctx.moveTo(0,500);
ctx.quadraticCurveTo(500, 0, 1000, 500);
// ctx.closePath();
ctx.stroke();

//Canvas transform


//6.4 Drawing multiple path with Path2D
const path1 = new Path2D();
const path2 = new Path2D();
const path3 = d3.path();

for(let i = 0; i < 100; i++) {
  const x = Math.random()*1000;
  const y = Math.random()*500;
  path1.moveTo(x+5,y);
  path1.arc(x,y,5,0,Math.PI*2);
  path2.moveTo(x+5,y);
  path2.arc(x,y,5,0,Math.PI*2);

  path3.moveTo(x+5,y)
  path3.arc(x,y,5,0,Math.PI*2);
};

ctx.fillStyle = 'rgb(0,0,255)'
ctx.strokeStyle = 'rgb(0,0,0)'
ctx.fill(path1);
ctx.stroke(path2);

//6.5 <canvas> to <svg> using d3.path
d3.select('.container')
  .append('svg')
  .attr('height', 500)
  .attr('width', 1000)
  .append('path')
  .attr('d', path3.toString());

//6.6 Basic canvas animations
const canvas2 = d3.select('.container')
  .append('canvas')
  // setting up pixel dimensions for canvas
  // .style/CSS width and height are independent from this dimensions
  .attr('height', 500)
  .attr('width', 1000)
  .node();

const ctx2 = canvas2.getContext('2d');

// let x = 0;
// let y = 0;
// const speed = .05;

function makePoint(w,h) {
  return {
    x: Math.random()*w,
    y: Math.random()*h,
    speedX: (Math.random() - 0.5) * 10, // speed will range -0.5 to 0.5, going left and right equally
    speedY: (Math.random() - 0.5) * 5, // speed will range -0.5 to 0.5, going up and down equally
    update: function() {
      this.x = this.x + this.speedX;
      if (this.x > w || this.x < 0) {
        this.speedX = -1 * this.speedX;
      }
      this.y = this.y + this.speedY;
      if (this.y > h || this.y < 0) {
        this.speedY = -1 * this.speedY;
      }
    }
  }
}

const point = makePoint(1000,500);
const points = []

for (let i = 0; i < 5000; i++) {
  points.push(makePoint(1000,500))
}

function redraw() {
  // refresh the canvas
  ctx2.clearRect(0,0,1000,500);
  ctx2.fillStyle = 'rgb(0,0,0)'
  // draw a fresh frame
  ctx2.beginPath();
  points.forEach(function(point) {
    ctx2.moveTo(point.x, point.y);
    ctx2.arc(point.x,point.y,2,0,Math.PI*2);
    point.update();
  })
  ctx2.closePath();
  ctx2.fill();

  requestAnimationFrame(redraw);
}

redraw();
