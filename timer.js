//window
const electron = require("electron");
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;

//configration constants
const SPEECH_VOLUME = 0.9;
const MINUTES_BETWEEN_REMINDER = 5;
const SHAKE_FRAME_LENGTH = 50; //how long each frame lasts in shake()
const SHAKE_FRAME_SKIP = 3; //how many frames to skip before toggling flash

//global bars
var timerLength, countDownDate, interval;

//elements
const minutesInput = document.getElementById('minutes');
const taskInput = document.getElementById('taskname');
const start = document.getElementById('start');
const timer = document.getElementById('timer');
const setup = document.getElementById('setup');
const timeleft = document.getElementById('timeleft');
const currenttask = document.getElementById('currenttask');

//audio
var doneSound = new Audio('done.mp3');
var startSound = new Audio('start.mp3');

//windows
const timerWindow = remote.getCurrentWindow();

const borderWindow = new BrowserWindow({
	width: screen.width,
	height: screen.height,
	x: 0,
	y: 0,
	webPreferences: {
		nodeIntegration: true
	},
	frame: false,
	resizable: false,
	alwaysOnTop: true,
	hasShadow: false,
	parent: timerWindow,
	transparent: true,
	skipTaskbar: true,
	show: false,
});

borderWindow.loadFile('border.htm');

borderWindow.setIgnoreMouseEvents(true);

var PAUSED = false;

function update() {
	if (PAUSED) return;

	// Get todays date and time
	var now = new Date().getTime();
	var distance = countDownDate - now;
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="demo"
	timeleft.innerHTML = minutes.toString().padStart(2, '00') + ":" + seconds.toString().padStart(2, '00');


	//countdown finished
	if (distance < 0) {
		//reset timer
		clearInterval(interval);
		timeleft.innerHTML = "00:00";
		
		shake();

		//play sound
		doneSound.play();
		say(currenttask.innerHTML + ' complete');

		//show main screen
		setup.style.visibility = 'visible';
		timer.style.visibility = 'hidden';

		borderWindow.hide();
	}

	
	//at the end of every minute
	else if (seconds == 0) {
		shake();
		startSound.play();

		if (minutes % MINUTES_BETWEEN_REMINDER == 0) {

			//say current task
			say(currenttask.innerHTML);
			shake();
		}
	}
}


start.addEventListener('click', function () {


	console.log('aASDFA', minutesInput)

	// Set the date we're counting down to
	countDownDate = new Date().getTime() + minutesInput.value * 60 * 1000;

	// Update the count down every 1 second
	interval = setInterval(update, 1000);

	//set start time
	var now = new Date().getTime();
	var distance = countDownDate - now;
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);
	timeleft.innerHTML = minutes.toString().padStart(2, '00') + ":" + seconds.toString().padStart(2, '00');

	//set task name
	currenttask.innerHTML = taskInput.value || 'Work';

	//show timer screen
	setup.style.visibility = 'hidden';
	timer.style.visibility = 'visible';

	//show border
	borderWindow.show();

	//play sound
	startSound.play();
	say('Starting task ' + taskInput.value);
});

//pause / resume timer by clicking on time left
timeleft.addEventListener('click', function () {
	console.log('toggling pause to ' + !PAUSED);

	if (PAUSED) {
		let minutesLeft = parseInt(timeleft.innerHTML.split(':')[0]);
		let secondsLeft = parseInt(timeleft.innerHTML.split(':')[1]);
		countDownDate = new Date().getTime() + (minutesLeft * 60 * 1000) + (secondsLeft * 1000);
		timeleft.classList.remove('paused');
	}
	else 
		timeleft.classList.add('paused');

	PAUSED = !PAUSED;
});


function say(text) {
	var speech = new SpeechSynthesisUtterance(text);
	speech.volume = SPEECH_VOLUME;
	speechSynthesis.speak(speech);
}


function shake() {
	var x = timerWindow.getPosition()[0];
	var y = timerWindow.getPosition()[1];

	var frames = [
		{ x: -5, y: -5 },
		{ x: -5, y: +5 },
		{ x: +5, y: +5 },
		{ x: +5, y: -5 },
		{ x: -5, y: -5 },
		{ x: -5, y: +5 },
		{ x: +5, y: +5 },
		{ x: +5, y: -5 },
		{ x: -5, y: -5 },
		{ x: -5, y: +5 },
		{ x: +5, y: +5 },
		{ x: +5, y: -5 },
		{ x: -5, y: -5 },
		{ x: -5, y: +5 },
		{ x: +5, y: +5 },
		{ x: +5, y: -5 },
	]

	//schedule each frame
	frames.forEach((frame, i) => {
		setTimeout(() => {
			//flash frame
			if (i % SHAKE_FRAME_SKIP == 0) timer.classList.toggle('flash');

			//move window
			timerWindow.setPosition(x + frame.x, y + frame.y);
		}, SHAKE_FRAME_LENGTH * i);
	});

	//reset at end
	setTimeout(() => {
		timer.classList.remove('flash');
		timerWindow.setPosition(x, y);
	}, SHAKE_FRAME_LENGTH * frames.length);

}