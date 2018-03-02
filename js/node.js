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


//applying promise to calculate the different part of speech of base and store in array
function calculate_speech_base(document) {
	return new Promise((resolve, reject) => {
	
		var noun=0;
var verb=0;
var adverb=0;
var adjective=0;
var i=0;
		var rl = readline.createInterface({
      input : fs.createReadStream('../document/document.txt'),
      output: process.stdout,
      terminal: false
})
rl.on('line',function(line){
    // console.log(i+""+line) //or parse line
	i++;
	var splitted_array=line.split(" ");
	//console.log(splitted_array);
	var output=tagger.tag(splitted_array);
//console.log(output.length);
	for(i=0;i<output.length;i++){
	//console.log(output[i]);
var x=output[i].join();
var y=x.split(",");
//console.log(y[1]);
if(y[1]=="NN")
	{
	//	console.log("noun");
		noun++;
	}
	if(y[1]=="VB")
	{
	//	console.log("verb");
		verb++;
	}
	if(y[1]=="JJ")
	{
	//	console.log("adjective");
		adjective++;
	}
	if(y[1]=="RB")
	{
	//	console.log("adverb");
		adverb++;
	}

}
	standard_token_array[0] =noun;
	standard_token_array[1] =adjective;
	standard_token_array[2] =verb;
	standard_token_array[3] =adverb;
	//console.log(noun+" "+verb+" "+adjective+" "+adverb);
	resolve("completed");
	
})

		

		var n = 0;
		if (n == 1) {
			reject("failed");

		}
	});
}


//then of function calculate_token_base in this calling function calculate_token_standard
calculate_speech_base(standard_document).then((message) => {
		function calculate_speech_my(document) {
			return new Promise((resolve, reject) => {
		
				var noun=0;
var verb=0;
var adverb=0;
var adjective=0;
var i=0;
		var rl = readline.createInterface({
      input : fs.createReadStream('../document/document2.txt'),
      output: process.stdout,
      terminal: false
})
rl.on('line',function(line){
     //console.log(i+""+line) //or parse line
	i++;
	var splitted_array=line.split(" ");
//	console.log(splitted_array);
	var output=tagger.tag(splitted_array);
//console.log(output.length);
	for(i=0;i<output.length;i++){
	//console.log(output[i]);
var x=output[i].join();
var y=x.split(",");
//console.log(y[1]);
if(y[1]=="NN")
	{
	//	console.log("noun");
		noun++;
	}
	if(y[1]=="VB")
	{
		//console.log("verb");
		verb++;
	}
	if(y[1]=="JJ")
	{
		//console.log("adjective");
		adjective++;
	}
	if(y[1]=="RB")
	{
	//	console.log("adverb");
		adverb++;
	}

}
	mydocument_token_array[0] =noun;
	mydocument_token_array[1] =adjective;
	mydocument_token_array[2] =verb;
	mydocument_token_array[3] =adverb;
	//console.log(noun+" "+verb+" "+adjective+" "+adverb);
	resolve("completed");
	
})

				var n = 0;
				if (n == 1) {
					reject("failed");

				}
			});
		}


		//then of function calculate_token_standard once it completes performing the other tasks
		calculate_speech_my(my_document).then((message) => {
				//calling token variation method
				calculate_token_variation();
				//creating the json
				json_creation();
			})
			.catch((message) => {

				console.log("****************Failed**********************");
			});


	})
	.catch((message) => {

		console.log("****************Failed**********************");
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
			no_of_words: {
				standard: countwords_standard,
				user_doc: countwords_my
			},

			word_limit_ok: is_word_limit_ok,
			remark_to_reject: remark_to_reject_due_to_count,
			similarity_btw_document: similarity,
			spelling: {
				no_of_mistakes: mistakes,
				incorrect_words: incorrectWords
			},
			core_concept: {
				no_extra_marks: extra_marks_given,
				concept_covered: concept_covered
			},
			part_of_speech: {
				standard_speech: standard_token_array,
				user_doc_speech: mydocument_token_array
			},
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
			console.log("error");
			return;
		}
		console.log("success");
	})
}
