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
var splitted_array="It facili".split(" ");
var output=tagger.tag(splitted_array);
console.log(output);