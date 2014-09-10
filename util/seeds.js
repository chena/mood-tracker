var fs = require('fs');
var moment = require('moment');

var generateMoodSeeds = function() {
    moods = ['happy', 'okay', 'unhappy'];
    dailyMoods = [];

    for (var date = moment('2014-07-21'); !date.isAfter(moment()); date = date.add(1, 'd')) {
        var mStr = JSON.stringify({
            date: date.format('YYYY-MM-DD'),
            mood: moods[Math.floor(Math.random() * moods.length)]
        }, null, 4);
        dailyMoods.push(mStr);
    }
    return dailyMoods;
};

fs.writeFile('data.json', generateMoodSeeds(), function(err) {
    if (err) {
        console.error('something went wrong!');
    } else {
        console.log('file written!');
    }
});