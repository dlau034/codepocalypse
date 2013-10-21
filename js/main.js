var words = [		
	'id="tag"',
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
	lives 		 = 6, // the initial number of lives
	score 		 = 0, scoreMultiplier = 100,   // the current score 					// the score mutlipler
	speedDefault = 10000, speedFactor  = 100,   // the default speed in millisiconds		// the multiplication factor related to the score	 	 
	explosions 	 = ['wooble', 'pulse', 'swing', 'tada', 'flip', 'flipInX', 'flipOutX', 'fadeOutUp', 'fadeOutLeft', 'fadeOutUpBig', 'slideInDown', 'slideOutUp', 'slideOutRight', 'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceOutUp', 'rotateInUpLeft', 'rotateInDownLeft', 'rotateInDownRight', 'rotateOut', 'rotateOutDownLeft', 'lightSpeedIn', 'lightSpeedOut', 'hinge', 'rollIn', 'rollOut']; // the explosion types
	
	
	
	
var input = $('#text-field'); //the textarea


// Populate the DOM with the words from the above array
function populateWithWords(callback) {

	for (var i in words.reverse()) {		
		$('.words').append('<div id="word-'+i+'" class="animated" data-val='+words[i]+'><span class="text">'+words[i]+'</span><img src="explosion.gif" class="hidden" alt="explosion" width="142" height="200" /></div>');
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
	
	var elm = $('.words').find('div').last();
	
	// if the input value is correct so far highlight those letters and add shoot sounds
	if ($(this).val().toLowerCase() == elm.attr('data-val').substr(0, input.val().length).toLowerCase()) {
		//regExp = new RegExp("(^\\[A-Z]{"+$(this).val().length+"})"); //""input.val().length;
		elm.html(elm.text().replace(elm.attr('data-val').substr(0, input.val().length), '<span style="color:orange">'+elm.attr('data-val').substr(0, input.val().length)+'</span>'));
		document.getElementById('shoot-sound').play();
	}
	
	// if the word is correct 
	if ($(this).val().toLowerCase() == elm.attr('data-val').toLowerCase()) {
		
		//explosion	= explosions[Math.floor(Math.random() * explosions.length)]; // choose a random explosion type
		var	explosion = 'bounceOutUp';	

		// play the sound if the input is corect so far
		document.getElementById('multiaudio5').play();
				
		// stop the animation and add the explosion class
		elm.stop().addClass(explosion);
		console.log('explosion type', explosion);
		
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
		$(this).val('').focus(); //reset the field
		
	}
});




/**
 * Binds an animation to the given element
 * If the animation finished it means the word wasn't typed in correctly 
 * which means the score decreases by 1.
 */
function gravity(elm) {
	
	//speed = speedDefault - (score * speedFactor);
	speed = speedDefault;
	var left = (50 - Math.floor(Math.random()*100))+'%'; // the left angle running from -50% to +50%
	
	// log the speed and the angle for reference
	console.log('speed: ', speed); 
	console.log('left: ', left);
	
	elm.animate({
		'top' :  $(window).height(),
		'easing' : 	'linear',
		'left'	 : 	left 
	}, speed, function(){
		
		// Make sure the user still have enough lives to move on
		if (lives > 0) {
			document.getElementById('multiaudio3').play();
			
			var explosionTimer = setTimeout(function(){				
				//explode
				
				elm.remove();
										
				input.val('').focus(); //reset the field
				 					
				gravity($('.words').find('div').last()); // call the gravity for the next word	
			}, 500);
			
			elm.find('img').removeClass('hidden');
			elm.find('.text').addClass('hidden');
			
			lives--; // decrease the score
			setLives(lives);
		
			
		} else { // if not GAME OVER
			$('#game-over').removeClass('hidden').addClass('animated tada');
			document.getElementById('gameover').play();
		}
	});
	
}

function setScore(newScore) {
	$('.score').html(newScore * scoreMultiplier);
}

function setLives(newLives) {
	$('.lives').html(newLives);
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
	gravity($('.words').find('div').last());
});

