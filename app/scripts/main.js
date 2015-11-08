var september2015,
    october2015,
    _;

// // Get context with jQuery - using jQuery's .get() method.
// var ctx = $("#myChart").get(0).getContext("2d");
// // This will get the first returned node in the jQuery collection.
// var myNewChart = new Chart(ctx);


function loadJSON(path, callback) {
    'use strict';
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType('application/json');
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == '200') {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var dict = [],
    newdict;

var pah = [],
    pahdates = [],
    sv = [],
    svdates = [],
    dates = [];

var vm = {

    piechart: function(el, atomic, voyage){
        'use strict';
        var pieData = [
           {
              value: atomic.length,
              label: 'Post Atomic Horror',
              color: '#ffe082'
           },
           {
              value: voyage.length,
              label: 'Sarcastic Voyage',
              color: '#e0f2f1' //FF8A80
           }
        ];

        var context = document.getElementById(el).getContext('2d');
        /*eslint-disable*/
        var skillsChart = new Chart(context).Pie(pieData);
        /*eslint-enable*/
    },

    podcastdata: function(data){
        'use strict';
        // var atomic = [],
            // pahdates = [];
        // EXTRACT ONLY "PAH" OCCURANCES
        // =============================
        for (var i = 0; i < data.length; i++) {
            var d = data[i].episode;
            if (d.indexOf('pah') >= 0) {
                pah.push(data[i].episode);
                pahdates.push(data[i].date);
            }
        }
        // EXTRACT ONLY "SARCASTICVOYAGE" OCCURANCES
        // =============================
        for (var j = 0; j < data.length; j++) {
            var dat = data[j].episode;
            if (dat.indexOf('svpodcast') >= 0) {
                sv.push(data[j].episode);
                svdates.push(data[j].episode);
            }
        }

        console.log('# of pah occurrences: ' + pah.length);
        console.log('# of sv occurrences: ' + sv.length);

        vm.piechart('september2015', pah, sv);
        // vm.piechart('october2015', pah, sv);
    },

    sarcasticvoyage: function(data){
        'use strict';
        // EXTRACT ONLY "SARCASTICVOYAGE" OCCURANCES
        // =============================
        for (var i = 0; i < data.length; i++) {
            var d = data[i].episode;
            if (d.indexOf('svpodcast') >= 0) {
                sv.push(data[i].episode);
                svdates.push(data[i].episode);
            }
        }
        // console.log("# of sv occurrences: " + sv.length)
    },

    buildChartData: function(data){
        'use strict';
        vm.podcastdata(data);
    },

    begin: function(data) {
        'use strict';
        for (var i = 0; i < data.length; i++) {
            var episodeTitle = data[i]['cs-uri-stem'].replace(/^.*[\\\/]/, '').slice(0, -4),
                date = data[i]['date'],
                time = data[i]['time'];
            dict.push({'date': date, 'episode': episodeTitle, 'time': time});
        }
        newdict = _.uniq(dict, false, function(a){
            return a['time'];
        });
        vm.buildChartData(newdict);
    },

    init: function() {
        'use strict';
        // loadJSON('../logs/log-september-2015.json', function(response) {
        //     // Parse JSON string into object
        //     september2015 = JSON.parse(response);
        //     vm.begin(september2015);
        // });

        loadJSON('../logs/log-october-2015.json', function(response) {
            october2015 = JSON.parse(response);
            vm.begin(october2015);
        });
    }
};

vm.init();
