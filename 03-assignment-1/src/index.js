import * as d3 from 'd3';
import './style.css';

import parse from './parse';

console.log('Week 3 assignment 1: writing a reusable activity histogram');

//Set up DOM scaffolding
const width = d3.select('#activity-histogram').node().clientWidth;
const height = d3.select('#activity-histogram').node().clientHeight;
const margin = { t: 20, r: 100, b: 20, l: 100};
const w = width - margin.l - margin.r;
const h = height - margin.t - margin.b;

const plot = d3.select('#activity-histogram')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('class', 'acitivity-histogram-inner')
	.attr('transform', `translate(${margin.l}, ${margin.t})`);

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips) {

	// Bind selection to the entire array of trips, one to one
	plot.datum(trips) //note: .datum(), not .data()
	  .each(activityHistogram);

});

function activityHistogram(data) {

	//Transform data
	//Group trips into discrete 15 minute bins, using the d3.histogram layout
	const histogram = d3.histogram()
		.value(d => d.time_of_day0)
		.thresholds(d3.range(0,24,.25));

	const tripsByQuarterHour = histogram(data)
		.map(d => {
			return {
				x0: d.x0, //left bound of the bin; 18.25 => 18:15
				x1: d.x1,
				volume: d.length
			}
		});

	console.log(tripsByQuarterHour);

	//Set up scales in the x and y direction
	const scaleX = d3.scaleLinear().domain([0,24]).range([0,w]);
	const maxVolume = d3.max(tripsByQuarterHour, d => d.volume);
	const scaleY = d3.scaleLinear().domain([0,maxVolume]).range([h,0]).nice();

	//Set up axis generator
	const axisY = d3.axisLeft()
		.scale(scaleY)
		.tickSize(-w);

	const axisX = d3.axisBottom()
		.scale(scaleX)
		.tickFormat(d => {
			const time = +d;
			const hour = Math.floor(time);
			let min = Math.round((time-hour)*60);
			min = String(min).length === 1? "0"+ min : min;
			return `${hour}:${min}`
		});

	//Draw
	/*** YOUR CODE HERE ***/

	const rootElement = this; // <g.activity-histogram-inner>

	// UPDATE selection ---> data join
	const barNodes = d3.select(rootElement)
		.selectAll(".bin") //  selection of 0 elements
		.data(tripsByQuarterHour) // array of 96 bins
		// enter set = 96
		// exit set = 0

	// ENTER selection ---> appending new DOM elements
	const barEnter = barNodes.enter()
		.append("g")
		.attr("class", "bin")
		.attr('transform', (d,i) => `translate(${scaleX(d.x0)},${0})`);

	const barEnterRect = barEnter.append("rect")
		.attr("y", h)
		.attr("width", (w/tripsByQuarterHour.length - 2))
		.attr("height", 0)
		.attr("fill", "rgba(80,80,80,1)");

	// ENTER + UPDATE
	barEnterRect.merge(barNodes)
		.transition()
		.duration(1000)
		.attr("fill", "rgba(80,80,80,.4)")
		.attr("y", d => scaleY(d.volume) )
		.attr("height", d => h - scaleY(d.volume))

  // EXIT
	barNodes.exit().remove();


	/*** YOUR CODE HERE ***/

	//Axis
	const axisXNode = d3.select(this)
		.selectAll('.axis-x')
		.data([1]);

	const axisXNodeEnter = axisXNode.enter()
		.append('g')
		.attr('class','axis-x');

	axisXNode.merge(axisXNodeEnter)
		.attr('transform',`translate(0,${h})`)
		.call(axisX);

	const axisYNode = d3.select(this)
		.selectAll('.axis-y')
		.data([1]);

	const axisYNodeEnter = axisYNode.enter()
		.append('g')
		.attr('class','axis-y');

	axisYNode.merge(axisYNodeEnter)
		.call(axisY);

	axisYNodeEnter.select('.domain').style('display','none');

	axisYNodeEnter.selectAll('line')
		.style('stroke','rgb(80,80,80)')
		.style('stroke-dasharray','2px 2px');

}
