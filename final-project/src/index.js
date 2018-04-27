// importing d3.js
import * as d3 from 'd3';

// importing bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// importing stylesheets
import './style/main.css';
import './style/text.css';

// importing parsing functions from utils
import {parseHist, parseMatrix, fetchCsv, onlyUnique} from './utils';

// importing modules
import LineChart from './components/LineChart';
import {DrawLine} from './components/LineChart';
import TimeSeries from './components/TimeSeries';
import Matrix from './components/Matrix';
import Controller from './components/ScrollAnimation';

const scaleColor = d3.scaleOrdinal()
    .domain(['total_complete_game', 'total_no_hitter', 'total_perfect_game', 'total_triple_plays'])
    .range(['#40B55C', '#ECB55B', '#EB4F5C', '#40ADEE']);

// calling factories and setting'em up
const linechart = LineChart()
    .header({title:'Some funny title',
        sub:'<span class="text-sub" id="triple_plays">Triple-plays</span>,\
            <span class="text-sub" id="no_hitter">No-hitters</span>,\
            and <span class="text-sub" id="perfect_game">Perfect Games</span>,\
            <span class="text-sub" id="complete_game">Complete Games</span> per game, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const timeSeries = TimeSeries()
    .header({title:'Some other funny title', sub:'Total triple-plays per season, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const matrix = Matrix(document.querySelector('.matrix-container'))
    .header({title:'Some other funny title', sub:'Matrix team x season, 1970-2017'})
    .footer({credit:'Felippe Rodrigues', source:'retrosheet.org'});

const drawLine = DrawLine();

const controller = Controller()
    .on('scene:enter', function(d) {
        const value = d3.select(this).attr('value');
        drawLine.lineGen(value);
        drawLine(d);
    })
    .on('scene:leave', function(d) {
        const value = d3.select(this).attr('value');
        drawLine.lineGen(value);
        drawLine(d);
    })
    .on('chart:stick', function() {
        const chart = d3.select('.line-container');
        chart.style('position', 'sticky')
            .style('top', '5%');
    })
    .on('text:color', function() {
        const value = d3.select(this).attr('value');
        const textEl = value.replace('total_', '');
        d3.select('#'+textEl)
            .style('color', () => scaleColor(value));
    });

// TO DO: importing data using the Promise interface
Promise.all([
    fetchCsv('./data/gamelog_1970_2017.csv', parseHist),
    fetchCsv('./data/matrix_year_team.csv', parseMatrix)
]).then(([game_logs, data_matrix]) => {

    d3.select('.line-container')
        .datum(game_logs)
        .each(linechart);

    d3.select('.bar-container')
        .datum(game_logs)
        .each(timeSeries);

    matrix(data_matrix, game_logs);

    controller(game_logs);

});

timeSeries.on('bar:enter', function(d,_accessor) {
    d3.select(this)
        .style('fill-opacity', 1)
        .style('stroke-width', 1)
        .style('stroke', 'black');

    const tooltip = d3.select('.tooltip-bars');
    tooltip.style('top', `${d3.event.pageY-10}px`)
        .style('left', `${d3.event.pageX+10}px`)
        .transition()
        .duration(250)
        .style('opacity', 1);

    if (_accessor == "game_complete_game") {
        tooltip.html(`<b>${d.x0}</b><br>${d.value} total complete games`);
    } else {
        console.log(d);
        tooltip.html(`<b>${d.x0}</b><br>${d.games}`);
    }
}).on('bar:leave', function(d) {
    d3.select(this)
        .style('fill-opacity', 0.6)
        .style('stroke-width', 0)
        .style('stroke', 'none');

    const tooltip = d3.select('.tooltip-bars');
    tooltip.style('top', 0)
        .style('left', 0)
        .transition()
        .duration(150)
        .style('opacity', 0);

    tooltip.html('');
});

matrix.on('rect:enter', function(d,_accessor,game_logs) {
    const thisEl = d3.select(this);
    thisEl.style('stroke-width', 1)
        .style('stroke', 'black');

    const tooltip = d3.select('.tooltip-matrix');
    tooltip.style('top', `${d3.event.pageY-10}px`)
        .style('left', `${d3.event.pageX+10}px`)
        .transition()
        .duration(250)
        .style('opacity', 1);

    const team = thisEl.attr('data-team');
    const year = +thisEl.attr('data-year');

    if (_accessor == "total_complete_game") {
        tooltip.html(`<b>${d.year} ${d.team}</b><br>${d[_accessor]} total complete games`);
    } else if (_accessor == "total_triple_plays") {
        const data = game_logs.filter(e => e.year === year && e[_accessor.replace('total_','info_')].includes(team))
            .map(e => {
                    return `${e.home} @ ${e.away}`;
            })
            .toString()
            .split(',')
            .filter(onlyUnique)
            .join(', ');
        tooltip.html(`<b>${d.x0}</b><br>${data}`);
    } else {
        const data = game_logs.filter(e => e.year === year && e[_accessor.replace('total_','info_')].includes(team))
            .map(e => e[_accessor.replace('total_','info_')])
            .toString()
            .split(',')
            .filter(onlyUnique)
            .join(', ');
        tooltip.html(`<b>${d.x0}</b><br>${data}`);
    }

    // console.log(game_logs
    //             .filter(e => e[_accessor.replace('total_', 'info_')] != 'none')
    //             .filter(e => e));
}).on('rect:leave', function(d) {
    d3.select(this)
        .style('stroke-width', 0)
        .style('stroke', 'none');

    const tooltip = d3.select('.tooltip-matrix');
    tooltip.style('top', 0)
        .style('left', 0)
        .transition()
        .duration(150)
        .style('opacity', 0);

    tooltip.html('');
});
