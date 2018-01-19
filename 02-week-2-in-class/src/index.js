import * as d3 from 'd3';
//Install bootstrap first, using npm install bootstrap --save
//import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

import parse from './parse';

console.log('Week 2 in class');

//Data binding

//Import and parse data
d3.csv('./data/hubway_trips_reduced.csv', parse, function(err,trips){

	//Data transformation, discovery, and mining
  console.log(trips);
  console.log(typeof(trips));

  const tripsByStation0 = d3.nest() //grouping by
      .key(function(d) { return d.station0; }) //value to be grouped by
      .entries(trips); //assigning data

  console.log(tripsByStation0);

  const tripVolumeByStation0 = tripsByStation0.map(function(d) {
      return { station: d.key, volume: d.values.length };
    }).slice(0,50);
    // .sort(function(a,b) { return b.volume - a.volume; })

  console.log(tripVolumeByStation0);

  //Mine for max & mining
  const maxVolume = d3.max(tripVolumeByStation0, function(d) { return d.volume; });
  const minVolume = d3.min(tripVolumeByStation0, function(d) { return d.volume; });

  //Visual space measurements
  const margin = { t: 100, r: 50, b:100, l: 50 };
  const padding = 3;
  const w = d3.select(".module").node().clientWidth;
  const h = d3.select(".module").node().clientHeight;
  const width = w - (margin.l + margin.r)
  const height = h - (margin.t + margin.b)

  //Scales
  const scaleX = d3.scaleLinear()
      .domain([0, maxVolume])
      .range([0, width]);

	//Represent / DOM manipulation
  const svgNode = d3.select(".module")
      .append("svg")
      .attr("width", width)
      .attr("height", height); //selection

  const plot = svgNode.append("g")
      .attr("class", "chart")
      .attr("transform", `translate(${margin.l},${margin.t})`); //selection of <g.chart>

  const stationNodes = plot.selectAll(".station") //empty selection
      .data(tripVolumeByStation0) //data join
      .enter() //special selection of deficit between DOM and data points in the array
      .append("g")
      .attr("class", "station")
      .attr("transform", function(d,i) { return `translate(0,${i*height/tripVolumeByStation0.length})`; }); //selection of <g.station> * 142

  stationNodes.append("rect")
      .attr("width", function(d) { return scaleX(d.volume); })
      .attr("height", height/tripVolumeByStation0.length - padding)
      .style("fill", "red");

  stationNodes.append("text")
      .text(function(d) { return d.station; })
      .attr("text-anchor", "end")
      .attr("dy", 10)
      .attr("dx", -padding)
      .style("font-size", "10px");
});

/***

PLAYING WITH SELECTION, EVENTS, CONTROL, FLOW/CALLS

//Part 1: review d3-selection
//https://github.com/d3/d3-selection

//Select elements
const moduleSelection = d3.select(".module") //selection

//Selection vs DOMNode
console.log(moduleSelection); //logs the selection
console.log(moduleSelection.node()); //logs the actual element

const divSelection = d3.select("div");
console.log(divSelection);

//Modifying selection
const redNode = moduleSelection
    .append("div")
    .attr("class", "new new-div")
    .style("width", "100px")
    .style("height", "200px")
    .style("background", "red");

const greenNode = redNode
    .append("div")
    .style("width", "20px")
    .style("height", "20px")
    .style("background", "green");

console.log(redNode.node());
console.log(greenNode.node());

//Handle events

redNode
    .on("click", function() {
        console.log("Red box has been clicked")
      });

greenNode
    .on("click", function(d) {
      d3.event.stopPropagation();
    });

const allDivsSelection = d3.select("body")
    .selectAll("div");

console.log(allDivsSelection);

//Control flow: .each and .call
allDivsSelection.each(function(d,i,nodes) { //callback function
    console.group();
        console.log(d); //datum
        console.log(i); //index
        console.log(nodes); //group
        console.log(this); //node
    console.groupEnd();
})
***/
