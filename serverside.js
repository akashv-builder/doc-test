//declaration of different libraries to be used 
var fs = require('fs');
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var wordcount = require('word-count');
var WordPOS = require('wordpos');
wordpos = new WordPOS();
var stringSimilarity = require('string-similarity');

//variables to store part of speech % coverage
var noun_covered = 0;
var adjectives_covered = 0;
var verbs_covered = 0;
var adverbs_covered = 0;

//variable to store work limit status
var is_word_limit_ok;

//array to store differnt parts of speech
var mydocument_token_array = new Array(4);
var standard_token_array = new Array(4);

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
var remark_to_reject_due_to_count = 'null';


//reading files required
//reading base document
var my_document = fs.readFileSync('document.txt', 'utf-8');
//reading source document
var standard_document = fs.readFileSync('document2.txt', 'utf-8');
//reading keywords
var keyWords = fs.readFileSync('keyWords.txt', 'utf-8');
//reading dictionary
var dictionary = fs.readFileSync('dictionary.txt', 'utf-8');


//counting words of user document and standard document
var countwords_my = wordcount(my_document);
var countwords_standard = wordcount(standard_document);

//function to check word limit
function check_word_limit() {
	//formula to calculate range variation
	var range1 = countwords_standard - countwords_standard * 0.1;
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
	}
}

//applying promise to calculate the different part of speech of base and store in array
function calculate_token_base(document) {
	return new Promise((resolve, reject) => {
		wordpos.getNouns(document, function (result) {
			standard_token_array[0] = result.length;
		});

		wordpos.getAdjectives(document, function (result) {
			standard_token_array[1] = result.length;
		});

		wordpos.getVerbs(document, function (result) {
			standard_token_array[2] = result.length;
		});

		wordpos.getAdverbs(document, function (result) {
			standard_token_array[3] = result.length;
			resolve("completed");
		});

		var n = 0;
		if (n == 1) {
			reject("failed");

		}
	});
}


//then of function calculate_token_base in this calling function calculate_token_standard
calculate_token_base(standard_document).then((message) => {
		function calculate_token_standard(document) {
			return new Promise((resolve, reject) => {
				wordpos.getNouns(document, function (result) {
					mydocument_token_array[0] = result.length;
				});

				wordpos.getAdjectives(document, function (result) {
					mydocument_token_array[1] = result.length;
				});

				wordpos.getVerbs(document, function (result) {
					mydocument_token_array[2] = result.length;
				});

				wordpos.getAdverbs(document, function (result) {
					mydocument_token_array[3] = result.length;
					resolve("completed");
				});

				var n = 0;
				if (n == 1) {
					reject("failed");

				}
			});
		}


		//then of function calculate_token_standard once it completes performing the other tasks
		function calculate_token_standard(my_document).then((message) => {
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
		//console.log("Reading your file");
		console.log(mydocument_token_array[i]);
	}
}

//function to print noun, adjectieves, verb, adverb of standard document
function print_standard_token() {
	for (var i = 0; i < 4; i++) {
		//console.log("Reading standard file");
		console.log(standard_token_array[i]);
	}
}

//function to calculate % difference in noun, adjectieves, verb, adverb of user document and standard document
function calculate_token_variation() {
	noun_covered = ((standard_token_array[0] - mydocument_token_array[0]) / standard_token_array[0]) * 100;
	adjectives_covered = ((standard_token_array[1] - mydocument_token_array[1]) / standard_token_array[1]) * 100;
	verbs_covered = ((standard_token_array[2] - mydocument_token_array[2]) / standard_token_array[2]) * 100;
	adverbs_covered = ((standard_token_array[3] - mydocument_token_array[3]) / standard_token_array[3]) * 100;
	console.log(noun_covered + " " + adjectives_covered + " " + verbs_covered + " " + adverbs_covered);

}

//function to calculate similarity between user document and standard document
function calculate_similarity() {
	similarity = (stringSimilarity.compareTwoStrings(my_document, standard_document)) * 100;
	console.log(similarity);
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
	console.log("These are the spelling mistakes you had : \n" + incorrectWords + "and you have these many mistakes \n: " + mistakes);
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

	// Why console.log in the final code?
	console.log("These are the concepts that you have covered :" + concept_covered);
	console.log("\nExtra marks for that :" + extra_marks_given);
}

//calling the various function to see the output
console.log(countwords_my);
console.log(countwords_standard);
check_word_limit();
console.log(is_word_limit_ok);
console.log(remark_to_reject_due_to_count);
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
				noun_variation: noun_covered,
				adjective_variation: adjectives_covered,
				verb_variation: verbs_covered,
				adverb_variation: adjectives_covered
			}
		}
	};

	
	//converting json object to string and stroing in file
	var json = JSON.stringify(output, null, 2);
	fs.writeFile('myjsondata.json', json, 'utf8', (err) => {
		if (err) {
			console.log("error");
			return;
		}
		console.log("success");
	})
}