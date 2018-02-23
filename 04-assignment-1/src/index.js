import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';
import Timeline from './Timeline';

console.log('Week 4 exercise 2');

// Create instances of this reusable module
const timelineMain = Timeline()
	.timeInterval(d3.timeWeek)
	.timeRange(2012,2012) // start date  & end date
	.maxVolume(3000)
	.thresholds(d3.timeWeek.range(new Date(2012,0,1), new Date(2012,11,31), 1));

const timelineMultiple = Timeline()
	.timeInterval(d3.timeWeek)
	.timeRange(2012,2012) // start date  & end date
	.maxVolume(500)
	.thresholds(d3.timeWeek.range(new Date(2012,0,1), new Date(2012,11,31), 1));

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	const mainNodes = d3.select('#timeline-main')
		.datum({ key:'all station', values: trips })

	const mainNodesEnter = mainNodes.enter()
	 	.append('div')
		.attr('class', 'main-node');

	mainNodes.merge(mainNodesEnter)
		.each(timelineMain);

	//Nest trips by origin station
	const tripsByStation0 = d3.nest()
		.key(function(d){ return d.station0 })
		.entries(trips);

	const stationNodes = d3.select('#timeline-multiple')
		.selectAll('.station-node')
		.data(tripsByStation0);

	const stationNodesEnter = stationNodes.enter()
		.append('div')
		.attr('class', 'station-node')
		.style('width','300px')
		.style('height','180px')
		.style('float','left');

	stationNodes.merge(stationNodesEnter)
		.each(timelineMultiple);

});
