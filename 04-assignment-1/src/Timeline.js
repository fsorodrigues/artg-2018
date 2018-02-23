import * as d3 from 'd3';

function Timeline(_){
	const margin = {t:20, r:30, b:20, l: 50};
	let _timeInterval;
	let _timeRange;
	let _maxVolume;
	let _thresholds;

	function exports(data,i){
		let width = this.clientWidth;
		let height = this.clientHeight;
		const w = width - (margin.r +  margin.l);
		const h = height - (margin.t +  margin.b);

		//Data transformation
		//Bin the trips by week
		const timeInterval = _timeInterval; // expects d3.timeWeek/Year/Month
		const timeRange = _timeRange; // expects array with 2 Date Objects [new Date(2012,0,1), new Date(2012,11,31)]
		const thresholds = _thresholds; // expects array of time intervals timeInterval.range(timeRange[0], timeRange[1], 1)

		const histogram = d3.histogram()
			.value(d => d.t0)
			.thresholds(thresholds)
			.domain(timeRange);

		const tripsByInterval = histogram(data.values)
			.map(d => {
				return {
					week:d.x0,
					volume:d.length
				}
			});

		//Mine the data and set up scales
		const scaleX = d3.scaleTime().domain(timeRange).range([0,w]);
		const maxVolume = _maxVolume;// d3.max(tripsByInterval, d => d.volume);
		const scaleY = d3.scaleLinear().domain([0, _maxVolume]).range([h,0]);

		// setting up axes
		const axisY = d3.axisLeft()
			.scale(scaleY)
			.tickSize(-w);

		const axisX = d3.axisBottom()
			.scale(scaleX)
			.tickFormat(d => {
				let formatMonth = d3.timeFormat("%b");
				let getMonth = formatMonth(d);
				return `${getMonth}`
			});

		//Shape generator
		const areaGenerator = d3.area()
			.x(d => scaleX(d.week))
			.y0(h)
			.y1(d => scaleY(d.volume));

		//Build DOM
		//First, build <svg> scaffolding
		const svg = d3.select(this)
			.selectAll('svg')
			.data([1]);

		const svgEnter = svg.enter().append('svg')
			.attr('width', width)
			.attr('height', height)

		svgEnter.append('g')
			.attr('class', 'area');

		const plot = svg.merge(svgEnter)
			.select('g')
			.attr('transform',`translate(${margin.l},${margin.t})`);


		const areaNode = plot
			.selectAll('.area')
			.data([tripsByInterval]);

		const areaNodeEnter = areaNode.enter()
			.append('path')
			.attr('class','area');

		areaNodeEnter.merge(areaNode)
			.attr('d',areaGenerator)
			.attr("fill-opacity", .5);

		// Appending axes
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

	exports.timeRange = function(startYear, endYear){
		_timeRange = [new Date(startYear,0,1), new Date(endYear,11,31)]; // expects integers
		return this
	}

	exports.timeInterval = function(_){
		_timeInterval = _; // expects integers d3 time function
		return this
	}

	exports.maxVolume = function(_){
		_maxVolume = _; // expects integer
		return this
	}

	exports.thresholds = function(_){
		_thresholds = _; // expects array of time intervals
		return this
	}

	return exports;

}

export default Timeline;

// function _timeline(data){
//
// 	const width = this.clientWidth;
// 	const height = this.clientHeight;
// 	const margin = {t:15,r:20,b:15,l:20};
// 	const w = width - margin.l - margin.r;
// 	const h = height - margin.t - margin.b;
//
// 	//Data transformation
// 	//Bin the trips by week
// 	const timeInterval = d3.timeWeek;
// 	const timeRange = [new Date(2012,0,1), new Date(2012,11,31)];
// 	const thresholds = timeInterval.range(timeRange[0], timeRange[1], 1);
//
// 	const histogram = d3.histogram()
// 		.value(d => d.t0)
// 		.thresholds(thresholds)
// 		.domain(timeRange);
//
// 	const tripsByInterval = histogram(data.values)
// 		.map(d => {
// 			return {
// 				week:d.x0,
// 				volume:d.length
// 			}
// 		});
//
// 	//Mine the data and set up scales
// 	const scaleX = d3.scaleTime().domain(timeRange).range([0,w]);
// 	const maxVolume = d3.max(tripsByInterval, d => d.volume);
// 	const scaleY = d3.scaleLinear().domain([0, maxVolume]).range([h,0]);
//
// 	const axisY = d3.axisLeft()
// 		.scale(scaleY);
//
// 	const axisX = d3.axisBottom()
// 		.scale(scaleX);
//
// 	//Shape generator
// 	const areaGenerator = d3.area()
// 		.x(d => scaleX(d.week))
// 		.y0(h)
// 		.y1(d => scaleY(d.volume));
//
// 	//Build DOM
// 	//First, build <svg> scaffolding
// 	const svg = d3.select(this)
// 		.selectAll('svg')
// 		.data([1]);
//
// 	const svgEnter = svg.enter().append('svg')
// 		.attr('width',w)
// 		.attr('height',h)
//
// 	svgEnter.append('g')
// 		.attr('class', 'area');
//
// 	const plot = svg.merge(svgEnter)
// 		.select('g')
// 		.attr('transform',`translate(${margin.l},${margin.t})`);
//
// 	const areaNode = plot
// 		.selectAll('.area')
// 		.data([tripsByInterval]);
//
// 	const areaNodeEnter = areaNode.enter()
// 		.append('path')
// 		.attr('class','area');
//
// 	areaNodeEnter.merge(areaNode)
// 		.attr('d',areaGenerator);
//
//
//
// }
