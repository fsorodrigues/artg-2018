import * as d3 from 'd3';
import '../style/main.css';

import Histogram from './Histogram'

function MainViz(_) {

  const timeline = Histogram()
    .domain([new Date(2013, 0, 1), new Date(2013, 11, 12)])
    .value(d => d.t0)
    .thresholds(d3.timeMonth.range(new Date(2013, 0, 1), new Date(2013, 11, 12), 1))
    .tickX(2)
    .tickY(2)
    .tickXFormat(d => {
      let formatMonth = d3.timeFormat("%b");
      let getMonth = formatMonth(d);
      return `${getMonth}`;

      // return (new Date(d).toUTCString())
    })
    .maxVolume(400);

  function exports(data, i) {

    const width = this.clientWidth;
    const height = this.clientHeight;

    // data transformation
    // nest by starting station
    const tripsByStation = d3.nest()
      .key(d => d.station0)
      .entries(data)
      .map(d => d.values);

    console.log(tripsByStation);

    // create a node for each station
    // call timeline module on each node

    // update selection
    const stationNodes = d3.select(this)
      .selectAll('.station-node')
      .data(tripsByStation);

    // enter selection
    const stationNodesEnter = stationNodes.enter()
      .append('div')
      .classed('station-node', true)
      .style('width', '300px')
      .style('height', '180px')
      .style('float', 'left');

    // exit selection
    stationNodes.exit().remove();

    stationNodes.merge(stationNodesEnter)
      .each(timeline)
  }

  return exports;
}

export default MainViz;
