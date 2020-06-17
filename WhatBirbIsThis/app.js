
// the set of possible birds we want to be quizzed on
var birdSet = allBirds;
var correctAnswer; // the correct answer for the current question
var gameType = 'multiple choice';

// dom elements
var nav       = document.querySelector("nav img"),
	slider    = document.querySelector("#slider"),
	slideBack = document.querySelector("#slideBack"),
	picture   = document.querySelector("#picture"),
	bird1     = document.querySelector('#bird1'),	
	bird2     = document.querySelector('#bird2'),	
	bird3     = document.querySelector('#bird3'),	
	answer0   = document.querySelector("#answer0"),
	answer1   = document.querySelector("#answer1"),
	answer2   = document.querySelector("#answer2"),
	answer3   = document.querySelector("#answer3"),
	toggleTop = document.querySelector('#radioTop'),
	toggleMid = document.querySelector('#radioMid'),
	toggleBot = document.querySelector('#radioBot'),
	input 	  = document.querySelector('#freeAnswerArea input'),
	soundIcon = document.querySelector('#soundImage'),
	frame     = document.querySelector('#frame');
var answers = [],
    birds   = [],
    toggles = [];
answers.push(answer0, answer1, answer2, answer3);
birds.push(bird1, bird2, bird3);
toggles.push(toggleTop, toggleMid, toggleBot);


/*_______________Event listeners and such_____________*/


toggles.forEach((toggle)=> {
	toggle.addEventListener('click', ()=> {
		toggles.forEach((t)=> {
			t.classList.remove('chosen');
		});
		toggle.classList.add('chosen');
		console.log(toggle.innerHTML);
		gameType = toggle.innerHTML.toLowerCase();
		console.log(gameType);
		updateDisplay();
		loadQuestion();
	});
});

// slide nav out, mobile only
nav.addEventListener('click', ()=> {
	slider.classList.add("slideIn");
	slider.classList.remove("slideOut");
	nav.classList.add("noDisplay");
	slider.classList.toggle("noDisplay");
});

// slide nav back in, mobile only
slideBack.addEventListener('click', ()=> {
	slider.classList.remove("slideIn");
	slider.classList.add("slideOut");
	setTimeout(()=> {
		nav.classList.remove("noDisplay");
		slider.classList.toggle("noDisplay");
	}, 200);
});

// click listener for playing sound
soundIcon.addEventListener('click', ()=> {
	alert('play sound');
});

// mouseover listener for sound icon
soundIcon.addEventListener('mouseover', ()=> {
	soundIcon.style.transform = 'scale(1.1)';
});
soundIcon.addEventListener('mouseleave', ()=> {
	soundIcon.style.transform = 'scale(1)';
});


// eventListeners for birds, probably want to make this a loop
// at some point
birds.forEach((bird, index)=> {
	console.log(index);
	bird.addEventListener('mouseover', ()=> {
		let bubble = document.querySelector('#speechBubbleWrapper'+(index+1));
		bubble.style.opacity='1';
		bubble.classList.remove('tiny');
	});
	bird.addEventListener('mouseleave', ()=> {
		let bubble = document.querySelector('#speechBubbleWrapper'+(index+1))
		bubble.style.opacity='0';
		bubble.classList.add('tiny');
	});
});

// event listeners for answer buttons. 
answers.forEach((button)=> {
	button.addEventListener('click', ()=> {	
		if(checkClickedAnswer(button.innerHTML)) {
			button.classList.add("correct");
			picture.classList.add("celebrate");
			// sound taken from zapsplat.com
			new Audio('kaching.mp3').play()
		}else {
			button.classList.add("incorrect");
		}
	});
});

// event listener for free answer input 
input.addEventListener('keydown', (e)=> {
	if(e.keyCode == 13){
		checkTextAnswer();
	}
});


// initialize app
updateDisplay();
loadQuestion();


/*___________________________________________________*/

