'use strict';

import { checkCppVersion } from "../platform-specific/checkCppVersion.js";
import { jsVersion } from "../platform-specific/jsVersion.js";
import { isFabric } from "../PlatformChecker.js";
import { getShadowNodeWrapperFromRef } from '../fabricUtils';
import { ReanimatedTurboModule } from "../specs/index.js";
import { ReanimatedError } from "../errors.js";
import { WorkletsModule } from "../worklets/index.js";
export function createNativeReanimatedModule() {
  return new NativeReanimatedModule();
}
function assertSingleReanimatedInstance() {
  if (global._REANIMATED_VERSION_JS !== undefined && global._REANIMATED_VERSION_JS !== jsVersion) {
    throw new ReanimatedError(`Another instance of Reanimated was detected.
See \`https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#another-instance-of-reanimated-was-detected\` for more details. Previous: ${global._REANIMATED_VERSION_JS}, current: ${jsVersion}.`);
  }
}
class NativeReanimatedModule {
  /**
   * We keep the instance of `WorkletsModule` here to keep correct coupling of
   * the modules and initialization order.
   */
  #workletsModule;
  #reanimatedModuleProxy;
  constructor() {
    this.#workletsModule = WorkletsModule;
    // These checks have to split since version checking depend on the execution order
    if (__DEV__) {
      assertSingleReanimatedInstance();
    }
    global._REANIMATED_VERSION_JS = jsVersion;
    if (global.__reanimatedModuleProxy === undefined) {
      ReanimatedTurboModule?.installTurboModule();
    }
    if (global.__reanimatedModuleProxy === undefined) {
      throw new ReanimatedError(`Native part of Reanimated doesn't seem to be initialized.
See https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting#native-part-of-reanimated-doesnt-seem-to-be-initialized for more details.`);
    }
    if (__DEV__) {
      checkCppVersion();
    }
    this.#reanimatedModuleProxy = global.__reanimatedModuleProxy;
  }
  makeShareableClone(value, shouldPersistRemote, nativeStateSource) {
    return this.#reanimatedModuleProxy.makeShareableClone(value, shouldPersistRemote, nativeStateSource);
  }
  scheduleOnUI(shareable) {
    return this.#reanimatedModuleProxy.scheduleOnUI(shareable);
  }
  executeOnUIRuntimeSync(shareable) {
    return this.#reanimatedModuleProxy.executeOnUIRuntimeSync(shareable);
  }
  createWorkletRuntime(name, initializer) {
    return this.#reanimatedModuleProxy.createWorkletRuntime(name, initializer);
  }
  scheduleOnRuntime(workletRuntime, shareableWorklet) {
    return this.#reanimatedModuleProxy.scheduleOnRuntime(workletRuntime, shareableWorklet);
  }
  registerSensor(sensorType, interval, iosReferenceFrame, handler) {
    return this.#reanimatedModuleProxy.registerSensor(sensorType, interval, iosReferenceFrame, handler);
  }
  unregisterSensor(sensorId) {
    return this.#reanimatedModuleProxy.unregisterSensor(sensorId);
  }
  registerEventHandler(eventHandler, eventName, emitterReactTag) {
    return this.#reanimatedModuleProxy.registerEventHandler(eventHandler, eventName, emitterReactTag);
  }
  unregisterEventHandler(id) {
    return this.#reanimatedModuleProxy.unregisterEventHandler(id);
  }
  getViewProp(viewTag, propName, component,
  // required on Fabric
  callback) {
    let shadowNodeWrapper;
    if (isFabric()) {
      shadowNodeWrapper = getShadowNodeWrapperFromRef(component);
      return this.#reanimatedModuleProxy.getViewProp(shadowNodeWrapper, propName, callback);
    }
    return this.#reanimatedModuleProxy.getViewProp(viewTag, propName, callback);
  }
  configureLayoutAnimationBatch(layoutAnimationsBatch) {
    this.#reanimatedModuleProxy.configureLayoutAnimationBatch(layoutAnimationsBatch);
  }
  setShouldAnimateExitingForTag(viewTag, shouldAnimate) {
    this.#reanimatedModuleProxy.setShouldAnimateExitingForTag(viewTag, shouldAnimate);
  }
  enableLayoutAnimations(flag) {
    this.#reanimatedModuleProxy.enableLayoutAnimations(flag);
  }
  configureProps(uiProps, nativeProps) {
    this.#reanimatedModuleProxy.configureProps(uiProps, nativeProps);
  }
  subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent) {
    return this.#reanimatedModuleProxy.subscribeForKeyboardEvents(handler, isStatusBarTranslucent, isNavigationBarTranslucent);
  }
  unsubscribeFromKeyboardEvents(listenerId) {
    this.#reanimatedModuleProxy.unsubscribeFromKeyboardEvents(listenerId);
  }
}
//# sourceMappingURL=NativeReanimated.js.map