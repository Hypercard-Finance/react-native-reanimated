'use strict';

import { PropsAllowlists } from "./propsAllowlists.js";
import { executeOnUIRuntimeSync, jsiConfigureProps } from "./core.js";
import { ReanimatedError } from "./errors.js";
import { updateLoggerConfig } from "./logger/index.js";
import { shouldBeUseWeb } from "./PlatformChecker.js";
const SHOULD_BE_USE_WEB = shouldBeUseWeb();
function assertNoOverlapInLists() {
  for (const key in PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST) {
    if (key in PropsAllowlists.UI_THREAD_PROPS_WHITELIST) {
      throw new ReanimatedError(`Property \`${key}\` was whitelisted both as UI and native prop. Please remove it from one of the lists.`);
    }
  }
}
export function configureProps() {
  assertNoOverlapInLists();
  jsiConfigureProps(Object.keys(PropsAllowlists.UI_THREAD_PROPS_WHITELIST), Object.keys(PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST));
}
export function addWhitelistedNativeProps(props) {
  const oldSize = Object.keys(PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST).length;
  PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST = {
    ...PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST,
    ...props
  };
  if (oldSize !== Object.keys(PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST).length) {
    configureProps();
  }
}
export function addWhitelistedUIProps(props) {
  const oldSize = Object.keys(PropsAllowlists.UI_THREAD_PROPS_WHITELIST).length;
  PropsAllowlists.UI_THREAD_PROPS_WHITELIST = {
    ...PropsAllowlists.UI_THREAD_PROPS_WHITELIST,
    ...props
  };
  if (oldSize !== Object.keys(PropsAllowlists.UI_THREAD_PROPS_WHITELIST).length) {
    configureProps();
  }
}

/**
 * Updates Reanimated logger config with the user-provided configuration. Will
 * affect Reanimated code executed after call to this function so it should be
 * called before any Reanimated code is executed to take effect. Each call to
 * this function will override the previous configuration (it's recommended to
 * call it only once).
 *
 * @param config - The new logger configuration to apply.
 */
export function configureReanimatedLogger(config) {
  // Update the configuration object in the React runtime
  updateLoggerConfig(config);
  // Register the updated configuration in the UI runtime
  if (!SHOULD_BE_USE_WEB) {
    executeOnUIRuntimeSync(updateLoggerConfig)(config);
  }
}
const PROCESSED_VIEW_NAMES = new Set();
/**
 * Updates UI props whitelist for given view host instance this will work just
 * once for every view name
 */

export function adaptViewConfig(viewConfig) {
  const viewName = viewConfig.uiViewClassName;
  const props = viewConfig.validAttributes;

  // update whitelist of UI props for this view name only once
  if (!PROCESSED_VIEW_NAMES.has(viewName)) {
    const propsToAdd = {};
    Object.keys(props).forEach(key => {
      // we don't want to add native props as they affect layout
      // we also skip props which repeat here
      if (!(key in PropsAllowlists.NATIVE_THREAD_PROPS_WHITELIST) && !(key in PropsAllowlists.UI_THREAD_PROPS_WHITELIST)) {
        propsToAdd[key] = true;
      }
    });
    addWhitelistedUIProps(propsToAdd);
    PROCESSED_VIEW_NAMES.add(viewName);
  }
}
configureProps();
//# sourceMappingURL=ConfigHelper.js.map