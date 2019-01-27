//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import dom_ready from '@chipotle/web/dom_ready';
import settings from './settings';
import {emulator, vm} from './instance';
import UIAnimator from '@chipotle/web/UIAnimator';
// ---------------------------------------------------------------------------------------------------------------------
// Variables:
// ---------------------------------------------------------------------------------------------------------------------
let animator: UIAnimator<any>;
let container: HTMLElement;
let canvas: HTMLCanvasElement;
let context: CanvasRenderingContext2D;
let hooked = false;

// ---------------------------------------------------------------------------------------------------------------------
// Functions:
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Resizes the canvas.
 */
function resize() {
	if (canvas.width !== container.offsetWidth || canvas.height !== container.offsetHeight) {
		canvas.width = container.offsetWidth;
		canvas.height = container.offsetHeight;
	}
}

/**
 * Paints the screen.
 */
function paint() {
	resize();

	try {
		let hw_width = vm.display.WIDTH;
		let hw_height = vm.display.HEIGHT;

		let background = settings.screen_background!;
		let foreground = settings.screen_foreground!;
		let width = canvas.width;
		let height = canvas.height;

		let pxsize = Math.min(Math.floor(width / hw_width), settings.display_scaling ? Infinity : 2);
		let pxtop = Math.floor((height - pxsize * hw_height) / 2);
		let pxleft = Math.floor((width - pxsize * hw_width) / 2);

		// Draw frame.
		context.fillStyle = background;
		if (settings.display_frameless) {
			context.fillRect(0, 0, width, height);
		} else {
			context.clearRect(0, 0, width, height);
		}

		// Draw background.
		context.fillRect(pxleft, pxtop, hw_width * pxsize, hw_height * pxsize);

		// Draw foreground.
		context.fillStyle = foreground;
		let buffer = vm.display.buffer;
		let index = 0;
		for (let y = 0; y < hw_height; y++) {
			let consecutiveX = 0;
			let consecutiveW = 0;

			// Draw in horizontal clusters.
			for (let x8 = 0; x8 < hw_width; x8 += 8, index++) {
				let on8 = buffer[index];
				for (let xbit = 0; xbit < 8; xbit++) {
					let on = ((on8 >> (7 - xbit)) & 1) > 0;

					// Draw cluster.
					if (!on) {
						if (consecutiveW !== 0) {
							let drawLeft = pxleft + consecutiveX * pxsize;
							let drawTop = pxtop + y * pxsize;
							context.fillRect(drawLeft, drawTop, consecutiveW * pxsize, pxsize);
							consecutiveW = 0;
						}

						continue;
					}

					// Add to cluster.
					if (consecutiveW === 0) {
						consecutiveX = x8 + xbit;
						consecutiveW++;
					} else {
						consecutiveW++;
					}
				}
			}

			// Draw cluster.
			if (consecutiveW !== 0) {
				let drawLeft = pxleft + consecutiveX * pxsize;
				let drawTop = pxtop + y * pxsize;
				context.fillRect(drawLeft, drawTop, consecutiveW * pxsize, pxsize);
				consecutiveW = 0;
			}
		}
	} catch (ex) {
		emulator.emit('error', ex);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
// Setup:
// ---------------------------------------------------------------------------------------------------------------------
dom_ready(() => {
	animator = new UIAnimator(paint, {emulator: false});
	container = <HTMLElement>document.querySelector('#emulator-screen');
	canvas = <HTMLCanvasElement>document.querySelector('#emulator-screen canvas')!;
	context = canvas.getContext('2d')!;

	window.addEventListener('resize', () => {
		canvas.width = 0;
		canvas.height = 0;
		paint();
	});

	paint();
	animator.resume();
});

emulator.addListener('step', () => {
	window.requestAnimationFrame(paint);
});

emulator.addListener('pause', () => {
	animator.setCriteria('emulator', false);
});

emulator.addListener('resume', () => {
	animator.setCriteria('emulator', true);
});

settings.addListener('update', (setting: string) => {
	if ((!hooked && setting.startsWith('display_')) || setting.startsWith('screen_')) {
		window.requestAnimationFrame(paint);
	}
});
