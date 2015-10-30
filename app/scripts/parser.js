// ORIGINAL PROTOTYPE, DEPRECIATED

var fs = require('fs'),
    util = require('util'),
    stream = require('stream'),
    es = require("event-stream");

var lineNr = 1,
    count = 0,
    pocketcasts = 0,
    podcastaddict = 0,
    itunes = 0,
    sarcastic = 0,
    applecoremedia = 0,
    pah = 0,
    mp4 = 0,
    m4a = 0,
    mp3 = 0;


s = fs.createReadStream('../logs/1509.log.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {

            // pause the readstream
            s.pause();

            lineNr += 1;

            (function() {

                count += 1;

                var audiotypes = line.indexOf("mp3") >= 0 || line.indexOf("mp4") >= 0 || line.indexOf("m4a") >= 0;
                var bots = line.indexOf("Googlebot") >= 0 || line.indexOf("baidu") >= 0;

                // if (!bots && audiotypes) {
                //     if (line.indexOf("sarcastic") >= 0){ sarcastic +=1}
                //     else if (line.indexOf("pah") >= 0 ){ pah +=1}
                // }

                if (line.indexOf("svpodcast") >= 0 && audiotypes) {
                    if (!bots) {
                        sarcastic += 1;
                    }
                } else if (line.indexOf("pah") >= 0 && audiotypes) {
                    if (bots) {
                    } else {
                        pah += 1;
                    }
                }

                if (line.indexOf("itunes") >= 0 && audiotypes) {
                    // fs.appendFileSync("../logs/output.txt", line.toString() + "\n");
                    if (bots) {
                    } else {
                        itunes += 1;
                    }
                } else if (line.indexOf("Pocket+Casts") >= 0 && audiotypes) {
                    if (bots) {
                    } else {
                        pocketcasts += 1;
                    }
                } else if (line.indexOf("Podcast+Addict") >= 0 && audiotypes) {
                    if (bots) {
                    } else {
                        podcastaddict += 1;
                    }
                } else if (line.indexOf("AppleCoreMedia") >= 0 && audiotypes) {
                    if (bots) {
                    } else {
                        applecoremedia += 1;
                    }
                }

                if (line.indexOf("mp3") >= 0) {
                    if (bots) {
                    } else {
                        mp3 += 1;
                    }
                } else if (line.indexOf("mp4") >= 0) {
                    if (bots) {
                    } else {
                        mp4 += 1;
                    }
                } else if (line.indexOf("m4a") >= 0) {
                    if (bots) {
                    } else {
                        m4a += 1;
                    }
                }

                s.resume();

            })();
        })
        .on('error', function() {
            console.log('Error while reading file.');
        })
        .on('end', function() {

            console.log(' ')
            console.log('Total lines: ' + count)
            console.log(' ')
            console.log('itunes: ' + itunes)
            console.log('pocketcasts: ' + pocketcasts)
            console.log('podcastaddict: ' + podcastaddict)
            console.log('AppleCoreMedia Occurrences: ' + applecoremedia)
            console.log(' ')
            console.log('sarcastic voyage: ' + sarcastic)
            console.log('the post atomic horror: ' + pah)
            console.log(' ')
            console.log('mp3: ' + mp3)
            console.log('mp4: ' + mp4)
            console.log('m4a: ' + m4a)
        })
);
