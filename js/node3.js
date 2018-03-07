//declaration of different libraries to be used 
var fs = require('fs');
var path = require("path");
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var WordPOS = require('wordpos');
wordpos = new WordPOS();
var stringSimilarity = require('string-similarity');
readline = require('readline');

//required to find the part of speech
var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

//each variable is stored in a json at the end 

//variables to store part of speech % coverage
var noun_covered = 0;
var adjectives_covered = 0;
var verbs_covered = 0;
var adverbs_covered = 0;

//variable to store work limit status
var is_word_limit_ok;

//array to store differnt parts of speech
var mydocument_token_array = new Array();
var standard_token_array = new Array();

//variable to store similarity
var similarity = 0;

//variable to store no of mistakes
var mistakes = 0;

//array to store all the mistakes
var incorrectWords = new Array();

//variable to store extra marks given
var extra_marks_given = 0;

//array to store all the concept covered
var concept_covered = new Array();

//varible to store remark to reject
var remark_to_reject_due_to_count = 'None';


//reading files required
//reading base document
var my_document = fs.readFileSync('../document/document.txt', 'utf-8');
//reading source document
var standard_document = fs.readFileSync('../document/document2.txt', 'utf-8');
//reading keywords
var keyWords = fs.readFileSync('../document/keyWords.txt', 'utf-8');
//reading dictionary
var dictionary = fs.readFileSync('../document/dictionary.txt', 'utf-8');


//counting words of user document and standard document
var countwords_my = my_document.length;
var countwords_standard = standard_document.length;

//function to check word limit
function check_word_limit() {
	//formula to calculate range variation
	var range1 = countwords_standard - countwords_standard * 0.1; //What is this formulae for?
	var range2 = countwords_standard + countwords_standard * 0.1;
	if (countwords_my < range1 || countwords_my > range2) {
		is_word_limit_ok = "No";
		if (countwords_my < range1) {
			remark_to_reject_due_to_count = "Words are less then expected.";
		} else {
			remark_to_reject_due_to_count = "Words are more then expected.";
		}
		return;
	} else {
		is_word_limit_ok = "yes";
		remark_to_reject_due_to_count = "None";
	}
}

//calculate the part of speech for base and standard document
function calculate_part_moudule(path_to_file, count) {
	console.log("inside"+count);
	var noun = 0;
	var verb = 0;
	var adverb = 0;
	var adjective = 0;
	var i;
	var rl = readline.createInterface({
		input: fs.createReadStream(path_to_file),
		output: process.stdout,
		terminal: false
	})
	rl.on('line', function (line) {
		var splitted_array = line.split(" ");
		var output = tagger.tag(splitted_array);
		for (i = 0; i < output.length; i++) {
			var combined_string = output[i].join();
			var splitting_by_comma = combined_string.split(",");
			//based on part of speech increasing the counter
			if (splitting_by_comma[1] == "NN") {
				noun++;
			}
			if (splitting_by_comma[1] == "VB") {
				verb++;
			}
			if (splitting_by_comma[1] == "JJ") {
				adjective++;
			}
			if (splitting_by_comma[1] == "RB") {
				adverb++;
			}

		}
		if (count == 1) {
			standard_token_array[0] = noun;
			standard_token_array[1] = adjective;
			standard_token_array[2] = verb;
			standard_token_array[3] = adverb;
		} else {
			mydocument_token_array[0] = noun;
			mydocument_token_array[1] = adjective;
			mydocument_token_array[2] = verb;
			mydocument_token_array[3] = adverb;
		}
	})
	
}
var promises = [];
//applying promise to calculate the different part of speech of base and store in array
function calculate_speech_base() {
	return new Promise((resolve, reject) => {
		calculate_part_moudule('../document/document.txt', 1);
		resolve("completed");
		console.log("already going2");
		var n = 0;
	if (n == 1) {
		reject("failed");
	}
	});	
}

