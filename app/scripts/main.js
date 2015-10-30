var september2015;
var october2015;

// // Get context with jQuery - using jQuery's .get() method.
// var ctx = $("#myChart").get(0).getContext("2d");
// // This will get the first returned node in the jQuery collection.
// var myNewChart = new Chart(ctx);


function loadJSON(path, callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

var dict = [];
var newdict;

var pah = [],
    pahdates = [],
    sv = [],
    svdates = [],
    dates = [];

var vm = {

    piechart: function(el, pah, sv){

        var pieData = [
           {
              value: pah.length,
              label: 'Post Atomic Horror',
              color: '#ffe082'
           },
           {
              value: sv.length,
              label: 'Sarcastic Voyage',
              color: '#e0f2f1' //FF8A80
           }
        ];

        var context = document.getElementById(el).getContext('2d');
        var skillsChart = new Chart(context).Pie(pieData, {
            legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
        });
    },

    podcastdata: function(data){
        // var pah = [],
            // pahdates = [];
        // EXTRACT ONLY "PAH" OCCURANCES
        // =============================
        for (var i = 0; i < data.length; i++) {
            var d = data[i].episode;
            if (d.indexOf("pah") >= 0) {
                pah.push(data[i].episode)
                pahdates.push(data[i].date)
            }
        }
        // EXTRACT ONLY "SARCASTICVOYAGE" OCCURANCES
        // =============================
        for (var i = 0; i < data.length; i++) {
            var d = data[i].episode;
            if (d.indexOf("svpodcast") >= 0) {
                sv.push(data[i].episode)
                svdates.push(data[i].episode)
            }
        }

        console.log("# of pah occurrences: " + pah.length)
        console.log("# of sv occurrences: " + sv.length)

        vm.piechart('september2015', pah, sv);
        // vm.piechart('october2015', pah, sv);
    },

    sarcasticvoyage: function(data){
        // EXTRACT ONLY "SARCASTICVOYAGE" OCCURANCES
        // =============================
        for (var i = 0; i < data.length; i++) {
            var d = data[i].episode;
            if (d.indexOf("svpodcast") >= 0) {
                sv.push(data[i].episode)
                svdates.push(data[i].episode)
            }
        }
        // console.log("# of sv occurrences: " + sv.length)
    },

    buildChartData: function(data){
        vm.podcastdata(data);
    },

    begin: function(data) {
        for (var i = 0; i < data.length; i++) {
            var episodeTitle = data[i]["cs-uri-stem"].replace(/^.*[\\\/]/, '').slice(0, -4),
                date = data[i]["date"],
                time = data[i]["time"];
            dict.push({"date": date, "episode": episodeTitle, "time": time})
        }
        newdict = _.uniq(dict, false, function(a){
            return a["time"];
        })
        vm.buildChartData(newdict);
    },

    init: function() {
        loadJSON('../logs/log-september-2015.json', function(response) {
            // Parse JSON string into object
            september2015 = JSON.parse(response);
            vm.begin(september2015)
        });

        // loadJSON('../logs/log-october-2015.json', function(response) {
        //     october2015 = JSON.parse(response);
        //     vm.begin(october2015)
        // });
    }
}

vm.init();
