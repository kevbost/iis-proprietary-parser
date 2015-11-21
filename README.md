# iis-proprietary-parser

NOTE: THIS PROJECT IS A MESS AND IS DEPRECIATED, NEW ISS PARSER LOCATED AT `link to be determined`

Proprietary IIS log parser creating a JSON object that matches specific criteria of audiofiles &amp;&amp; !bots.  Written in node.

# why
I got interested in the topic of parsing txt files that look like this:

```
#Date: 2030-10-01 00:00:10
#Fields: date time stuff interesting-stuff boring-stuf
2030-06-02 00:00:10 stuffy-stuff superinteresting.jpg nothing-to-see-here
2030-06-02 00:00:10 stuffidy-stuff wowthisisinterestingstuff.png nothing-to-see-here-either
```

A podcast I listen to was kind enough to lend me their IIS logs.
IIS logs are massive and kind of hard to get anything useful out of as .txt files on a hard drive.  In my case, I wanted to know how many times audio files with certain keywords were downloaded by anything that is not a bot.

 

# how
I was able to do that with a bit of regex and a list of known webcrawlers.

```
var audiotypes = line.match(/(\.mp3|\.m4a|\.aac|\.mp4|\.m4p|\.m4r|\.3gp|\.ogg|\.oga|\.wma|\.wav|\.flac)/);
var bots = line.match(/(somebot|anotherbot|somebotagain)/);
if (audiotypes && !bots) . . .  
```

If a match is found, the line is `.split(/[ ]+/);` into a new array and pushed to a global master array.

After all of that is done and the new array is built, the whole thing needs to be mutated into usable key:value pairs.

```
var data = [["key1", "key2", "key3"], ["value1", "value2", "value3"], ["value4", "value5", "value6"]];
var mutatedData = [];
    
for (var i = 1; i < data.length; i++) {
  var bufferObject = {};
  for (var x = 0; x < data[0].length; x++) {
    var jsonKey = data[0][x];
    bufferObject[jsonKey] = data[i][x];
  }
  mutatedData.push(bufferObject);
}
mutatedData;
```

That junk works, you can paste that block into your javascript console.  An array that once looked like `[[key1, key2, key3], [value1, value2, value3], [value4, value5, value6]]` now looks like:


```
[
  {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  },{
    "key1": "value4",
    "key2": "value5",
    "key3": "value6"
  }
]
```

Otherwise known as "magic".

 

# usage
`$ node mincer.js path/to/read-src.log.txt path/to/write-file.json`

This code SHOULD be able to pull the key from the IIS log header -- then use that key to build an array of objects.

All objects are scrubbed and anywhere that **time** and **cs-uri-stem** (file path) match identically to one or more objects, duplicates are removed.
This means that unique IP's are not counted -- a user may download multiple audiofiles from the same place within the span of a logfile.
