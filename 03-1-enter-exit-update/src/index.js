import * as d3 from 'd3';
import './style.css';

//Observe the import syntax
import {parse} from './utils';

console.log('Week 3');

//Set up
const margin = { t:20, r:200, b:20, l:200 };
const w = d3.select('#plot').node().clientWidth;
const h = d3.select('#plot').node().clientHeight;
const width = w - margin.l - margin.r;
const height = h - margin.t - margin.b;

const plot = d3.select('#plot').append('svg')
	.attr('width',w)
	.attr('height',h)
	.append('g')
	.attr('class', 'plot-area')
	.attr('transform',`translate(${margin.l},${margin.t})`);

//Scales
const scaleRadius = d3.scaleSqrt().domain([0,100]).range([0,150]);

//Import and parse data
d3.csv('./data/olympic_medal_count.csv', parse, function(err,data){

	console.log(data);

	//Buttons
	d3.select('.container').append('button').html('1900').on('click',function(){
		const medalsCount1900 = data.map( d => { // arrow function is the same as function(d)
			return {
				country:d.country,
				count:d.count_1900
			}
		});

		redraw(medalsCount1900);
	});

	d3.select('.container').append('button').html('1960').on('click',function(){
		const medalsCount1960 = data.map( d => { // arrow function is the same as function(d)
			return {
				country:d.country,
				count:d.count_1960
			}
		});

		redraw(medalsCount1960);
	});

	d3.select('.container').append('button').html('2012').on('click',function(){
		const medalsCount2012 = data.map( d => { // arrow function is the same as function(d)
			return {
				country:d.country,
				count:d.count_2012
			}
		});

		redraw(medalsCount2012);
	});

});

function redraw(count){

	const top5 = count.sort( (a,b) => { return b.count - a.count; }).slice(0,5)

	console.log(top5);

	// UPDATE selection ---> data join
	const countryNodes = plot.selectAll(".country") // empty selection
	    .data(top5, d => { return d.country; }); // data join, returns UPDATE selection (size = 0)

	// ENTER selection ---> appending new DOM elements
	const countryNodesEnter = countryNodes.enter() // returns ENTER selection (size = 5)
	    .append("g")
			.attr('class', d => { return 'country ' + d.country.split(' ').join('-'); })
			.attr('transform', (d,i) => { return `translate(${i * width/4},${height/2})`; });

	countryNodesEnter.append("circle")
			.attr("fill", "pink")
			.attr("opacity", .7)
	    .attr("r", 0)
			.transition()
			.duration(500)
			.attr("r", d => { return scaleRadius(d.count); });

	countryNodesEnter.append("text")
			.attr("text-anchor", "middle")
			.html(d => { return d.country; });

	// UPDATE selection ---> updating elements attributes
	// updating <g.country>
	countryNodes.transition().duration(1000)
	    .attr('transform', (d,i) => { return `translate(${i * width/4},${height/2})`; });

	countryNodes.select("circle")
	    .transition().duration(1000)
	    .attr("r", d => { return scaleRadius(d.count); });

	countryNodes.select("text")
	    .html(d => { return d.country; });

  // EXIT selection ---> removing unnecessary DOM elements
	countryNodes.exit().remove()

  /***
	// merging the selection allows you to not declare the attributes on enter and update selections
	// circles end up having initial position at origin
	const merged = countryNodes.merge(countryNodesEnter)
	    .transition()
			.duration(1000)
			.attr('transform', (d,i) => { return `translate(${i * width/4},${height/2})`; });
	***/

}
