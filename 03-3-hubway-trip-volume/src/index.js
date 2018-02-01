import * as d3 from 'd3';
import './style.css';

import parse from './parse';

console.log('Week 3 exercise 3');

const margin = { t:20, r:200, b:20, l:200 };
const w = d3.select('#timeline-multiple').node().clientWidth;
const h = d3.select('#timeline-multiple').node().clientHeight;
const width = w - margin.l - margin.r;
const height = h - margin.t - margin.b;

console.log(width, height);

const scaleY = d3.scaleLinear().range([height, 0]);

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	console.log(trips)

	d3.select('#timeline-multiple')
		.datum(trips)
		.each(draw);

});

function draw(data){

	//Data discovery: date range
	const tMin = d3.min(data, d => { return d.t0; });
	const tMax = d3.max(data, d => { return d.t0; });

	//Transform incoming data
	//Bin discrete trips into weekly buckets
	const histogram = d3.histogram()
		.value(d => { return d.t0; })
		.thresholds(d3.timeWeek.range(tMin,tMax));

	const tripsPerWeek = histogram(data).map( d => {
		  return {
		      t0: d.x0,
					t1: d.x1,
					tripVolume: d.length
			}
	}).filter(d => { return d.tripVolume != 0; })
	// .sort( (a,b) => { return b.t1 - a.t1; });

	console.log(tripsPerWeek);

	//More data discovery post-data transform: maximum and minimum weekly trip volume
	const tripVolumeExtent = d3.extent(tripsPerWeek, d => { return d.tripVolume; });

	// console.log(tripVolumeExtent);

	scaleY.domain(tripVolumeExtent);

	// Appending SVG element and <g.plot-area>, returns <g.plot-area> selection
	const plot = d3.select('#timeline-multiple').append('svg')
		.attr('width',w)
		.attr('height',h)
		.append('g')
		.attr('class', 'plot-area')
		.attr('transform',`translate(${margin.l},${margin.t})`);

	// UPDATE selection ---> data join
	const barNodes = plot.selectAll(".week-bin")
	  .data(tripsPerWeek)

	// ENTER selection ---> appending new DOM elements
	const barEnter = barNodes.enter()
		.append("g")
		.attr("class", "week-bin")
		.attr('transform', (d,i) => { return `translate(${i * 3},${50})`; });

  barEnter.append("rect")
	  .attr("x", 1)
		.attr("width", 2)
    .attr("height", d => { return (height - scaleY(d.tripVolume)); });

}
