module.exports = ({
	rebuildArray: function() {
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
	},

	parseJSONforAudioReferences: function(line) {
		// FILTERS DOWN AUDIOFILES AND REMOVES KNOWN BOTS
		// ==============================================
		var audiotypes = line.indexOf(".mp3") >= 0 || line.indexOf(".mp4") >= 0 || line.indexOf(".m4a") >= 0;
		var bots = line.indexOf("Googlebot") >= 0 || line.indexOf("baidu") >= 0;

		// ADD "&& COUNT <= NUMBER" TO THIS END BECAUSE 100,000+ LINE FILES
		// ================================================================
		if (audiotypes && !bots) {
			// CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO DATA ARRAY
			// ===========================================================
			var a = line.split(/[ ]+/);
			// ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
			// ================================================================================
			a.push('id_' + (__.uniqueId() - 1));
			data.push(a);
		}
	},

	convertEntireLogFileToJSONEliminatingHeaders: function(line) {

		// FILTERS DOWN AUDIOFILES AND REMOVES KNOWN BOTS
		// CHANGED TO LINE.MATCH REGEX FOR DRYNESS && EXTENDABLILITY
		// USED TO BE line.indexOf(".mp3") >= 0 || line.indexOf(".mp4") >= 0 || line.indexOf(".m4a") >= 0;
		// ===============================================================================================
		var audiotypes = line.match(/(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/);
		var bots = line.match(/(googlebot|Googlebot-Mobile|Googlebot-Image|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon|httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)/);

		// ADD "&& COUNT <= NUMBER" TO THIS END BECAUSE 100,000+ LINE FILES
		// ================================================================
		if (audiotypes && !bots) {
			// CREATE NEW ARRAY BY SPLITTING BY SPACES, PUSH TO DATA ARRAY
			// ===========================================================
			var arr = line.split(/[ ]+/);
			matchCount += 1;
			// ADD A UNIQUE ID TO EACH OBJECT, PUSHED TO THE END, MAPPING TO THE LAST KEY VALUE
			// ================================================================================
			arr.push('id_' + (__.uniqueId() - 1));
			data.push(arr);

		}

		// console.log(bots)
	}
})
