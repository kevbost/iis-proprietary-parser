var fs = require('fs'),
    es = require('event-stream'),
    underscore = require('underscore'),
    colors = require('colors')
    columnify = require('columnify');

var commandLineArguments = process.argv;

var $$ = {
    data: [],
    uniqueIPList: [],
    mutatedData: undefined,
    cleanedData: undefined,
    finalJSON: undefined,
    lineNr: 1,
    matchCount: 0,
    sourceFile: commandLineArguments[2],
    destinationFile: commandLineArguments[3],
    uniqueIPListFile: undefined,
    errorMessageInstructions: colors.bold('$ node <file> path/to/pathtosource.log.txt path/to/pathtodest.json'),

    checkArguments: function() {
        'use strict';
        if ($$.sourceFile.length === 0) {
            console.log(colors.bold('\nMissing '.yellow + 'read source'.red + ' file, please provide the '.yellow + 'path/to/file'.red + ' of IIS.log.txt'.yellow));
            console.log($$.errorMessageInstructions);
        } else if ($$.destinationFile === undefined) {
            console.log(colors.bold('\nMissing '.yellow + 'write'.red + ' destination, please provide the '.yellow + 'path/to/file'.red + ' of whateverfile.json'.yellow));
            console.log($$.errorMessageInstructions);
        }
    },

    parseJSONforAudioReferences: function(line) {
        'use strict';
        var audiotypes = line.match(/(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/);
        var bots = line.match(/(googlebot|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|Slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|Baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/);
        if ($$.lineNr < 10 && line.match(/(#Fields)/)) {
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

    extractUniqueIPs: function(line) {
        var audiotypes = line.match(/(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/);
        var bots = line.match(/(googlebot|Googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|Slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|Baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/);
        if (audiotypes && !bots) {
            var buff = line.split(/[ ]+/);
            $$.uniqueIPList.push(buff[8]);
        }
    },

    createUniqueIPFilePath: function() {
        var url = $$.destinationFile,
            mystring = "uniqueIPs",
            indexofLastSlash = url .lastIndexOf('/'),
            indexofLastDecimal = url .lastIndexOf('.');

        $$.uniqueIPListFile = url.substring(0, indexofLastSlash + 1) + mystring + url.substring(indexofLastDecimal);
        // console.log(new_url);
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
        $$.uniqueIPList = underscore.uniq($$.uniqueIPList);
    },


    stringifyMutatedData: function() {
        'use strict';
        $$.finalJSON = JSON.stringify($$.cleanedData);
    }
};

var s = fs.createReadStream($$.sourceFile)
    .on('error', function() {
        'use strict';
        $$.checkArguments();
    })
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
            'use strict';
            s.pause();
            (function() {
                $$.parseJSONforAudioReferences(line);
                $$.extractUniqueIPs(line);
                $$.lineNr += 1;
                s.resume();
            })();
        })
        .on('end', function() {
            'use strict';
            Promise.all(
                [
                    $$.checkArguments(),
                    $$.rebuildArray(),
                    $$.removeDuplicatesFromMutatedData(),
                    $$.createUniqueIPFilePath(),
                    $$.stringifyMutatedData()
                ]
            ).then(function() {
                fs.writeFileSync($$.destinationFile, $$.finalJSON);
                fs.writeFileSync($$.uniqueIPListFile, $$.uniqueIPList);

                var srcSize = fs.statSync($$.sourceFile),
                    destSize = fs.statSync($$.destinationFile),
                    ipListSize = fs.statSync($$.uniqueIPListFile);

                // ORIGINAL CONSOLE.LOG
                // ====================
                // console.log(colors.green(colors.bold('\n\t   ' + 'Matched ' + colors.red($$.matchCount) + ' entries.'))); console.log(colors.green(colors.bold('\t   ' + 'Unique IPs ' + colors.red($$.uniqueIPList.length)))); console.log(colors.bold('\nreading from:\t' + colors.yellow($$.sourceFile) + '\tSize: ' + srcSize['size'] / 1000000.0 + 'mb')); console.log(colors.bold('    ' + 'wrote to:\t' + colors.yellow($$.destinationFile) + '\tSize: ' + destSize['size'] / 1000.0 + 'kb')); console.log(colors.bold('    ' + 'IPs wrote:\t' + colors.yellow($$.uniqueIPListFile) + '\tSize: ' + ipListSize['size'] / 1000.0 + 'kb'));

                var _horizontalLine_ = { description: '   ------------'.gray, value: '-----------------------'.gray, filesize: '---------'.gray };
                var data = [
                    {
                        description: colors.green(colors.bold('   IPs Wrote To')),
                        value: colors.yellow($$.uniqueIPListFile),
                        filesize: colors.magenta(colors.bold(ipListSize['size'] / 1000.0 + 'kb'))
                    }, {
                        description: colors.green(colors.bold('   Reading From')),
                        value: colors.yellow($$.sourceFile),
                        filesize: colors.magenta(colors.bold(srcSize['size'] / 1000000.0 + 'mb'))
                    }, {
                        description: colors.green(colors.bold('   Wrote To')),
                        value: colors.yellow($$.destinationFile),
                        filesize: colors.magenta(colors.bold(destSize['size'] / 1000.0 + 'kb'))
                    }, {
                        description: colors.green(colors.bold('   Matched Entries')),
                        value: colors.yellow($$.matchCount)
                    }, {
                        description: colors.green(colors.bold('   Unique IPs')),
                        value: colors.yellow($$.uniqueIPList.length)
                    }
                ];

                console.log('\n\n');
                console.log(columnify(data, {
                    columnSplitter: colors.gray('   |   '),
                    config: {
                        description: { headingTransform: function(heading) { return colors.white(colors.bold(colors.hidden('   ' + heading.toUpperCase()))) } },
                        value: { headingTransform: function(heading) { return colors.white(colors.bold(colors.hidden(heading.toUpperCase()))) } },
                        filesize: { headingTransform: function(heading) { return colors.white(colors.bold(colors.hidden(heading.toUpperCase()))) } }
                    }
                }));
                console.log('\n');
            });

        })
    )
;
