// generated on 2015-10-29 using generator-gulp-webapp 1.0.3
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import {stream as wiredep} from 'wiredep';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
var es = require('event-stream');
var fs = require('fs');
var underscore = require('underscore');

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
  .pipe($.plumber())
  .pipe($.sourcemaps.init())
  .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
  }).on('error', $.sass.logError))
  .pipe($.autoprefixer({browsers: ['last 1 version']}))
  .pipe($.sourcemaps.write())
  .pipe(gulp.dest('.tmp/styles'))
  .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
};
}
const testLintOptions = {
  env: {
    mocha: true
}
};

const distLintOptions = {
  rules: {
      'eqeqeq': 0,
      'strict': 2,
      'no-unused-vars': 0,
      'dot-notation': 0
  }
};

gulp.task('lint', lint('app/scripts/**/*.js', distLintOptions));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

gulp.task('html', ['styles'], () => {
  const assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
  .pipe(assets)
  .pipe($.if('*.js', $.uglify()))
  .pipe($.if('*.css', $.minifyCss({compatibility: '*'})))
  .pipe(assets.restore())
  .pipe($.useref())
  .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
  .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
  .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
  }))
  .on('error', function (err) {
      console.log(err);
      this.end();
  })))
  .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')({
    filter: '**/*.{eot,svg,ttf,woff,woff2}'
}).concat('app/fonts/**/*'))
  .pipe(gulp.dest('.tmp/fonts'))
  .pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'fonts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
    }
}
});

  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    '.tmp/fonts/**/*'
    ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('bower.json', ['wiredep', 'fonts']);
  gulp.watch('app/scripts/**/*.js', ['lint']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
  }
});
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/bower_components': 'bower_components'
    }
}
});

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
  .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
  }))
  .pipe(gulp.dest('app/styles'));

  gulp.src('app/*.html')
  .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
  }))
  .pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});


// ========================
//
// ========================

var lineNr = 1,
    count = 0,
    matchCount = 0;

var data = [
    ['date', 'time', 's-ip', 'cs-method', 'cs-uri-stem', 'cs-uri-query', 's-port', 'cs-username', 'c-ip', 'cs(User-Agent)', 'cs(Cookie)', 'cs(Referer)', 'sc-status', 'sc-substatus', 'sc-win32-status', 'sc-bytes', 'cs-bytes', 'time-taken', 'unique-id']
];

var rebuildArray = function() {
    'use strict';
    // _.without(arr, '#Fields:')
    // remove '#Fields' from array to build dynamic IIS Key
    // ====================================================

    var newData = [];

    for (var i = 1; i < data.length; i++) {
        var jsonVariable = {};
        for (var x = 0; x < data[0].length; x++) {
            var jsonKey = data[0][x];
            jsonVariable[jsonKey] = data[i][x];
        }
        newData.push(jsonVariable);
    }
    return newData;
};

var tools = {
    parseJSONforAudioReferences: function(line){
        'use strict';
        // FILTERS DOWN AUDIOFILES AND REMOVES KNOWN BOTS
        // CHANGED TO LINE.MATCH REGEX FOR DRYNESS && EXTENDABLILITY
        // USED TO BE line.indexOf(".mp3") >= 0 || line.indexOf(".mp4") >= 0 || line.indexOf(".m4a") >= 0;
        // ===============================================================================================
        var audiotypes = line.match( /(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/ );
        var bots = line.match( /(googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/ );

        // ADD "IF (COUNT <= NUMBER)" TO THIS BECAUSE 100,000+ LINE FILES
        // ==============================================================
        if (audiotypes && !bots){
            // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO DATA ARRAY
            // ===========================================================
            var arr = line.split(/[ ]+/);
            matchCount += 1;
            // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
            // ================================================================================
            arr.push('id_' + (underscore.uniqueId() - 1));
            data.push(arr);
        }
    },

    convertEntireLogFileToJSONEliminatingHeaders: function(line){
        'use strict';
        // ADD "IF (COUNT <= NUMBER)" TO THIS BECAUSE 100,000+ LINE FILES U KNO?
        // =====================================================================
        if (line.indexOf('#') === 0) {
            // CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO DATA ARRAY
            // ===========================================================
            var arr = line.split(/[ ]+/);
            matchCount += 1;
            // ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
            // ================================================================================
            arr.push('id_' + (underscore.uniqueId() - 1));
            data.push(arr);
        }
    }
};

gulp.task('testrun', () => {
    var s = fs.createReadStream('./app/logs/1510.log.txt', function(){
        console.log('yes');
    })
    .pipe(es.split())
    .pipe(es.mapSync(function(line) {
        s.pause();
        // CURRENT LINE NUMBER
        // ===================
        lineNr += 1;
        (function() {
            count += 1;
            // PARSE DOWN AND RETURN ONLY AUDIOFILES W/O BOTS
            // =================================================
            tools.parseJSONforAudioReferences(line);

            // CONVERT ENTIRE FILE TO JSON ELIMINATING #HEADERS
            // =================================================
            /*convertEntireLogFileToJSONEliminatingHeaders(line);*/

            s.resume();
        })()
    }))
    .on('end', function() {

        console.log(lineNr, count)
        console.log('Matched ' + matchCount + ' entries.');
        fs.writeFileSync('./TEMPORARY.json', newOutput);
    })
});
