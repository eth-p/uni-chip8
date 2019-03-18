//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from './dom_ready';
// ---------------------------------------------------------------------------------------------------------------------

let timer: any | null = null;
let loading: any;
let elements: any;

// ---------------------------------------------------------------------------------------------------------------------
const messages = [
	'This might take a while.',
	'Studying for exams.',
	'Looking for gnomes.',
	'Raiding ICC.',
	'Grinding for levels.',
	'Finding the ring.',
	'Rescuing the princess.',
	'EV training.',
	'Hiding in cardboard boxes.',
	'Fighting Dracula.',
	'Downloading more RAM.',
	'Playing Minecraft.',
	'Setting phasers to stun.',
	'Beaming up Captain Kirk.',
	'Going Super Saiyan.',
	'Walking the dog.',
	'Going to the Nether.',
	'Distributing loot.',
	'Selling out.',
	'Somebody once told me...',
	'(\u256f\u00b0\u25a1\u00b0\uff09\u256f\ufe35 \u253b\u2501\u253b',
	'Randomizing messages.',
	'Feeding your Sims.',
	'Loading the biggest project.',
	'Instagramming the dog.',
	'Slaying the spire.',
	'Calculating PI.',
	'alert("Hello World")',
	'0xDEADBEEF',
	'Chasing the dragon.',
	'Winter is coming.',
	'Switching to Genji.',
	'Placing turrets.',
	'Erecting a dispenser.',
	'Press Q to win.',
	'Activating tactical visor.',
	'Taking an arrow to the knee.',
	"It's dangerous to go alone.",
	'I need healing.',
	'Your princess is in another castle.',
	'Resurrecting Ganon.',
	'Backslash!',
	'Piki pi?',
	'Riding Epona.',
	"418 I'm a Teapot",
	'Hitting snooze.',
	'Going to interviews.',
	'Wave dashing.',
	'4 stock, Final Destination, Fox only.',
	'Fighting Mother Brain.',
	'Learning JavaScript.',
	'Collecting Jiggies.',
	'Procrastinating.',
	'Rolling for perception.',
	'Looking for loaded dice.',
	'Defeating Dr. Wily.',
	'Clearing memory.',
	'Blaming Canada.',
	'Asking for a manager.',
	'Violating the laws of physics.'
];

function displayError() {
	document.removeEventListener('error', displayError);

	for (let element of document.querySelectorAll('.loading-message')) {
		element.textContent = 'Something went wrong.';
		element.classList.add('error');
	}
}

function displayMessage() {
	if (loading.parentNode == null) {
		clearInterval(timer);
		return;
	}

	// Change loading messages.
	const message = messages[Math.round(Math.random() * messages.length - 1)];
	for (let element of elements) {
		element.textContent = message;
	}
}

dom_ready(() => {
	loading = document.getElementById('loading-screen');
	elements = Array.from(document.querySelectorAll('.loading-message'));
	if (loading == null) return;

	displayMessage();
	timer = setInterval(displayMessage, 2500);

	document.addEventListener('error', displayError);
});
