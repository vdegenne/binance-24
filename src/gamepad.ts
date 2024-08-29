import gamecontroller, {XBoxButton} from 'esm-gamecontroller.js';
import {sleep} from './utils.js';
import {app} from './app-shell/app-shell.js';

const REPEATER_TIMEOUT = 200;
const REPEATER_SPEED = 50;

let leftKeyRepeaterTimeout: number;
let leftKeyRepeaterInterval: number;
let rightKeyRepeaterTimeout: number;
let rightKeyRepeaterInterval: number;

window.addEventListener('blur', () => {
	clearTimeout(leftKeyRepeaterTimeout);
	clearInterval(leftKeyRepeaterInterval);
	clearTimeout(rightKeyRepeaterTimeout);
	clearInterval(rightKeyRepeaterInterval);
});

gamecontroller.on('connect', async (gamepad) => {
	function noTrigger() {
		return !gamepad.pressed.button6 && !gamepad.pressed.button7;
	}

	gamepad.axeThreshold = [0.3];
	// await sleep(300);
	//
	// app.selectedTicket = app.assets[0].symbol;

	gamepad.before(XBoxButton.LEFT, () => {
		if (!noTrigger()) {
			return;
		}
		leftKeyRepeaterTimeout = setTimeout(() => {
			leftKeyRepeaterInterval = setInterval(() => {
				app.selectPreviousTicket();
			}, REPEATER_SPEED);
			app.selectPreviousTicket();
		}, REPEATER_TIMEOUT);
		app.selectPreviousTicket();
	});
	gamepad.after(XBoxButton.LEFT, () => {
		clearTimeout(leftKeyRepeaterTimeout);
		clearInterval(leftKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.RIGHT, () => {
		if (!noTrigger()) {
			return;
		}
		rightKeyRepeaterTimeout = setTimeout(() => {
			rightKeyRepeaterInterval = setInterval(() => {
				app.selectNextTicket();
			}, REPEATER_SPEED);
			app.selectNextTicket();
		}, REPEATER_TIMEOUT);
		app.selectNextTicket();
	});
	gamepad.after(XBoxButton.RIGHT, () => {
		clearTimeout(rightKeyRepeaterTimeout);
		clearInterval(rightKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.B, () => {
		if (!noTrigger()) {
			return;
		}
		app.openSelected();
	});
});
