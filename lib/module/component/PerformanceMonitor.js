'use strict';

import React, { useEffect, useRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { useSharedValue, useAnimatedProps, useFrameCallback } from "../hook/index.js";
import { createAnimatedComponent } from "../createAnimatedComponent/index.js";
import { addWhitelistedNativeProps } from "../ConfigHelper.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function createCircularDoublesBuffer(size) {
  'worklet';

  return {
    next: 0,
    buffer: new Float32Array(size),
    size,
    count: 0,
    push(value) {
      const oldValue = this.buffer[this.next];
      const oldCount = this.count;
      this.buffer[this.next] = value;
      this.next = (this.next + 1) % this.size;
      this.count = Math.min(this.size, this.count + 1);
      return oldCount === this.size ? oldValue : null;
    },
    front() {
      const notEmpty = this.count > 0;
      if (notEmpty) {
        const current = this.next - 1;
        const index = current < 0 ? this.size - 1 : current;
        return this.buffer[index];
      }
      return null;
    },
    back() {
      const notEmpty = this.count > 0;
      return notEmpty ? this.buffer[this.next] : null;
    }
  };
}
const DEFAULT_BUFFER_SIZE = 20;
addWhitelistedNativeProps({
  text: true
});
const AnimatedTextInput = createAnimatedComponent(TextInput);
function loopAnimationFrame(fn) {
  let lastTime = 0;
  function loop() {
    requestAnimationFrame(time => {
      if (lastTime > 0) {
        fn(lastTime, time);
      }
      lastTime = time;
      requestAnimationFrame(loop);
    });
  }
  loop();
}
function getFps(renderTimeInMs) {
  'worklet';

  return 1000 / renderTimeInMs;
}
function completeBufferRoutine(buffer, timestamp) {
  'worklet';

  timestamp = Math.round(timestamp);
  const droppedTimestamp = buffer.push(timestamp) ?? timestamp;
  const measuredRangeDuration = timestamp - droppedTimestamp;
  return getFps(measuredRangeDuration / buffer.count);
}
function JsPerformance({
  smoothingFrames
}) {
  const jsFps = useSharedValue(null);
  const totalRenderTime = useSharedValue(0);
  const circularBuffer = useRef(createCircularDoublesBuffer(smoothingFrames));
  useEffect(() => {
    loopAnimationFrame((_, timestamp) => {
      timestamp = Math.round(timestamp);
      const currentFps = completeBufferRoutine(circularBuffer.current, timestamp);

      // JS fps have to be measured every 2nd frame,
      // thus 2x multiplication has to occur here
      jsFps.value = (currentFps * 2).toFixed(0);
    });
  }, [jsFps, totalRenderTime]);
  const animatedProps = useAnimatedProps(() => {
    const text = 'JS: ' + (jsFps.value ?? 'N/A') + ' ';
    return {
      text,
      defaultValue: text
    };
  });
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(AnimatedTextInput, {
      style: styles.text,
      animatedProps: animatedProps,
      editable: false
    })
  });
}
function UiPerformance({
  smoothingFrames
}) {
  const uiFps = useSharedValue(null);
  const circularBuffer = useSharedValue(null);
  useFrameCallback(({
    timestamp
  }) => {
    if (circularBuffer.value === null) {
      circularBuffer.value = createCircularDoublesBuffer(smoothingFrames);
    }
    timestamp = Math.round(timestamp);
    const currentFps = completeBufferRoutine(circularBuffer.value, timestamp);
    uiFps.value = currentFps.toFixed(0);
  });
  const animatedProps = useAnimatedProps(() => {
    const text = 'UI: ' + (uiFps.value ?? 'N/A') + ' ';
    return {
      text,
      defaultValue: text
    };
  });
  return /*#__PURE__*/_jsx(View, {
    style: styles.container,
    children: /*#__PURE__*/_jsx(AnimatedTextInput, {
      style: styles.text,
      animatedProps: animatedProps,
      editable: false
    })
  });
}
/**
 * A component that lets you measure fps values on JS and UI threads on both the
 * Paper and Fabric architectures.
 *
 * @param smoothingFrames - Determines amount of saved frames which will be used
 *   for fps value smoothing.
 */
export function PerformanceMonitor({
  smoothingFrames = DEFAULT_BUFFER_SIZE
}) {
  return /*#__PURE__*/_jsxs(View, {
    style: styles.monitor,
    children: [/*#__PURE__*/_jsx(JsPerformance, {
      smoothingFrames: smoothingFrames
    }), /*#__PURE__*/_jsx(UiPerformance, {
      smoothingFrames: smoothingFrames
    })]
  });
}
const styles = StyleSheet.create({
  monitor: {
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: '#0006',
    zIndex: 1000
  },
  header: {
    fontSize: 14,
    color: '#ffff',
    paddingHorizontal: 5
  },
  text: {
    fontSize: 13,
    color: '#ffff',
    fontFamily: 'monospace',
    paddingHorizontal: 3
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
});
//# sourceMappingURL=PerformanceMonitor.js.map