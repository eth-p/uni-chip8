//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Emitter from '@chipotle/types/Emitter';
import {XHR, XHRType} from '@chipotle/wfw/XHR';

import Program from './Program';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A database of our CHIP-8 programs.
 */
class Library extends Emitter<'load' | 'error'> {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected urlDb: string;
	protected urlBase: string;
	protected loaded: boolean;
	protected loading: boolean;
	protected programs: Program[];

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor() {
		super();

		this.loaded = false;
		this.loading = false;

		this.programs = [];
		this.urlDb = '/assets/rom/database.json';
		this.urlBase = '/assets/rom';
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Loads the game database.
	 *
	 * This does not need to be `then`ed.
	 * Use {@link #addListener} to listen for success/errors.
	 */
	public async load(): Promise<void> {
		if (this.loading) return;

		this.loaded = false;
		this.loading = true;
		this.programs = [];

		try {
			let xhr = new XHR(this.urlDb, XHRType.JSON).get();
			let json: any = await xhr;

			for (let [rom, data] of Object.entries(json)) {
				this.programs.push(new Program(`${this.urlBase}/${rom}`, data));
			}

			// Sort programs:
			// - Featured
			// - Newer
			this.programs.sort((a, b) => {
				if (a.featured && !b.featured) return -1;
				if (b.featured && !a.featured) return 1;
				return a.date.getTime() > b.date.getTime() ? -1 : 1;
			});
			this.emit('load', this);
		} catch (ex) {
			this.emit('error', ex);
		}
	}

	/**
	 * Gets the programs in the database.
	 * @param predicate A filter predicate.
	 */
	public getPrograms(predicate?: (p: Program) => boolean): Program[] {
		if (predicate == null) return this.programs.slice(0);
		return this.programs.filter(predicate);
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default Library;
export {Library};
