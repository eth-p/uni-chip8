//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
// import dom_ready from '@chipotle/web/dom_ready';
// YOUR CODE HERE

import SpriteRegion from './SpriteRegion';

function main(): void {
	let region: SpriteRegion = new SpriteRegion();
	for (let i = 0; i < region.COLUMNS; ++i) {
		region.setPixel(i, i, true);
	}

	console.log(region.getData());
}

main();
// dom_ready(main);
