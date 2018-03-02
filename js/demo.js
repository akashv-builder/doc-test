var natural = require("natural");
var path = require("path");
var fs = require('fs');

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

var sentence = fs.readFileSync('document.txt', 'utf-8'); 
/*
var noun=0;
var verb=0;
var adverb=0;
var adjective=0;
var i=0;
var fs = require('fs'),
    readline = require('readline');
var rl = readline.createInterface({
      input : fs.createReadStream('document.txt'),
      output: process.stdout,
      terminal: false
})
rl.on('line',function(line){
     console.log(i+""+line) //or parse line
	i++;
	var splitted_array=line.split(" ");
	console.log(splitted_array);
	var output=tagger.tag(splitted_array);
console.log(output.length);
	for(i=0;i<output.length;i++){
	console.log(output[i]);
var x=output[i].join();
var y=x.split(",");
console.log(y[1]);
if(y[1]=="NN")
	{
		console.log("noun");
		noun++;
	}
	if(y[1]=="VB")
	{
		console.log("verb");
		verb++;
	}
	if(y[1]=="JJ")
	{
		console.log("adjective");
		adjective++;
	}
	if(y[1]=="RB")
	{
		console.log("adverb");
		adverb++;
	}

}
	console.log(noun+" "+verb+" "+adjective+" "+adverb);
	
})
*/


var natural = require("natural");
var path = require("path");
var fs = require('fs');

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);
var splitted_array="I think this world is full of chutiya Financially".split(" ");
var output=tagger.tag(splitted_array);
console.log(output);
console.log(output.length);
/*
for(i=0;i<output.length;i++){
	console.log(output[i]);
var x=output[i].join();
var y=x.split(",");
console.log(y[1]);
if(y[1]=="NN")
	{
		console.log("noun");
	}
	if(y[1]=="VB")
	{
		console.log("verb");
	}
	if(y[1]=="JJ")
	{
		console.log("adjective");
	}
	if(y[1]=="RB")
	{
		console.log("adverb");
	}

}
*/

//NN-noun, VB-verb, JJ-adjective RB-adverb