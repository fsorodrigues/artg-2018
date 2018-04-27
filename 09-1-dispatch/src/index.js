import {select,selectAll,path,event,mouse,dispatch} from 'd3';
import './style.css';

const div = select('.container')
	.append('div')
	.classed('module',true);
const w = div.node().clientWidth;
const h = div.node().clientHeight;
const plot = div.append('svg')
	.attr('width',w)
	.attr('height',h);

//Draw shapes
const circle = plot.append('g')
	.attr('transform',`translate(${w/4},${h/2})`)
	.append('circle')
	.classed('elem', true)
	.attr('r',w/16);

const square = plot.append('g')
	.attr('transform',`translate(${w/4*2},${h/2})`)
	.append('rect')
	.classed('elem', true)
	.attr('x',-w/16)
	.attr('y',-w/16)
	.attr('width',w/8)
	.attr('height',w/8);

const triangle = plot.append('g')
	.attr('transform',`translate(${w/4*3},${h/2})`)
	.append('path')
	.classed('elem', true);

const pathData = path(); // d3.path
pathData.moveTo(0,-w/16);
pathData.lineTo(w/16,w/16);
pathData.lineTo(-w/16,w/16);
pathData.lineTo(0,-w/16);
triangle.attr('d',pathData.toString());

// //Basic d3 event API
// //selection.on(eventType, callback)
// circle.on('click',function(d,i){ // can't use arrow notation because 'this' context conundrum
// 	console.log(d);
// 	console.log(this);
// 	console.log(event); // d3.event
// 	console.log(mouse(this)); // d3.mouse, expects element as argument
// });
//
// square.on('mouseenter',function(d){
// 		console.log(this);
// 	})
// 	.on('mouseleave', d => {
// 		console.log(this);
// 	});

// //On mouseenter
// //Turn circle red
// circle.on('mouseenter', function(){
// 	selectAll('.elem').transition().style('fill', 'red'); // d3.selectAll
// 	})
// 	.on('mouseleave', function(){
// 	selectAll('.elem').transition().style('fill', 'black'); // d3.selectAll
// });
//
// //Turn square green
// square.on('mouseenter.foo', function(){ // add namespace to 'work around' mouseenter overwritting
// 	selectAll('.elem').transition().style('fill', 'green'); // d3.selectAll
// 	})
// 	.on('mouseleave', function(){
// 	selectAll('.elem').transition().style('fill', 'black'); // d3.selectAll
// });
//
// //Turn triangle blue
// triangle.on('mouseenter', function(){
// 	selectAll('.elem').transition().style('fill', 'blue'); // d3.selectAll
// 	})
// 	.on('mouseleave', function(){
// 	selectAll('.elem').transition().style('fill', 'black'); // d3.selectAll
// });

// define dispatch object from dispatch module
const dispatcher = dispatch('element:changeColor');

//How do we make these three elements interact among themselves?
circle
	// broadcast to the dispatch that mouseenter occurred
	.on('mouseenter', function(){
		dispatcher.call('element:changeColor',this,'red'); })
	// broadcast to the dispatch that mouseleave occurred
	.on('mouseleave', function(){
		dispatcher.call('element:changeColor',this,'black'); });

square
	// broadcast to the dispatch that mouseenter occurred
	.on('mouseenter', function(){
		dispatcher.call('element:changeColor',this,'green'); })
	// broadcast to the dispatch that mouseleave occurred
	.on('mouseleave', function(){
		dispatcher.call('element:changeColor',this,'black'); });

triangle
	// broadcast to the dispatch that mouseenter occurred
	.on('mouseenter', function(){
		dispatcher.call('element:changeColor',this,'blue'); })
	// broadcast to the dispatch that mouseleave occurred
	.on('mouseleave', function(){
		dispatcher.call('element:changeColor',this,'black'); });

// dispatch broadcast event back out to all the subscribers
dispatcher
	.on('element:changeColor', function(arg) {
		console.log(select(this).attr('class'));
		selectAll('.elem').transition().style('fill', arg);
});
