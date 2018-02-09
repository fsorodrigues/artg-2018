import * as d3 from 'd3';
import './style/main.css';
import './style/stationSearch.css';

// Import utility function
import {parse, parse2} from './utils';

// Import modules
import Histogram from './components/Histogram'; // factory function
import MainViz from './components/mainViz'; // factory function

const activityHistogram = Histogram() // a closure
	.thresholds(d3.range(0,24,.25)) // expects array
	.domain([0,24]) // expects array
	.value(d => d.time_of_day0) // expects function
	.tickX(4)
	.tickXFormat(d => {
		const time = +d;
		const hour = Math.floor(time);
		let min = Math.round((time-hour)*60);
		min = String(min).length === 1? "0"+ min : min;
		return `${hour}:${min}`
	})
	.tickY(5)
	.maxVolume(1000);

const timeline = Histogram() // a closure
  .domain([new Date(2013, 0, 1), new Date(2013, 11, 12)])
	.value(d => d.t0)
	.thresholds(d3.timeMonth.range(new Date(2013, 0, 1), new Date(2013, 11, 12), 1))
	.tickX(2)
	.tickY(5)
	.tickXFormat(d => {
		let formatMonth = d3.timeFormat("%b");
		let getMonth = formatMonth(d);
		return `${getMonth}`;

		// return (new Date(d).toUTCString())
	});

const mainViz = MainViz(); // a closure

d3.csv('./data/hubway_trips_reduced.csv', parse, (err,trips) => {

	d3.select('#time-of-the-day-main')
		.datum(trips)
		.each(activityHistogram);

	d3.select('#timeline-main')
		.datum(trips)
		.each(timeline);

	d3.select('.main')
	  .datum(trips)
		.each(mainViz);

});
