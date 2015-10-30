var fs = require('fs'),
    util = require('util'),
    stream = require('stream'),
    es = require("event-stream"),
    __ = require("underscore");

var lineNr = 1,
    count = 0;

// VAR DATA BEGINS THE ARRAY WITH THE KEY, MAPPING THE KEY TO THE REST OF ARRAY.
var data = [["date", "time", "s-ip", "cs-method", "cs-uri-stem", "cs-uri-query", "s-port", "cs-username", "c-ip", "cs(User-Agent)", "cs(Cookie)", "cs(Referer)", "sc-status", "sc-substatus", "sc-win32-status", "sc-bytes", "cs-bytes", "time-taken", "unique-id"]]

var rebuildArray = function() {
    var newData = [];

    for (var i = 1; i < data.length; i++) {
        var jsonVariable = {};
        for(var x = 0; x < data[0].length; x++) {
            var jsonKey = data[0][x];
            jsonVariable[jsonKey] = data[i][x];
        }
        newData.push(jsonVariable);
    }
    return newData;
}

s = fs.createReadStream('../logs/1509.log.txt');

var cut = s.pipe(es.split())

    cut.pipe(es.mapSync(function(line) {
        s.pause();

        // CURRENT LINE NUMBER
        // ===================
        lineNr += 1;

            // FUNCTION PER LINE --> LINE === THIS (KIND OF!)
            // ==============================================
            (function() {

                // COUNT BECOMES FINAL LINE TOTAL, LOG WHEN FINISHED
                // =================================================
                count += 1;

                // FILTERS DOWN AUDIOFILES AND REMOVES KNOWN BOTS
                // ==============================================
                var audiotypes = line.indexOf(".mp3") >= 0 || line.indexOf(".mp4") >= 0 || line.indexOf(".m4a") >= 0;
                var bots = line.indexOf("Googlebot") >= 0 || line.indexOf("baidu") >= 0;

                // ADD "&& COUNT <= NUMBER" TO THIS END BECAUSE 100,000+ LINE FILES
                // ================================================================
                if (audiotypes && !bots && count <= 20) {
                    // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO DATA ARRAY
                    // ===========================================================
                    var a = line.split(/[ ]+/);
                    // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
                    // ================================================================================
                    a.push('id_' + (__.uniqueId() - 1));
                    data.push(a);
                }

                s.resume();
            })();
        })
        .on('error', function() {
            console.log('Error while reading file.');
        })
        .on('end', function() {

            var output = rebuildArray(),
                newOutput = JSON.stringify(output);

            fs.writeFileSync("../logs/output.json", newOutput);
        })

        // RETURN OUTPUT FOR EXPORT?!?
        /*
            // tools.js
            // ========
            module.exports = {
                foo: function () {
                    // whatever
                },
                bar: function () {
                    // whatever
                }
            };

            var zemba = function () {
            }
        */

        /*
            // app.js
            // ======
            var tools = require('./tools');
            console.log(typeof tools.foo); // => 'function'
            console.log(typeof tools.bar); // => 'function'
            console.log(typeof tools.zemba); // => undefined
        */
);
