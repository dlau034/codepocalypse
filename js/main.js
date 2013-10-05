var words = ['console', 'function', 'bracket', 'log', 'procedure'];
var score = 0;

// Populate the DOM with the words from the above array
function populateWithWords(callback) {

	for (var i in words) {		
		$('.words').append('<li id="word-'+i+'">'+words[i]+'</li>');
	}
	
	if (callback != undefined) {
		callback();
	}
}




/**
 * Listen to each key typed,
 * remove the word if correct,
 * stop the animation binded to it,
 * increase the score
 * and call the gravity for the next word
 */
$('#text-field').keyup(function(a) {
	if ($(this).val() == $('.words').find('li').first().html()) {				
		$('.words').find('li').first().stop().remove();
		
		$(this).val(''); //reset the field
		
		score++; // increase the score		
		$('.score').html(score); 
		
		gravity($('.words').find('li').first()); // call the gravity for the next word
	}
});




/**
 * Binds an animation to the given element
 * If the animation finished it means the word wasn't typed in correctly 
 * which means the score decreases by 1.
 */
function gravity(elm) {
		
	elm.animate({
		'top'	:  '100%',
	}, 5000, function(){
		
		score--; // decrease the score
		$('.score').html(score);		
		
		elm.remove(); 
		gravity($('.words').find('li').first()); // call the gravity for the next word
	})
	
}



/* Initiate the whole thing */
populateWithWords(function(){
	gravity($('.words').find('li').first());
});

