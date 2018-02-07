import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';
import activityHistogram from './activityHistogram';

console.log('Week 3 assignment 2');

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	//Nest trips by origin station
	const tripsByStation0 = d3.nest()
		.key(d => d.station0)
		.entries(trips);

	console.log(tripsByStation0);

	// UPDATE selection --> data bind
	const stationNodes = d3.select('#timeline-multiple')
		.selectAll('.station-node') // empty selection
		.data(tripsByStation0, d => d.key); // array of size 142
		// ENTER selection = 142
		// UPDATE selection = 0

	// ENTER selection --> appending new elements
	const stationNodesEnter = stationNodes.enter()
		.append('div')
		.attr("class", "station-node")
		.style('width','300px')
		.style('height','180px')
		.style('float','left');

	stationNodes.merge(stationNodesEnter)
		.each(activityHistogram); //What arguments are we passing to activityHistogram?
  // activityHistogram is receiving tripsByStation0, the data bound to the selection on line 24 above.
	// by definition (in activityHistogram.js), the function takes 1 parameter, which is expected to be an array.

	stationNodes.exit().remove();

});