// creates a new picture and a new set of possible answers
function loadQuestion() {
	// clear answer field
	input.value = '';

	// clear styling from previous questions
	resetStyles();

	// clear celebration styling
	picture.classList.remove("celebrate");

	// pick a new random bird type from the available options
	let rand = randomNumber(birdSet.length);
	let randBird = birdSet[rand];
	correctAnswer = randBird;

	if(gameType.toLowerCase() == "multiple choice"){
		generatePicture(randBird);
		generateAnswers(randBird);
	}else if(gameType.toLowerCase() == "free answer"){
		// alert('game type not yet implemented');
		generatePicture(randBird);
		generateFreeAnswerArea();
	}else if(gameType.toLowerCase() == "bird calls"){
		// alert('game type not yet implemented');
		generateAnswers(randBird);
	}
}

// clears all game elements between game mode resets
// sets up correct elements for the game type
function updateDisplay() {
	document.querySelector('#buttons').style.display = 'none';
	document.querySelector('#freeAnswerArea').style.display = 'none';
	document.querySelector('#picture').style.display = 'none';
	document.querySelector('#answerHeader').innerHTML = gameType;

	if(gameType == 'multiple choice') {
		document.querySelector('#buttons').style.display = 'flex';
		document.querySelector('#picture').style.display = 'flex';		
	}else if(gameType == 'free answer') {
		document.querySelector('#freeAnswerArea').style.display = 'flex';
		document.querySelector('#picture').style.display = 'flex';		
	}else if(gameType == 'bird calls') {
		document.querySelector('#buttons').style.display = 'flex';	
	}
}

function resetStyles() {
	answer0.classList.remove("correct", "incorrect");
	answer1.classList.remove("correct", "incorrect");
	answer2.classList.remove("correct", "incorrect");
	answer3.classList.remove("correct", "incorrect");
}

// chooses a random image from chosen bird and sets the image in the dom
function generatePicture(randBird) {
	// chose random image from photos available for the chosen bird
	let images = birdData[randBird].images;
	let len = Object.keys(images).length;
	let rand = randomNumber(len);
	let randImage = images[rand];

	// set new picture in the dom
	picture.style.backgroundImage = "url('"+ randImage+"')";
}

// generates 4 answers, one of which will be correct. Sets listener on the correct answer
// sets new button text for all four buttons
function generateAnswers(randBird) {

	// boolean that is true if the correct answer is already included in the answer set
	let answerIncluded = false;
	
	for(let i = 0; i < 4; i++){
		let rand = randomNumber(birdSet.length);
		// console.log(birdSet[rand]);

		// set answerIncluded to true if the correct answer is added
		if(birdSet[rand] == randBird){
			answerIncluded = true;
		}

		// adds random answer to each answer button
		document.querySelector("#answer"+i).innerHTML = birdSet[rand];
	}

	// if correct answer is not included, choose a random answer to replace with the correct response
	if(!answerIncluded) {
		console.log("correct answer not included on initial attempt");
		let rand = randomNumber(4);
		document.querySelector("#answer"+rand).innerHTML = randBird;
	}
}

function generateFreeAnswerArea() {

}

// checks if the text on the clicked button corresponds with the answer
// Is called any time a button is clicked
// returns true or false so that the button called can be manipulated
// indicate to a user through styling
function checkClickedAnswer(answerText) {
	if(answerText == correctAnswer) {
		setTimeout(()=> {
			loadQuestion();
		},2000);
		return true;
	}else {
		return false;
	}
}

function checkTextAnswer() {
	let answerText = input.value.toLowerCase();
	if(birdData[correctAnswer].aliases.includes(answerText)) {
		console.log("YOU DID IT!!!");
		setTimeout(()=> {
			loadQuestion();
		},2000);
		return true;
	}else {
		console.log('check your spelling');
		console.log(answerText);
		console.log(birdData[correctAnswer].aliases);
		return false;
	}
}

// returns a random whole number between zero and upperBound inclusive
function randomNumber(upperBound) {
	return Math.floor(Math.random()*upperBound);
}










