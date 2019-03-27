//! --------------------------------------------------------------------------------------------------------------------
//! Copyright (C) 2019 Team Chipotle
//! MIT License
//! --------------------------------------------------------------------------------------------------------------------
import {Settings, Setting} from '@chipotle/wfw/Settings';

import Savestate from './Savestate';

// ---------------------------------------------------------------------------------------------------------------------

class AppSavestates extends Settings<keyof AppSavestates> {
	@Setting(null)
	public savestate_quickslot!: Savestate | null;

	@Setting(null)
	public savestate_1!: Savestate | null;

	@Setting(null)
	public savestate_2!: Savestate | null;

	@Setting(null)
	public savestate_3!: Savestate | null;

	@Setting(null)
	public savestate_4!: Savestate | null;

	@Setting(null)
	public savestate_5!: Savestate | null;

	@Setting(null)
	public savestate_6!: Savestate | null;

	@Setting(null)
	public savestate_7!: Savestate | null;

	@Setting(null)
	public savestate_8!: Savestate | null;

	@Setting(null)
	public savestate_9!: Savestate | null;
}

namespace AppSavestates {
	export type Keys = keyof AppSavestates;
}

// ---------------------------------------------------------------------------------------------------------------------
export default AppSavestates;
export {AppSavestates};
