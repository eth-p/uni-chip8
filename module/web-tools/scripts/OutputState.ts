//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
export enum OutputType {
	Decimal,
	Hexadecimal,
	Binary,
	Unknown
}

export class OutputState {
	public state: OutputType;
	public enablePrefix: boolean;
	public constructor() {
		this.state = OutputType.Unknown;
		this.enablePrefix = false;
	}
}
