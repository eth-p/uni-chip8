//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {XHR, XHRType} from '@chipotle/wfw/XHR';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * A database of our CHIP-8 programs.
 */
class Program {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * The URL to the program ROM.
	 */
	public readonly url: string;

	/**
	 * The type of program rom.
	 */
	public readonly type: ProgramType;

	/**
	 * The name of the program rom.
	 */
	public readonly name: string;

	/**
	 * The info text of the program rom.
	 */
	public readonly info: string;

	/**
	 * The name of the program author.
	 */
	public readonly authorName: string;

	/**
	 * The homepage of the program author.
	 */
	public readonly authorPage: string;

	/**
	 * The program is featured (sorted to the top).
	 */
	public readonly featured: boolean;

	/**
	 * The program release date.
	 */
	public readonly date: Date;

	/**
	 * The program shouldn't be easily downloaded.
	 * That's not saying it's impossible to do so, but we might as well not make it easy.
	 */
	public readonly drm: boolean;

	/**
	 * The program controls.
	 */
	public readonly controls?: {[key: string]: string};

	protected cachedData: Uint8Array | null;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new program entry from a URL and program info JSON.
	 *
	 * @param url The program download URL.
	 * @param info The program info.
	 */
	public constructor(url: string, info: any) {
		this.url = url;
		this.info = info.info;
		this.name = info.name;
		this.type = info.type;
		this.authorName = info.author;
		this.authorPage = info.author_url;
		this.controls = info.controls;
		this.drm = info.drm === true;
		this.featured = info.featured === true;
		this.date = new Date(info.date);
		this.cachedData = null;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Loads the program.
	 * @returns The program data.
	 */
	public async load(): Promise<Uint8Array> {
		if (this.cachedData != null) return this.cachedData;
		let xhr = new XHR(this.url, XHRType.BINARY).get();
		let data = await xhr;

		this.cachedData = data;
		return data;
	}
}

type ProgramType = 'DEMO' | 'GAME' | 'TOOL';

// ---------------------------------------------------------------------------------------------------------------------
export default Program;
export {Program};
export {ProgramType};
