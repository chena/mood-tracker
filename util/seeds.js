var fs = require('fs');
var moment = require('moment');

var generateMoodSeeds = function(startDate) {
    moods = ['happy', 'okay', 'unhappy'];
    dailyMoods = [];

    for (var date = moment(startDate); !date.isAfter(moment()); date = date.add(1, 'd')) {
        dailyMoods.push({
            date: date.format('YYYY-MM-DD'),
            mood: moods[Math.floor(Math.random() * moods.length)]
        });
    }
    return dailyMoods;
};

var args = process.argv;
if (args.length < 3) {
    console.error('usage: node util/seeds.js <filename> [<start_date>]');
    process.exit(1);
}

var base = 'util/data', 
    fname = args[2],
    startDate = args[3] ? args[3] : '2014-07-21';

if (!moment(startDate).isValid()) {
    console.error('invalid date: ' + startDate);
    process.exit(1);
}

fs.stat(base, function(err, s) {
    if (err && err.errno === 34) {
        fs.mkdir('util/data', function(err) {
            console.error('unable to create data directory');
            process.exit(1);
        });
    }
    var data = generateMoodSeeds(startDate);
    fs.writeFile(base + '/' + fname, JSON.stringify(data), function(err) {
        if (err) {
            throw err;
        }
        console.log('file written!');
    });
});

