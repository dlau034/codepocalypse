var words = [		
	'id\ now',
	'$(this)',	
	'class="menu"',
	'color:#fff;',
	'border-radius',
	'a href=""',
	'!DOCTYPE html',
	'console.log()',
	'placeholder="name"',
	'var array=["dog"]',
	'link rel="stylesheet',
	'$(document).ready(function(){})',
	'function killtheBoss(){$(this).remove()}'
],
	lives 		 = 40, // the initial number of lives
	score 		 = 0, scoreMultiplier = 100,   // the current score 					// the score mutlipler
	speedDefault = 5000, speedFactor  = 100,   // the default speed in millisiconds		// the multiplication factor related to the score
	sound		 = true;
	
	//explosions 	 = ['wooble', 'pulse', 'swing', 'tada', 'flip', 'flipInX', 'flipOutX', 'fadeOutUp', 'fadeOutLeft', 'fadeOutUpBig', 'slideInDown', 'slideOutUp', 'slideOutRight', 'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceOutUp', 'rotateInUpLeft', 'rotateInDownLeft', 'rotateInDownRight', 'rotateOut', 'rotateOutDownLeft', 'lightSpeedIn', 'lightSpeedOut', 'hinge', 'rollIn', 'rollOut']; // the explosion types
	
	
/* DEFINE THE DOM ELEMENTS */	
var input = $('#text-field'); //the textarea


// Populate the DOM with the words from the above array
function populateWithWords(callback) {
	for (var i in words.reverse()) {		
		$('.words').append('<div id="word-'+i+'" class="word hidden animated"><span class="text">'+words[i]+'</span><img src="explosion.gif" class="hidden" alt="explosion" width="142" height="200" /></div>');
		
		// Add the data-val attribute
		$('.words').find('.word').last().attr('data-val', words[i]);
		
		console.log('data-val:', $('.words').find('.word').last().attr('data-val'),'||', 'html:', $('.words').find('.word').last().find('.text').html());
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
input.keyup(function(e) {
	
	var elm = $('.words').find('.word').last();
	
	/** 
	 * IF the input value is correct so far highlight those characters and add shoot sounds 
	 * ELSE take the last character (incorrect character) out
	 */
	if ($(this).val().toLowerCase() == elm.attr('data-val').substr(0, input.val().length).toLowerCase()) {
		//regExp = new RegExp("(^\\[A-Z]{"+$(this).val().length+"})"); //""input.val().length;
		elm.find('.text').html(elm.find('.text').text().replace(elm.attr('data-val').substr(0, input.val().length), '<span style="color:orange">'+elm.attr('data-val').substr(0, input.val().length)+'</span>'));
		
		// play a sound for wach correct character
		playSound('shoot-sound');
		
		// If the input's length is the same as the given string length proceed
		if ($(this).val().length == elm.attr('data-val').length) {
			
			//explosion	= explosions[Math.floor(Math.random() * explosions.length)]; // choose a random explosion type
	
			// play the whole string is done
			playSound('multiaudio5');
					
			// stop the animation and add the explosion class
			elm.stop().addClass('bounceOutUp');
			
			// wait for the animation(explosion) to happen and then remove it from the DOM
			var explosionTimer = setTimeout(function(){
				elm.remove(); // remove the word from the DOM
	
				// call the gravity for the next word
				gravity($('.words').find('div').last()); 
				
			}, 700); //the duration is equal to the css animation duration
			
			if ($(this).val() == 'lives++') {
				lives++;
				setLives(lives);
			}
			
			score++; // increase the score
			setScore(score);		
			resetField(); //reset the field
			
		}
		
	} else { 		
		resetField($(this).val().substr(0, input.val().length - 1)); // take the last char out
	}

});







/**
 * Binds an animation to the given element
 * If the animation finished it means the word wasn't typed in correctly 
 * which means the score decreases by 1.
 */
function gravity(elm) {
	
	//speed = speedDefault - (score * speedFactor);
	speed    = speedDefault;
	console.log(elm[0]);
	var top  = $(window).height() - elm.parent().offset().top, // the top of the base
	    left = (50 - Math.floor(Math.random()*100))+'%'; // the left angle running from -50% to +50%
	
	// log the speed and the angle for reference
	console.log('String:', elm.attr('data-val'));
	console.log('Speed: ', speed, 'Left:', left);
	
	elm.removeClass('hidden'); // show it
	
	elm.animate({
		'top' 	 : top,
		'left'	 : left, 
		'easing' : 'swing'
	}, speed, function(){
		
		// Make sure the user still have enough lives to move on
		if (lives > 0) {
			playSound('multiaudio3');
			
			var explosionTimer = setTimeout(function(){				
				//explode
				elm.remove();										
				resetField(); //reset the field				 					
				gravity($('.words').find('div').last()); // call the gravity for the next word	
			}, 500);
			
			elm.find('img').removeClass('hidden');
			elm.find('.text').addClass('hidden');
			
			lives--; // decrease the score
			setLives(lives);
		
			
		} else { // if not GAME OVER
			$('#game-over').removeClass('hidden').addClass('animated tada');
			playSound('gameover');
		}
	});
	
}

/**
 * Set the new given score 
 */
function setScore(newScore) {
	$('.score').html(newScore * scoreMultiplier);
}

/** 
 * Set the new given lives 
 */
function setLives(newLives) {
	$('.lives').html(newLives);
}

/**
 * Play the given sound, if the sound is enabled
 */
function playSound(soundId) {
	if (sound) {
		document.getElementById(soundId).play();	
	}	
}

/**
 * Resets the field and sets the focus on it 
 * If there is a newVal replace the old value with it
 */
function resetField(newVal) {
	if (newVal != undefined) {
		input.val(newVal); // replace the val with the given val
	} else {
		input.val(''); //reset the field
	}
	
	input.focus();
}

// Make sure that the form never submits on enter
$('form').submit(function(){
	return false;
});

/* Initiate the whole thing */
populateWithWords(function(){
	setScore(score);
	setLives(lives);
	input.focus();
	
	//wait fot the pulse animation
	$('.ship').fadeIn('slow', function() {
		gravity($('.words').find('div').last());	
	}); 
	
});

