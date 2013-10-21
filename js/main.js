/**
 * Use this func for any log (unit tests like)
 * usage   log('inside coolFunc',this,arguments);
 * author  paul irish 
 * link    http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
 */
window.log = function(msg, newResult){
  var now = new Date();
  now.formatted = now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+':'+now.getMilliseconds();
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  
  if (newResult == undefined) newResult = '';

  // select what to show in the log
  var show = true;
  var URL         = true
     ,AJAX        = false
     ,DEPENDENCIE = true
     ,DATA        = false
     ,MODULE      = true
     ;  
  
  if(this.console){
    
    if (
          (msg.indexOf('URL') != -1 && !URL) || 
          (msg.indexOf('AJAX') != -1 && !AJAX) ||
          (msg.indexOf('DEPENDENCIE') != -1 && !DEPENDENCIE) ||
          (msg.indexOf('MODULE') != -1 && !MODULE) ||
          (msg.indexOf('DATA') != -1 && !DATA)
       )
         show = false;

    if (show)
       //console.log(new Date+' '+Array.prototype.slice.call(arguments));
       console.log("%c"+now.formatted+' '+msg,"color:#888;", newResult);
  }
};



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

	lives 		 = 3, // the initial number of lives
	score 		 = 0, scoreMultiplier = 100,   // the current score 					// the score mutlipler
	speedDefault = 15000, speedFactor  = 100,   // the default speed in millisiconds		// the multiplication factor related to the score
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
		
		shoot(elm);
		
		// play a sound for wach correct character
		playSound('shoot-sound');

		// If the input's length is the same as the given string length proceed 
		// KILL
		if ($(this).val().length == elm.attr('data-val').length) {
         
         
			shoot(elm, function(){   	
			   console.log("shoot callback");	
			   // stop the animation and add the explosion class
            elm.stop().addClass('killed');
               
            elm.addClass('bounceOutUp');

            // wait for the animation(explosion) to happen and then remove it from the DOM
      		var explosionTimer = setTimeout(function(){
      			elm.remove(); // remove the word from the DOM				
      			
      			resetField(); //reset the field      			
   				// call the gravity for the next word
               gravity($('.words').find('div').last());
				}, 700);				
			});
         
			// play the whole string is done
			playSound('multiaudio5');
         
         // Increase the lives if the alien is lives++
			if ($(this).val() == 'lives++') {
				lives++;
				setLives(lives);
			}
			
			score++; // increase the score
			setScore(score);		
			
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
function gravity(alien) {
	
	//speed = speedDefault - (score * speedFactor);
	speed    = speedDefault;

	var top  = $(window).height() - alien.parent().offset().top, // the top of the base
	    left = (50 - Math.floor(Math.random()*100))+'%'; // the left angle running from -50% to +50%
	
	// log the speed and the angle for reference
	log('GRAVITY Started:', alien.attr('data-val'));
	
	alien.removeClass('hidden'); // show it
	
	alien.animate({
		'top' 	 : top,
		'left'	 : left, 
		'easing' : 'swing'
	}, speed, function(){
		
		log('CITY BOMBED:', alien.attr('data-val'));
		// Make sure the user still have enough lives to move on
		
		if (attemptMinusLives()) {
			playSound('multiaudio3');
			
			alien.find('img').removeClass('hidden');
			alien.find('.text').addClass('hidden');

			var waitToExplode = setTimeout(function(){				
				//explode
				alien.remove();
				resetField(); //reset the field
			
				// call the gravity for the next alien
				gravity($('.words').find('div').last()); 	
			}, 500);
						
		} else { // if not GAME OVER
			$('#game-over').removeClass('hidden').addClass('animated tada');
			playSound('gameover');
		}
	});
	
}

/**
 * Tracks the last alien position
 * And shoots a bullet towards it. 
 */
 var i = 0;
function shoot(elm, callback) {
   log('SHOOT', elm.attr('data-val'));
   var bullet = $('.bullet').clone().appendTo('body');
   bullet.attr('id', 'bullet-'+i);
   i++;
   bullet.animate({
      'top'    : elm.offset().top + elm.height(),
      'left'   : elm.offset().left + elm.width()/2,
      'easing' : 'swing'       
   }, 10, function() {
      console.log(bullet[0]);
      bullet.remove();
      
      if (callback != undefined) {
         callback();
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


function plusLives() {
   lives++;
   setLives(lives);
}

function attemptMinusLives() {
   if (lives > 0) {
      lives--;
      setLives(lives);
      return true;
   } else {
      return false;
   }
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

