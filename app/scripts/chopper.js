// DEPRECIATED
// USE MINCER.JS

/*var fs = require('fs'),
    es = require('event-stream'),
    underscore = require('underscore'),
    colors = require('colors');


// $$$.DATA BEGINS THE ARRAY WITH THE KEY, MAPPING THE KEY TO THE REST OF ARRAY.
// DATA IS MUTATED INTO A COMPLETE KEY VALUE JSON OBJECT AFTER EVERYTHING HAS BEEN PUSHED TO IT
// ============================================================================================

var $$$ = {
    data: [
        ['date', 'time', 's-ip', 'cs-method', 'cs-uri-stem', 'cs-uri-query', 's-port', 'cs-username', 'c-ip', 'cs(User-Agent)', 'cs(Cookie)', 'cs(Referer)', 'sc-status', 'sc-substatus', 'sc-win32-status', 'sc-bytes', 'cs-bytes', 'time-taken', 'unique-id']
    ],
    formattedData: [],
    lineNr: 1,
    count: 0,
    matchCount: 0,
    output: undefined,
    newOutput: undefined,
    sourceFile: '../logs/u_ex1510.log.txt',
    destinationFile: '../logs/log-october-2015.json',
    tools: {
        rebuildArray: function() {
            'use strict';
            // _.without(arr, '#Fields:')
            // remove '#Fields' from array to build dynamic IIS Key
            // ====================================================

            var newData = [];

            for (var i = 1; i < $$$.data.length; i++) {
                var jsonVariable = {};
                for (var x = 0; x < $$$.data[0].length; x++) {
                    var jsonKey = $$$.data[0][x];
                    jsonVariable[jsonKey] = $$$.data[i][x];
                }
                newData.push(jsonVariable);
            }
            return $$$.formattedData = newData;
        },

        parseJSONforAudioReferences: function(line){
            'use strict';


            // AUDIOTYPES AND BOTS
            // FILTERS DOWN AUDIOFILES AND REMOVES KNOWN BOTS
            // CHANGED TO LINE.MATCH REGEX FOR DRYNESS && EXTENDABLILITY
            // USED TO BE line.indexOf(".mp3") >= 0 || line.indexOf(".mp4") >= 0 || line.indexOf(".m4a") >= 0;
            // ===============================================================================================

            var audiotypes = line.match( /(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/ );
            var bots = line.match( /(googlebot|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|Slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|Baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/ );


            // ADD "IF (COUNT <= NUMBER)" TO THIS BECAUSE 100,000+ LINE FILES
            // ==============================================================
            if (audiotypes && !bots){
                // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO $$$.DATA ARRAY
                // ===========================================================
                var arr = line.split(/[ ]+/);
                $$$.matchCount += 1;
                // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
                // ================================================================================
                arr.push('id_' + (underscore.uniqueId() - 1));
                $$$.data.push(arr);
            }
        },

        convertEntireLogFileToJSONEliminatingHeaders: function(line){
            'use strict';
            // ADD "IF (COUNT <= NUMBER)" TO THIS BECAUSE 100,000+ LINE FILES U KNO?
            // =====================================================================
            if (lineNr === 4) {
                // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO $$$.DATA ARRAY
                // ===========================================================
                var arr = line.split(/[ ]+/);
                $$$.matchCount += 1;
                // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
                // ================================================================================
                arr.push('id_' + (underscore.uniqueId() - 1));
                $$$.data.push(arr);
            } else if (line.indexOf('#') === 0) {
                return
            } else {
                // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO $$$.DATA ARRAY
                // ===========================================================
                var arr = line.split(/[ ]+/);
                $$$.matchCount += 1;
                // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
                // ================================================================================
                arr.push('id_' + (underscore.uniqueId() - 1));
                $$$.data.push(arr);
            }
        },

        completeBuildOfNewJSON: function(){
            'use strict';
            // =====================================================
            // PROTOTYPE JSON QUERY FUNCTIONS BASED ON STACKOVERFLOW
            // =====================================================
            // var counter = 0;
            // var checkForValue = function(json, value) {for (key in json) {if (typeof(json[key]) === "object") {return checkForValue(json[key], value);} else if (json[key] === value) {counter += 1;}}return false;}
            // for (var i = 0; i < $$$.newOutput.length; i++) {checkForValue($$$.newOutput, "/podcast/sketches/179-12.mp3")}

            // var output = $$$.tools.rebuildArray();
            // $$$.newOutput = JSON.stringify(output);
            $$$.output = underscore.uniq($$$.data, false, function(item) {
                return item['time'] && item['cs-uri-stem']
            });
            $$$.newOutput = JSON.stringify($$$.tools.rebuildArray());
            fs.writeFileSync($$$.destinationFile, $$$.newOutput);
        }
    }
};

var s = fs.createReadStream($$$.sourceFile, function(){
        'use strict';
        console.log('yes');
    })
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
        'use strict';
        s.pause();
        // CURRENT LINE NUMBER
        // ===================
        $$$.lineNr += 1;



        // FUNCTION PER LINE.  LINE === "THIS" (KIND OF!)
        // ==============================================
        (function() {
            // COUNT BECOMES FINAL LINE TOTAL, LOG WHEN FINISHED
            // =================================================
            $$$.count += 1;

            // PARSE DOWN AND RETURN ONLY AUDIOFILES W/O BOTS
            // =================================================
            $$$.tools.parseJSONforAudioReferences(line);

            // CONVERT ENTIRE FILE TO JSON ELIMINATING #HEADERS
            // =================================================
            // $$$.tools.convertEntireLogFileToJSONEliminatingHeaders(line);

            s.resume();
        })();
    })
    .on('error', function() {
        'use strict';
        console.log('Error while reading file.');
    })
    .on('end', function() {

        Promise.all(
                [$$$.tools.completeBuildOfNewJSON()]
            ).then(function(){

                console.log(colors.green( colors.bold('\n\t   ' + 'Matched ' + colors.red($$$.matchCount) + ' entries.') ) );
                console.log(colors.bold('reading from:\t' + colors.yellow( $$$.sourceFile) ) );
                console.log(colors.bold('    ' + 'wrote to:\t' + colors.yellow( $$$.destinationFile ) ) );

                // console.log($$$.formattedData)
            }
        );

    })
);
*/
