#pragma once

#include <ReactCommon/CallInvoker.h>
#include <ReactCommon/RuntimeExecutor.h>
#include <jsi/jsi.h>

#include <memory>

using namespace facebook;
using namespace react;

namespace worklets {

class JSScheduler {
  using Job = std::function<void(jsi::Runtime &rt)>;

 public:
  // With `jsCallInvoker`.
  explicit JSScheduler(
      jsi::Runtime &rnRuntime,
      const std::shared_ptr<CallInvoker> &jsCallInvoker);

#ifdef RCT_NEW_ARCH_ENABLED
  // With `runtimeExecutor`.
  explicit JSScheduler(
      jsi::Runtime &rnRuntime,
      RuntimeExecutor runtimeExecutor);
#endif // RCT_NEW_ARCH_ENABLED

  const std::function<void(Job)> scheduleOnJS = nullptr;
  const std::shared_ptr<CallInvoker> getJSCallInvoker() const;

 protected:
  jsi::Runtime &rnRuntime_;
#ifdef RCT_NEW_ARCH_ENABLED
  RuntimeExecutor runtimeExecutor_ = nullptr;
#endif // RCT_NEW_ARCH_ENABLED
  const std::shared_ptr<CallInvoker> jsCallInvoker_ = nullptr;
};

} // namespace worklets