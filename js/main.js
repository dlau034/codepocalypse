var words = ['console', 'function', 'bracket', 'log', 'procedure', 'tag', 'object', 'array', 'variable', 'recursive', 'prototype', 'attribute', 'src', 'href', 'border-radius', 'instance', 'inheritance'],
	lives 		 = 5, // the initial number of lives
	score 		 = 0, scoreMultiplier = 100,   // the current score 					// the score mutlipler
	speedDefault = 5000, speedFactor  = 100,   // the default speed in millisiconds		// the multiplication factor related to the score	 	 
	explosions 	 = ['wooble', 'pulse', 'swing', 'tada', 'flip', 'flipInX', 'flipOutX', 'fadeOutUp', 'fadeOutLeft', 'fadeOutUpBig', 'slideInDown', 'slideOutUp', 'slideOutRight', 'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceOutUp', 'rotateInUpLeft', 'rotateInDownLeft', 'rotateInDownRight', 'rotateOut', 'rotateOutDownLeft', 'lightSpeedIn', 'lightSpeedOut', 'hinge', 'rollIn', 'rollOut']; // the explosion types
	
	
	
	
var input = $('#text-field'); //the textarea


// Populate the DOM with the words from the above array
function populateWithWords(callback) {

	for (var i in words.reverse()) {		
		$('.words').append('<div id="word-'+i+'" class="animated" data-val='+words[i]+'>'+words[i]+'</div>');
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
	//$('#game-over').html( $('#game-over').text().replace(/(^\w{2})/,'<span style="color:red">$1</span>'));
	//console.log($('.words').find('div').last().html().substr(0, 1).toLowerCase(), String.fromCharCode(e.keyCode).toLowerCase());
	//console.log($('.words').find('div').last().html().substr(0, input.val().length).toLowerCase());
	if ($(this).val().toLowerCase() == elm.attr('data-val').substr(0, input.val().length).toLowerCase()) {
		// console.log("DA");
		// console.log("(^\\w{"+$(this).val().length+"})");
		regExp = new RegExp("(^\\w{"+$(this).val().length+"})"); //""input.val().length;
		elm.html(elm.text().replace(regExp, '<span style="color:red">$1</span>'));
	}
	
	if ($(this).val().toLowerCase() == elm.attr('data-val').toLowerCase()) {
		
		//explosion	= explosions[Math.floor(Math.random() * explosions.length)]; // choose a random explosion type
		var	explosion	= 'bounceOutUp';	
			
		// stop the animation and add the explosion class		
		elm.stop().addClass(explosion);
		console.log('explosion type', explosion);
		
		var explosionTimer = setTimeout(function(){
			elm.remove(); // remove the word from the DOM

			// call the gravity for the next word
			gravity($('.words').find('div').last()); 
			
		}, 700); //the duration is equal to the css animation duration

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
			lives--; // decrease the score
			setLives(lives);
			
			elm.remove(); 
			input.val('').focus(); //reset the field
		
			gravity($('.words').find('div').last()); // call the gravity for the next word	
		} else { // if not GAME OVER
			$('#game-over').removeClass('hidden').addClass('animated tada');
		}
	});
	
}

function setScore(newScore) {
	$('.score').html(newScore * scoreMultiplier);
}

function setLives(newLives) {
	$('.lives').html(newLives);
}



/* Initiate the whole thing */
populateWithWords(function(){
	setScore(score);
	setLives(lives);
	input.focus();
	gravity($('.words').find('div').last());
});

