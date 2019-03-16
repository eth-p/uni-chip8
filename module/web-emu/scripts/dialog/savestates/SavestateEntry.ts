//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import Template from '@chipotle/wfw/Template';

// ---------------------------------------------------------------------------------------------------------------------

/**
 * An entry in the savestate dialog list.
 */
class SavestateEntry {
	// -------------------------------------------------------------------------------------------------------------
	// | Constants:                                                                                                |
	// -------------------------------------------------------------------------------------------------------------

	protected readonly TEMPLATE: (typeof SavestateEntry)['TEMPLATE'] = (<any>this.constructor).TEMPLATE;
	public static readonly TEMPLATE = Template.compile<{slot: 'quickslot' | number}>({
		classes: 'control-item',
		data: {savestate: o => o.slot.toString()},
		children: [
			{
				classes: 'content',
				children: [
					{
						classes: 'image',
						children: [
							{
								type: 'img'
							}
						]
					},
					{
						classes: ['details', 'savestate-info'],
						children: [
							{
								classes: 'savestate-name',
								text: o => (o.slot === 'quickslot' ? 'Quicksave' : `Savestate ${o.slot}`)
							},
							{
								classes: 'savestate-date'
							}
						]
					}
				]
			},
			{
				classes: 'controls',
				children: [
					{
						type: 'input',
						attr: {type: 'button', value: 'Load'},
						data: {'savestate-action': 'load'}
					},
					{
						type: 'input',
						attr: {type: 'button', value: 'Save'},
						data: {'savestate-action': 'save'}
					}
				]
			}
		]
	});

	// -------------------------------------------------------------------------------------------------------------
	// | Fields:                                                                                                   |
	// -------------------------------------------------------------------------------------------------------------

	protected slot: 'quickslot' | number;

	protected element: HTMLElement;
	protected buttonLoad: HTMLInputElement;
	protected buttonSave: HTMLInputElement;
	protected dateField: HTMLElement;
	protected image: HTMLImageElement;

	// -------------------------------------------------------------------------------------------------------------
	// | Constructors:                                                                                             |
	// -------------------------------------------------------------------------------------------------------------

	public constructor(slot: 'quickslot' | number) {
		this.slot = slot;

		this.element = this.TEMPLATE({slot: slot});
		this.buttonLoad = <HTMLInputElement>this.element.querySelector('[savestate-action="load"]');
		this.buttonSave = <HTMLInputElement>this.element.querySelector('[savestate-action="save"]');
		this.dateField = <HTMLElement>this.element.querySelector('.savestate-date');
		this.image = <HTMLImageElement>this.element.querySelector('.image > img');

		this.setDate(null);
		this.setImage(null);
	}

	// -------------------------------------------------------------------------------------------------------------
	// | Methods:                                                                                                  |
	// -------------------------------------------------------------------------------------------------------------

	/**
	 * Gets the savestate slot.
	 */
	public getSlot(): 'quickslot' | number {
		return this.slot;
	}

	/**
	 * Gets the element for the savestate entry.
	 * @returns The HTML element.
	 */
	public getElement(): HTMLElement {
		return this.element;
	}

	/**
	 * Gets the element for the load button
	 * @returns The HTML element.
	 */
	public getLoadButton(): HTMLInputElement {
		return this.buttonLoad;
	}

	/**
	 * Gets the element for the save button.
	 * @returns The HTML element.
	 */
	public getSaveButton(): HTMLInputElement {
		return this.buttonSave;
	}

	/**
	 * Sets the date of the entry.
	 * @param date The date, or null if not set.
	 */
	public setDate(date: Date | null): void {
		this.dateField.textContent = date == null ? 'No Savestate' : date.toLocaleString();
	}

	/**
	 * Sets the image of the entry.
	 * @param image The image URL, or null if no image available.
	 */
	public setImage(image: string | null): void {
		if (image == null) {
			this.image.classList.add('hide');
		} else {
			this.image.classList.remove('hide');
			this.image.src = image;
		}
	}
}

// ---------------------------------------------------------------------------------------------------------------------
export default SavestateEntry;
export {SavestateEntry};
