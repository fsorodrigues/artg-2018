import {csv, json, format} from 'd3';

export const parseHist = d => {
    const date = new Date (+d.date.slice(0,4),+d.date.slice(4,6),+d.date.slice(6,8))

    return {
		date: date,
        year: date.getUTCFullYear(),
        home: d.home,
        away: d.away,
		away_triple_plays: +d.away_triple_plays,
		home_triple_plays: +d.home_triple_plays,
		game_triple_plays: (+d.away_triple_plays) + (+d.home_triple_plays),
		attendance: +d.attendance,
        away_complete_game: +d.away_complete_game,
		home_complete_game: +d.home_complete_game,
        game_complete_game: (+d.away_complete_game) + (+d.home_complete_game),
        away_no_hitter: +d.away_no_hitter,
		home_no_hitter: +d.home_no_hitter,
        game_no_hitter: (+d.away_no_hitter) + (+d.home_no_hitter),
        away_perfect_game: +d.away_perfect_game,
		home_perfect_game: +d.home_perfect_game,
        game_perfect_game: (+d.away_perfect_game) + (+d.home_perfect_game),
        info_triple_plays: d.triple_play_info,
        info_complete_game: d.complete_game_info,
        info_no_hitter: d.no_hitter_info,
        info_perfect_game: d.perfect_game_info
    };
};

export const parseMatrix = d => {
    return {
        year: +d.year,
        team: d.home,
        total_triple_plays: (+d.away_triple_plays) + (+d.home_triple_plays),
        total_complete_game: (+d.away_complete_game) + (+d.home_complete_game),
        total_no_hitter: (+d.away_no_hitter) + (+d.home_no_hitter),
        total_perfect_game: (+d.away_perfect_game) + (+d.home_perfect_game),
        total_games: (+d.away_games) + (+d.home_games)
    };
};

export const fetchData = (url) => {
	return new Promise((resolve, reject) => {
		json(url, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
};

export const fetchCsv = (url, parse) => {
	return new Promise((resolve, reject) => {
		csv(url, parse, (err, data) => {
			if(err){
				reject(err);
			}else{
				resolve(data);
			}
		})
	});
};

export const formatNumber = format('.0f');

export const formatPercent = format(',.2%');

export const onlyUnique = function(value, index, self) {
    return self.indexOf(value) === index;
};
