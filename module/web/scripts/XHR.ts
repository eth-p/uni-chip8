//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------

enum XHRType {
	BINARY,
	JSON,
	TEXT
}

/**
 * A class for loading files using XMLHttpRequest.
 */
class XHR {
	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected type: XHRType;
	protected url: string;
	protected sent: boolean;
	protected listeners: ((error: any, value: any) => void)[];
	protected cachedResponse: any;
	protected cachedError: any;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructor:                                                                                              |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Creates a new XHR.
	 *
	 * @param url The URL to fetch data from.
	 * @param type The expected response type.
	 */
	public constructor(url: string, type?: XHRType) {
		this.url = url;
		this.type = type == null ? XHRType.TEXT : type;
		this.listeners = [];
		this.sent = false;
		this.cachedError = null;
		this.cachedResponse = null;
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Sends the request.
	 * This will not send additional requests no matter how many times it is called.
	 */
	public send(): void {
		if (this.sent) return;

		let xhr = new XMLHttpRequest();
		switch (this.type) {
			case XHRType.BINARY:
				xhr.responseType = 'arraybuffer';
				break;

			case XHRType.JSON:
				xhr.responseType = 'text';
				break;

			case XHRType.TEXT:
				xhr.responseType = 'text';
				break;

			default:
				break;
		}

		xhr.addEventListener('error', event => {
			for (let listener of this.listeners) {
				listener(event, null);
			}
		});

		xhr.addEventListener('load', event => {
			let error = null;
			let data = null;

			try {
				switch (this.type) {
					case XHRType.BINARY:
						data = new Uint8Array(xhr.response);
						break;

					case XHRType.JSON:
						data = JSON.parse(xhr.responseText);
						break;

					case XHRType.TEXT:
						data = xhr.responseText;
						break;

					default:
						data = xhr.responseText;
						break;
				}
			} catch (ex) {
				error = ex;
			}

			this.cachedResponse = data;
			this.cachedError = error;
			for (let listener of this.listeners) {
				listener(error, data);
			}
		});

		xhr.open('GET', this.url);
		xhr.send();
	}

	/**
	 * Sends the request and returns a promise for its response.
	 * This will not send additional requests no matter how many times it is called.
	 */
	public get(): Promise<any> {
		if (this.cachedError != null || this.cachedResponse != null) {
			return new Promise((resolve, reject) => {
				if (this.cachedError) return reject(this.cachedError);
				resolve(this.cachedResponse);
			});
		}

		this.send();
		return new Promise((resolve, reject) => {
			this.listeners.push((error: any, value: any) => {
				if (error) return reject(error);
				resolve(value);
			});
		});
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default XHR;
export {XHR, XHRType};
