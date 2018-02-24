//function to fire http-request
function getData() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://localhost:3000/db";
	xmlhttp.open("GET", url, true);
	//sending the http-request
	xmlhttp.send();

	xmlhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var myarr = JSON.parse(this.responseText);
			//retriving the different data and storing it into the variable
			var no_of_words_standard = JSON.stringify(myarr.myjsonobj.no_of_words.standard);
			var no_of_words_user = JSON.stringify(myarr.myjsonobj.no_of_words.user_doc);
			var word_limit_ok = JSON.stringify(myarr.myjsonobj.word_limit_ok);
			var remark_to_reject = JSON.stringify(myarr.myjsonobj.remark_to_reject);
			var similarity = JSON.stringify(myarr.myjsonobj.similarity_btw_document);
			var no_of_mistakes = JSON.stringify(myarr.myjsonobj.spelling.no_of_mistakes);
			var incorrect_words = JSON.stringify(myarr.myjsonobj.spelling.incorrect_words);
			var extra_marks = JSON.stringify(myarr.myjsonobj.core_concept.no_extra_marks);
			var concept_covered = JSON.stringify(myarr.myjsonobj.core_concept.concept_covered);
			var part_of_speech_standard_noun = JSON.stringify(myarr.myjsonobj.part_of_speech.standard_speech[0]);
			var part_of_speech_standard_adjective = JSON.stringify(myarr.myjsonobj.part_of_speech.standard_speech[1]);
			var part_of_speech_standard_verb = JSON.stringify(myarr.myjsonobj.part_of_speech.standard_speech[2]);
			var part_of_speech_standard_adverb = JSON.stringify(myarr.myjsonobj.part_of_speech.standard_speech[3]);
			var part_of_speech_userdoc_noun = JSON.stringify(myarr.myjsonobj.part_of_speech.user_doc_speech[0]);
			var part_of_speech_userdoc_adjective = JSON.stringify(myarr.myjsonobj.part_of_speech.user_doc_speech[1]);
			var part_of_speech_userdoc_verb = JSON.stringify(myarr.myjsonobj.part_of_speech.user_doc_speech[2]);
			var part_of_speech_userdoc_adverb = JSON.stringify(myarr.myjsonobj.part_of_speech.user_doc_speech[3]);
			var part_of_speech_variation_noun = JSON.stringify(myarr.myjsonobj.part_of_speech_variation.noun_variation);
			var part_of_speech_variation_adjective = JSON.stringify(myarr.myjsonobj.part_of_speech_variation.adjective_variation);
			var part_of_speech_variation_verb = JSON.stringify(myarr.myjsonobj.part_of_speech_variation.verb_variation);
			var part_of_speech_variation_adverb = JSON.stringify(myarr.myjsonobj.part_of_speech_variation.adverb_variation);

			//logic to calculate the % and total marks
			var temp = 0;
			if (part_of_speech_variation_noun > 60 && part_of_speech_variation_noun < 80 || part_of_speech_variation_adjective > 60 && part_of_speech_variation_adjective < 80 || part_of_speech_variation_verb > 60 && part_of_speech_variation_verb < 80 || part_of_speech_variation_adverb > 60 && part_of_speech_variation_adverb < 80) {
				temp = temp - 10;
			} else if (part_of_speech_variation_noun > 40 && part_of_speech_variation_noun < 60 || part_of_speech_variation_adjective > 40 && part_of_speech_variation_adjective < 60 || part_of_speech_variation_verb > 60 && part_of_speech_variation_verb < 60 || part_of_speech_variation_adverb > 40 && part_of_speech_variation_adverb < 60) {
				temp = temp - 20;
			} else if (part_of_speech_variation_noun < 40 || part_of_speech_variation_adjective < 40 || part_of_speech_variation_verb < 40 || part_of_speech_variation_adverb < 40) {
				temp = temp - 30;
			}
			//calculating result
			var result = (500 - parseInt(no_of_mistakes) + temp) + parseInt(extra_marks);
			document.getElementById('overall').innerHTML = result;
			//calculating percentage
			var percentage1 = result / 5;
			document.getElementById('percentage').innerHTML = percentage1;

			//setting all the variables to the html page
			document.getElementById('no_of_words_standard1').innerHTML = no_of_words_standard;
			document.getElementById('no_of_words_user1').innerHTML = no_of_words_user;
			document.getElementById('word_limit_ok1').innerHTML = word_limit_ok;
			document.getElementById('remark_to_reject1').innerHTML = remark_to_reject;
			document.getElementById('similarity1').innerHTML = similarity;
			document.getElementById('no_of_mistakes1').innerHTML = no_of_mistakes;
			document.getElementById('incorrect_words1').innerHTML = incorrect_words;
			document.getElementById('extra_marks1').innerHTML = extra_marks;
			document.getElementById('concept_covered1').innerHTML = concept_covered;
			document.getElementById('part_of_speech_standard_noun1').innerHTML = part_of_speech_standard_noun;
			document.getElementById('part_of_speech_standard_adjective1').innerHTML = part_of_speech_standard_adjective;
			document.getElementById('part_of_speech_standard_verb1').innerHTML = part_of_speech_standard_verb;
			document.getElementById('part_of_speech_standard_adverb1').innerHTML = part_of_speech_standard_adverb;
			document.getElementById('part_of_speech_userdoc_noun1').innerHTML = part_of_speech_userdoc_noun;
			document.getElementById('part_of_speech_userdoc_adjective1').innerHTML = part_of_speech_userdoc_adjective;
			document.getElementById('part_of_speech_userdoc_verb1').innerHTML = part_of_speech_userdoc_verb;
			document.getElementById('part_of_speech_userdoc_adverb1').innerHTML = part_of_speech_userdoc_adverb;
			document.getElementById('part_of_speech_variation_noun1').innerHTML = part_of_speech_variation_noun;
			document.getElementById('part_of_speech_variation_adjective1').innerHTML = part_of_speech_variation_adjective;
			document.getElementById('part_of_speech_variation_verb1').innerHTML = part_of_speech_variation_verb;
			document.getElementById('part_of_speech_variation_adverb1').innerHTML = part_of_speech_variation_adverb;
		}
	};
}