'use strict';

import { getValueUnpackerCode } from "../valueUnpacker.js";
import { WorkletsTurboModule } from "../../specs/index.js";
import { ReanimatedError } from "../../errors.js";
export function createNativeWorkletsModule() {
  return new NativeWorklets();
}
class NativeWorklets {
  #workletsModuleProxy;
  constructor() {
    if (global.__workletsModuleProxy === undefined) {
      const valueUnpackerCode = getValueUnpackerCode();
      WorkletsTurboModule?.installTurboModule(valueUnpackerCode);
    }
    if (global.__workletsModuleProxy === undefined) {
      throw new ReanimatedError(`Native part of Reanimated doesn't seem to be initialized (Worklets).
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#native-part-of-reanimated-doesnt-seem-to-be-initialized for more details.`);
    }
    this.#workletsModuleProxy = global.__workletsModuleProxy;
  }
}
//# sourceMappingURL=NativeWorklets.js.map