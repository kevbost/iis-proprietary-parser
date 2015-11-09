var fs = require('fs'),
    es = require('event-stream'),
    underscore = require('underscore'),
    colors = require('colors');

var $$ = {
    data: [],
    mutatedData: undefined,
    cleanedData: undefined,
    lineNr: 1,
    matchCount: 0,
    sourceFile: '../logs/u_ex1510.log.txt',
    destinationFile: '../logs/log-october-2015.json',

    parseJSONforAudioReferences: function(line){
        'use strict';
        var audiotypes = line.match( /(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/ );
        var bots = line.match( /(googlebot|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|Slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|Baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/ );
        if ($$.lineNr === 5) {
            var tmp = line.split(/[ ]+/);
            tmp.push('unique-id');
            tmp.shift();
            $$.data.push(tmp);
        } else if (audiotypes && !bots) {
            $$.matchCount += 1;
            var buffer = line.split(/[ ]+/);
            buffer.push('id_' + (underscore.uniqueId() - 1));
            $$.data.push(buffer);
        }
    },

    mutateData: function() {
        'use strict';
        var buffer = [];

        for (var i = 1; i < $$.data.length; i++) {
            var bufferObject = {};
            for (var x = 0; x < $$.data[0].length; x++) {
                var jsonKey = $$.data[0][x];
                bufferObject[jsonKey] = $$.data[i][x];
            }
            buffer.push(bufferObject);
        }
        $$.mutatedData = buffer;
    },

    rebuildArray: function() {
        'use strict';
        $$.mutateData();
    },

    removeDuplicatesFromMutatedData: function() {
        'use strict';
        $$.cleanedData = underscore.uniq($$.mutatedData, false, function(item) {
            return item['time'] && item['cs-uri-stem'];
        });
    },

    stringifyMutatedData: function() {
        'use strict';
        $$.finalJSON = JSON.stringify($$.cleanedData);
    }
};

var s = fs.createReadStream($$.sourceFile)
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
        'use strict';
        s.pause();
        $$.lineNr += 1;
        (function(){
            $$.parseJSONforAudioReferences(line);
            s.resume();
        })();
    })
    .on('error', function() {
        'use strict';
        console.log('Error while reading file.');
    })
    .on('end', function() {
        'use strict';
        Promise.all(
                [
                    $$.rebuildArray(),
                    $$.removeDuplicatesFromMutatedData(),
                    $$.stringifyMutatedData()
                ]
            ).then(function(){
                var srcSize = fs.statSync($$.sourceFile);
                var destSize = fs.statSync($$.destinationFile);

                console.log(colors.green( colors.bold('\n\t   ' + 'Matched ' + colors.red( $$.matchCount) + ' entries.') ) );
                console.log(colors.bold('reading from:\t' + colors.yellow( $$.sourceFile) + '\tSize: ' + srcSize["size"] / 1000000.0 + 'mb'));
                console.log(colors.bold('    ' + 'wrote to:\t' + colors.yellow( $$.destinationFile ) + '\tSize: ' + destSize["size"] / 1000000.0 + 'mb'));

                fs.writeFileSync($$.destinationFile, $$.finalJSON);

            }
        );

    })
);
