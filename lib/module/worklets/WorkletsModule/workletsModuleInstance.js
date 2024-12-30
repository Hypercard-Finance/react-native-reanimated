'use strict';

import { createNativeWorkletsModule } from "./NativeWorklets.js";
import { shouldBeUseWeb } from "../../PlatformChecker.js";
import { createJSWorkletsModule } from "./JSWorklets.js";
export const WorkletsModule = shouldBeUseWeb() ? createJSWorkletsModule() : createNativeWorkletsModule();
//# sourceMappingURL=workletsModuleInstance.js.map