function calculate_speech_my() {
	return new Promise((resolve, reject) => {
		calculate_part_moudule('../document/document2.txt', 2);
		resolve("completed");
		console.log("already going2");
		var n = 0;
	if (n == 1) {
		reject("failed");
	}
	});
}

promises.push(calculate_speech_base);
promises.push(calculate_speech_my);
	Promise.all(promises).then(function(value) { 
				//calling token variation method
		console.log("hi")
				calculate_token_variation();
				//creating the json
				json_creation();
    });			

//function to print noun, adjectieves, verb, adverb of user document
function print_mydocument_token() {
	for (var i = 0; i < 4; i++) {
		//	console.log("Reading your file");
		console.log(mydocument_token_array[i]);
	}
}

//function to print noun, adjectieves, verb, adverb of standard document
function print_standard_token() {
	for (var i = 0; i < 4; i++) {
		//	console.log("Reading standard file");
		console.log(standard_token_array[i]);
	}
}

//function to calculate % difference in noun, adjectieves, verb, adverb of user document and standard document
function calculate_token_variation() {
	noun_covered = ((standard_token_array[0] - mydocument_token_array[0]) / standard_token_array[0]) * 100;
	adjectives_covered = ((standard_token_array[1] - mydocument_token_array[1]) / standard_token_array[1]) * 100;
	verbs_covered = ((standard_token_array[2] - mydocument_token_array[2]) / standard_token_array[2]) * 100;
	adverbs_covered = ((standard_token_array[3] - mydocument_token_array[3]) / standard_token_array[3]) * 100;

}

//function to calculate similarity between user document and standard document
function calculate_similarity() {
	similarity = (stringSimilarity.compareTwoStrings(my_document, standard_document)) * 100;
}


//function to check spelling from dictionary
function checking_spelling() {
	var token_dictionary = tokenizer.tokenize(dictionary);
	var token_mydocument = tokenizer.tokenize(my_document);
	var spellcheck = new natural.Spellcheck(token_dictionary);

	for (i in token_mydocument) {
		if (!spellcheck.isCorrect(token_mydocument[i].toLowerCase())) {
			mistakes++;
			incorrectWords.push(token_mydocument[i]);
		}
	}
}

//fuction to check some keywords are present or not
function checking_keywords() {

	var token_mydocument = tokenizer.tokenize(my_document);
	var token_keywords = tokenizer.tokenize(keyWords);
	var spellcheck = new natural.Spellcheck(token_mydocument);

	for (i in token_keywords) {
		if (spellcheck.isCorrect(token_keywords[i].toLowerCase())) {
			extra_marks_given++;
			concept_covered.push(token_keywords[i]);
		}
	}
}

//calling the various function to see the output
check_word_limit();
calculate_similarity();
checking_spelling();
checking_keywords();

//function to create json
function json_creation() {
	var output = {
		myjsonobj: {
			//adding no of words
			no_of_words: {
				standard: countwords_standard,
				user_doc: countwords_my
			},
			//adding word limit and remark
			word_limit_ok: is_word_limit_ok,
			remark_to_reject: remark_to_reject_due_to_count,
			similarity_btw_document: similarity,
			//adding spelling mistakes
			spelling: {
				no_of_mistakes: mistakes,
				incorrect_words: incorrectWords
			},
			//adding concepts covered
			core_concept: {
				no_extra_marks: extra_marks_given,
				concept_covered: concept_covered
			},
			//adding part of speech
			part_of_speech: {
				standard_speech: standard_token_array,
				user_doc_speech: mydocument_token_array
			},
			//adding variation
			part_of_speech_variation: {
				noun_variation: Math.abs(noun_covered),
				adjective_variation: Math.abs(adjectives_covered),
				verb_variation: Math.abs(verbs_covered),
				adverb_variation: Math.abs(adjectives_covered)
			}
		}
	};

	//converting json object to string and stroing in file
	var json = JSON.stringify(output, null, 2);
	fs.writeFile('../json/myjsondata.json', json, 'utf8', (err) => {
		if (err) {
			//in case of error
			console.log("error");
			return;
		}
		//in case of success
		console.log("success");
	})
}