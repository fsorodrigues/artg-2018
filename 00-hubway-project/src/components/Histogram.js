import * as d3 from 'd3';
import '../style/histogram.css';

function Histogram(_) { // factory function

	let _thresholds;
	let _domain;
	let _value = () => {};
	let _tickX = 6;
	let _tickY = 5;
	let _tickXFormat = d => d
	let _maxVolume = 2000;

	function exports(d,i) {

		const root = this;

		const width = root.clientWidth;
		const height = root.clientHeight;
		const margin = {t:20,r:20,b:20,l:30};
		const w = width - margin.l - margin.r;
		const h = height - margin.t - margin.b;

		const svg = d3.select(root)
			.classed('histogram', true)
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
			.value(_value)
			.thresholds(_thresholds)
			.domain(_domain);

		const tripsByQuarterHour = histogram(d)
			.map(d => {
				return {
					x0: d.x0, // left bound of the bin; 18.25 => 18:15
					x1: d.x1,
					volume: d.length
				}
			});

		//Set up scales in the x and y direction
		const scaleX = d3.scaleLinear().domain(_domain).range([0,w]);
		const maxVolume = d3.max(tripsByQuarterHour, d => d.volume);
		// const scaleY = d3.scaleLinear().domain([0,maxVolume]).range([h,0]);
		const scaleY = d3.scaleLinear().domain([0, Math.max(_maxVolume, maxVolume)]).range([h,0])

		//Set up axis generator
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-w)
			.ticks(_tickY);

		const axisX = d3.axisBottom()
			.scale(scaleX)
			.ticks(_tickX)
			.tickFormat(_tickXFormat);

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
			.style('fill','rgba(0,0,0,.1)');

		//Exit
		binsUpdate.exit().remove();

		//Axis
		const axisXNode = plot
			.selectAll('.axis-x')
			.data([1]);

		const axisXNodeEnter = axisXNode.enter()
			.append('g')
			.attr('class','axis axis-x');

		axisXNode.merge(axisXNodeEnter)
			.attr('transform',`translate(0,${h})`)
			.call(axisX);

		const axisYNode = plot
			.selectAll('.axis-y')
			.data([1]);

		const axisYNodeEnter = axisYNode.enter()
			.append('g')
			.attr('class','axis axis-y');

		axisYNode.merge(axisYNodeEnter)
			.call(axisY);

	}

	// getter/setter
	exports.thresholds = function(_) {
		// _ is an array
		if (typeof _ === "undefined") return _thresholds
		_thresholds = _;
		return this
	}

	exports.domain = function(_) {
		// _ is an array
		if (typeof _ === "undefined") return _domain
		_domain = _;
		return this
	}

	exports.value = function(fn) {
		// fn is a function
		if (typeof fn === "undefined") return _value
		_value = fn;
		return this
	}

	exports.tickX = function(_) {
		// _ is an integer
		if (typeof _ === "undefined") return _tickX
		_tickX = _;
		return this
	}

	exports.tickXFormat = function(fn) {
		// fn is a function
		if (typeof fn === "undefined") return _tickXFormat
		_tickXFormat = fn;
		return this
	}

	exports.tickY = function(_) {
		// _ is an integer
		if (typeof _ === "undefined") return _tickY
		_tickY = _;
		return this
	}

	exports.maxVolume = function(_) {
		// _ is a number
		if (typeof _ === "undefined") return _maxVolume
		_maxVolume = _;
		return this
	}

	return exports;
}

export default Histogram;
