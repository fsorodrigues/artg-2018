import * as d3 from 'd3';

function Histogram(_){ // factory / container --> produces the module and takes care of config not in the exported function

let maxVolume = _ || 300;
let margin = { t:15, r:25, b:25, l:25};
let ticksY = 5;
let defaultColor = "rgb(50,50,50)";

	function exports(data,i){ //exports == activityHistogram

		// What is data?
		// data --> { key, values }
		// one for each of the objects in the nested dataset from index.js.

		// console.log(data);
		// console.log(i);
		// console.log(this);

		//Need to append a the proper DOM scaffolding
		const width = this.clientWidth; //What is "this"? "this" refers the <div> element appended in index.js that contains <svg>.
		const height = this.clientHeight;
		// const margin = {t:15,r:25,b:25,l:25};
		const w = width - margin.l - margin.r;
		const h = height - margin.t - margin.b;

		const svg = d3.select(this)
			.selectAll('svg')
			.data([1]); //What's going on here?
		const svgEnter = svg.enter().append('svg')
			.attr('width',width)
			.attr('height',height);
		svgEnter.append('g').attr('class','plot')

		const plot = svg.merge(svgEnter)
			.select('.plot')
			.attr('transform',`translate(${margin.l},${margin.t})`);

		//Transform data
		//Group trips into discrete 15 minute bins, using the d3.histogram layout
		const histogram = d3.histogram()
			.value(d => d.time_of_day0)
			.thresholds(d3.range(0,24,.25));

		const tripsByQuarterHour = histogram(data.values)
			.map(d => {
				return {
					x0:d.x0, //left bound of the bin; 18.25 => 18:15
					x1:d.x1,
					volume:d.length
				}
			});

		//Set up scales in the x and y direction
		const scaleX = d3.scaleLinear().domain([0,24]).range([0,w]);
		// const maxVolume = d3.max(tripsByQuarterHour, d => d.volume);
		const scaleY = d3.scaleLinear().domain([0,maxVolume]).range([h,0]);

		//Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-w)
			.ticks(ticksY);

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
		//Bars
		//Update
		const binsUpdate = plot
			.selectAll('.bin')
			.data(tripsByQuarterHour);

		//Enter
		const binsEnter = binsUpdate.enter()
			.append('rect')
			.attr('class','bin') //If you forget this, what will happen if we re-run this the activityHistogram function?
			// Not including class .bin would interfere with the update of the data. It has no effect on the initial drawing, however.
			.attr('x', d => scaleX(d.x0))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0)))
			.attr('y', d => h)
			.attr('height', 0);

		//Enter + update
		binsEnter.merge(binsUpdate)
			.transition()
			.duration(500)
			.attr('x', d => scaleX(d.x0))
			.attr('width', d => (scaleX(d.x1) - scaleX(d.x0)))
			.attr('y', d => scaleY(d.volume))
			.attr('height', d => (h - scaleY(d.volume)))
			.style('fill', defaultColor);

		//Exit
		binsUpdate.exit().remove();

		//Axis
		const axisXNode = plot
			.selectAll('.axis-x')
			.data([1]);

		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis-x');

		axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${h})`)
			.call(axisX);

		const axisYNode = plot
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

	//  Setter and Getter functions
	exports.width = function(_){
		return this
	}

	exports.height = function(_){
		return this
	}

	exports.margin = function(_){
		margin = _;
		return this
	}

	exports.value = function(fn){
		return this
	}

	exports.domain = function(_){
		return this
	}

	exports.maxVolume = function(_){
		maxVolume = _;
		return this
	}

	exports.ticksY = function(_){
		ticksY = _;
		return this
	}

	exports.defaultColor = function(_){
		defaultColor = _; // assuming _ is CSS color string
		return this
	}

	return exports;

}

export default Histogram;
