/// <reference types="react" />
import type { ViewStyle, TextStyle, TransformsStyle, ImageStyle } from 'react-native';
import type { WorkletRuntime } from './runtimes';
export interface IWorkletsModule {
}
export interface IReanimatedModule {
    registerSensor(sensorType: number, interval: number, iosReferenceFrame: number, handler: ShareableRef<(data: Value3D | ValueRotation) => void>): number;
    unregisterSensor(sensorId: number): void;
    registerEventHandler<TValue>(eventHandler: ShareableRef<TValue>, eventName: string, emitterReactTag: number): number;
    unregisterEventHandler(id: number): void;
    getViewProp<TValue>(viewTag: number, propName: string, component: React.Component | undefined, callback?: (result: TValue) => void): Promise<TValue>;
    configureLayoutAnimationBatch(layoutAnimationsBatch: LayoutAnimationBatchItem[]): void;
    setShouldAnimateExitingForTag(viewTag: number, shouldAnimate: boolean): void;
    enableLayoutAnimations(flag: boolean): void;
    configureProps(uiProps: string[], nativeProps: string[]): void;
    subscribeForKeyboardEvents(handler: ShareableRef<number>, isStatusBarTranslucent: boolean, isNavigationBarTranslucent: boolean): number;
    unsubscribeFromKeyboardEvents(listenerId: number): void;
    makeShareableClone<TValue>(value: TValue, shouldPersistRemote: boolean, nativeStateSource?: object): ShareableRef<TValue>;
    scheduleOnUI<TValue>(shareable: ShareableRef<TValue>): void;
    executeOnUIRuntimeSync<TValue, TResult>(shareable: ShareableRef<TValue>): TResult;
    createWorkletRuntime(name: string, initializer: ShareableRef<() => void>): WorkletRuntime;
    scheduleOnRuntime<TValue>(workletRuntime: WorkletRuntime, shareableWorklet: ShareableRef<TValue>): void;
}
export type LayoutAnimationsOptions = 'originX' | 'originY' | 'width' | 'height' | 'borderRadius' | 'globalOriginX' | 'globalOriginY';
type CurrentLayoutAnimationsValues = {
    [K in LayoutAnimationsOptions as `current${Capitalize<string & K>}`]: number;
};
type TargetLayoutAnimationsValues = {
    [K in LayoutAnimationsOptions as `target${Capitalize<string & K>}`]: number;
};
interface WindowDimensions {
    windowWidth: number;
    windowHeight: number;
}
export interface KeyframeProps extends StyleProps {
    easing?: EasingFunction;
}
type FirstFrame = {
    0: KeyframeProps & {
        easing?: never;
    };
    from?: never;
} | {
    0?: never;
    from: KeyframeProps & {
        easing?: never;
    };
};
type LastFrame = {
    100?: KeyframeProps;
    to?: never;
} | {
    100?: never;
    to: KeyframeProps;
};
export type ValidKeyframeProps = FirstFrame & LastFrame & Record<number, KeyframeProps>;
export type MaybeInvalidKeyframeProps = Record<number, KeyframeProps> & {
    to?: KeyframeProps;
    from?: KeyframeProps;
};
export type LayoutAnimation = {
    initialValues: StyleProps;
    animations: StyleProps;
    callback?: (finished: boolean) => void;
};
export type AnimationFunction = (a?: any, b?: any, c?: any) => any;
export type EntryAnimationsValues = TargetLayoutAnimationsValues & WindowDimensions;
export type ExitAnimationsValues = CurrentLayoutAnimationsValues & WindowDimensions;
export type EntryExitAnimationFunction = ((targetValues: EntryAnimationsValues) => LayoutAnimation) | ((targetValues: ExitAnimationsValues) => LayoutAnimation) | (() => LayoutAnimation);
export type AnimationConfigFunction<T> = (targetValues: T) => LayoutAnimation;
export type LayoutAnimationsValues = CurrentLayoutAnimationsValues & TargetLayoutAnimationsValues & WindowDimensions;
export interface SharedTransitionAnimationsValues extends LayoutAnimationsValues {
    currentTransformMatrix: number[];
    targetTransformMatrix: number[];
}
export type SharedTransitionAnimationsFunction = (values: SharedTransitionAnimationsValues) => LayoutAnimation;
export declare enum LayoutAnimationType {
    ENTERING = 1,
    EXITING = 2,
    LAYOUT = 3,
    SHARED_ELEMENT_TRANSITION = 4,
    SHARED_ELEMENT_TRANSITION_PROGRESS = 5
}
export type LayoutAnimationFunction = (targetValues: LayoutAnimationsValues) => LayoutAnimation;
export type LayoutAnimationStartFunction = (tag: number, type: LayoutAnimationType, yogaValues: Partial<SharedTransitionAnimationsValues>, config: (arg: Partial<SharedTransitionAnimationsValues>) => LayoutAnimation) => void;
export interface ILayoutAnimationBuilder {
    build: () => LayoutAnimationFunction;
}
export interface BaseLayoutAnimationConfig {
    duration?: number;
    easing?: EasingFunction;
    type?: AnimationFunction;
    damping?: number;
    dampingRatio?: number;
    mass?: number;
    stiffness?: number;
    overshootClamping?: number;
    restDisplacementThreshold?: number;
    restSpeedThreshold?: number;
}
export interface BaseBuilderAnimationConfig extends BaseLayoutAnimationConfig {
    rotate?: number | string;
}
export type LayoutAnimationAndConfig = [
    AnimationFunction,
    BaseBuilderAnimationConfig
];
export interface IEntryExitAnimationBuilder {
    build: () => EntryExitAnimationFunction;
}
export interface IEntryAnimationBuilder {
    build: () => AnimationConfigFunction<EntryAnimationsValues>;
}
export interface IExitAnimationBuilder {
    build: () => AnimationConfigFunction<ExitAnimationsValues>;
}
export type ProgressAnimationCallback = (viewTag: number, progress: number) => void;
export type ProgressAnimation = (viewTag: number, values: SharedTransitionAnimationsValues, progress: number) => void;
export type CustomProgressAnimation = (values: SharedTransitionAnimationsValues, progress: number) => StyleProps;
/**
 * Used to configure the `.defaultTransitionType()` shared transition modifier.
 *
 * @experimental
 */
export declare enum SharedTransitionType {
    ANIMATION = "animation",
    PROGRESS_ANIMATION = "progressAnimation"
}
export type EntryExitAnimationsValues = EntryAnimationsValues | ExitAnimationsValues;
export type StylePropsWithArrayTransform = StyleProps & {
    transform?: TransformArrayItem[];
};
export interface LayoutAnimationBatchItem {
    viewTag: number;
    type: LayoutAnimationType;
    config: ShareableRef<Keyframe | LayoutAnimationFunction | SharedTransitionAnimationsFunction | ProgressAnimationCallback> | undefined;
    sharedTransitionTag?: string;
}
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
export interface StyleProps extends ViewStyle, TextStyle {
    originX?: number;
    originY?: number;
    [key: string]: any;
}
/**
 * A value that can be used both on the [JavaScript
 * thread](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#javascript-thread)
 * and the [UI
 * thread](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/glossary#ui-thread).
 *
 * Shared values are defined using
 * [useSharedValue](https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue)
 * hook. You access and modify shared values by their `.value` property.
 */
export interface SharedValue<Value = unknown> {
    value: Value;
    get(): Value;
    set(value: Value | ((value: Value) => Value)): void;
    addListener: (listenerID: number, listener: (value: Value) => void) => void;
    removeListener: (listenerID: number) => void;
    modify: (modifier?: <T extends Value>(value: T) => T, forceUpdate?: boolean) => void;
}
/**
 * Due to pattern of `MaybeSharedValue` type present in `AnimatedProps`
 * (`AnimatedStyle`), contravariance breaks types for animated styles etc.
 * Instead of refactoring the code with small chances of success, we just
 * disable contravariance for `SharedValue` in this problematic case.
 */
type SharedValueDisableContravariance<Value = unknown> = Omit<SharedValue<Value>, 'set'>;
export interface Mutable<Value = unknown> extends SharedValue<Value> {
    _isReanimatedSharedValue: true;
    _animation?: AnimationObject<Value> | null;
    /**
     * `_value` prop should only be accessed by the `valueSetter` implementation
     * which may make the decision about updating the mutable value depending on
     * the provided new value. All other places should only attempt to modify the
     * mutable by assigning to `value` prop directly or by calling the `set`
     * method.
     */
    _value: Value;
}
export type ShareableRef<T = unknown> = {
    __hostObjectShareableJSRef: T;
};
export type FlatShareableRef<T> = T extends ShareableRef<infer U> ? ShareableRef<U> : ShareableRef<T>;
export type MapperRawInputs = unknown[];
export type MapperOutputs = SharedValue[];
export type MapperRegistry = {
    start: (mapperID: number, worklet: () => void, inputs: MapperRawInputs, outputs?: MapperOutputs) => void;
    stop: (mapperID: number) => void;
};
export type WorkletStackDetails = [
    error: Error,
    lineOffset: number,
    columnOffset: number
];
type WorkletClosure = Record<string, unknown>;
interface WorkletInitDataCommon {
    code: string;
}
type WorkletInitDataRelease = WorkletInitDataCommon;
interface WorkletInitDataDev extends WorkletInitDataCommon {
    location: string;
    sourceMap: string;
    version: string;
}
interface WorkletBaseCommon {
    __closure: WorkletClosure;
    __workletHash: number;
}
interface WorkletBaseRelease extends WorkletBaseCommon {
    __initData: WorkletInitDataRelease;
}
interface WorkletBaseDev extends WorkletBaseCommon {
    __initData: WorkletInitDataDev;
    /** `__stackDetails` is removed after parsing. */
    __stackDetails?: WorkletStackDetails;
}
export type WorkletFunction<Args extends unknown[] = unknown[], ReturnValue = unknown> = ((...args: Args) => ReturnValue) & (WorkletBaseRelease | WorkletBaseDev);
/**
 * This function allows you to determine if a given function is a worklet. It
 * only works with Reanimated Babel plugin enabled. Unless you are doing
 * something with internals of Reanimated you shouldn't need to use this
 * function.
 *
 * ### Note
 *
 * Do not call it before the worklet is declared, as it will always return false
 * then. E.g.:
 *
 * ```ts
 * isWorkletFunction(myWorklet); // Will always return false.
 *
 * function myWorklet() {
 *   'worklet';
 * }
 * ```
 *
 * ### Maintainer note
 *
 * This function is supposed to be used only in the React Runtime. It always
 * returns `false` in Worklet Runtimes.
 */
export declare function isWorkletFunction<Args extends unknown[] = unknown[], ReturnValue = unknown, BuildType extends WorkletBaseDev | WorkletBaseRelease = WorkletBaseDev>(value: unknown): value is WorkletFunction<Args, ReturnValue> & BuildType;
export type AnimatedPropsAdapterFunction = (props: Record<string, unknown>) => void;
export type AnimatedPropsAdapterWorklet = WorkletFunction<[
    props: Record<string, unknown>
], void>;
export interface NestedObject<T> {
    [key: string]: NestedObjectValues<T>;
}
export type NestedObjectValues<T> = T | Array<NestedObjectValues<T>> | NestedObject<T>;
type Animatable = number | string | Array<number>;
export type AnimatableValueObject = {
    [key: string]: Animatable;
};
export type AnimatableValue = Animatable | AnimatableValueObject;
export interface AnimationObject<T = AnimatableValue> {
    [key: string]: any;
    callback?: AnimationCallback;
    current?: T;
    toValue?: AnimationObject<T>['current'];
    startValue?: AnimationObject<T>['current'];
    finished?: boolean;
    strippedCurrent?: number;
    cancelled?: boolean;
    reduceMotion?: boolean;
    __prefix?: string;
    __suffix?: string;
    onFrame: (animation: any, timestamp: Timestamp) => boolean;
    onStart: (nextAnimation: any, current: any, timestamp: Timestamp, previousAnimation: any) => void;
}
export interface Animation<T extends AnimationObject> extends AnimationObject {
    onFrame: (animation: T, timestamp: Timestamp) => boolean;
    onStart: (nextAnimation: T, current: AnimatableValue, timestamp: Timestamp, previousAnimation: Animation<any> | null | T) => void;
}
export declare enum SensorType {
    ACCELEROMETER = 1,
    GYROSCOPE = 2,
    GRAVITY = 3,
    MAGNETIC_FIELD = 4,
    ROTATION = 5
}
export declare enum IOSReferenceFrame {
    XArbitraryZVertical = 0,
    XArbitraryCorrectedZVertical = 1,
    XMagneticNorthZVertical = 2,
    XTrueNorthZVertical = 3,
    Auto = 4
}
export type SensorConfig = {
    interval: number | 'auto';
    adjustToInterfaceOrientation: boolean;
    iosReferenceFrame: IOSReferenceFrame;
};
export type AnimatedSensor<T extends Value3D | ValueRotation> = {
    sensor: SharedValue<T>;
    unregister: () => void;
    isAvailable: boolean;
    config: SensorConfig;
};
/**
 * A function called upon animation completion. If the animation is cancelled,
 * the callback will receive `false` as the argument; otherwise, it will receive
 * `true`.
 */
export type AnimationCallback = (finished?: boolean, current?: AnimatableValue) => void;
export type Timestamp = number;
export type Value3D = {
    x: number;
    y: number;
    z: number;
    interfaceOrientation: InterfaceOrientation;
};
export type ValueRotation = {
    qw: number;
    qx: number;
    qy: number;
    qz: number;
    yaw: number;
    pitch: number;
    roll: number;
    interfaceOrientation: InterfaceOrientation;
};
export declare enum InterfaceOrientation {
    ROTATION_0 = 0,
    ROTATION_90 = 90,
    ROTATION_180 = 180,
    ROTATION_270 = 270
}
export type ShadowNodeWrapper = {
    __hostObjectShadowNodeWrapper: never;
};
export declare enum KeyboardState {
    UNKNOWN = 0,
    OPENING = 1,
    OPEN = 2,
    CLOSING = 3,
    CLOSED = 4
}
export type AnimatedKeyboardInfo = {
    height: SharedValue<number>;
    state: SharedValue<KeyboardState>;
};
/**
 * @param x - A number representing X coordinate relative to the parent
 *   component.
 * @param y - A number representing Y coordinate relative to the parent
 *   component.
 * @param width - A number representing the width of the component.
 * @param height - A number representing the height of the component.
 * @param pageX - A number representing X coordinate relative to the screen.
 * @param pageY - A number representing Y coordinate relative to the screen.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/advanced/measure#returns
 */
export interface MeasuredDimensions {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
}
export interface AnimatedKeyboardOptions {
    isStatusBarTranslucentAndroid?: boolean;
    isNavigationBarTranslucentAndroid?: boolean;
}
/**
 * @param System - If the `Reduce motion` accessibility setting is enabled on
 *   the device, disable the animation. Otherwise, enable the animation.
 * @param Always - Disable the animation.
 * @param Never - Enable the animation.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility
 */
export declare enum ReduceMotion {
    System = "system",
    Always = "always",
    Never = "never"
}
export type EasingFunction = (t: number) => number;
export type TransformArrayItem = Extract<TransformsStyle['transform'], Array<unknown>>[number];
type MaybeSharedValue<Value> = Value | (Value extends AnimatableValue ? SharedValueDisableContravariance<Value> : never);
type MaybeSharedValueRecursive<Value> = Value extends (infer Item)[] ? SharedValueDisableContravariance<Item[]> | (MaybeSharedValueRecursive<Item> | Item)[] : Value extends object ? SharedValueDisableContravariance<Value> | {
    [Key in keyof Value]: MaybeSharedValueRecursive<Value[Key]> | Value[Key];
} : MaybeSharedValue<Value>;
type DefaultStyle = ViewStyle & ImageStyle & TextStyle;
export type AnimatedStyle<Style = DefaultStyle> = Style | MaybeSharedValueRecursive<Style>;
export type AnimatedTransform = MaybeSharedValueRecursive<TransformsStyle['transform']>;
/** @deprecated Please use {@link AnimatedStyle} type instead. */
export type AnimateStyle<Style = DefaultStyle> = AnimatedStyle<Style>;
/** @deprecated This type is no longer relevant. */
export type StylesOrDefault<T> = 'style' extends keyof T ? MaybeSharedValueRecursive<T['style']> : Record<string, unknown>;
export {};
//# sourceMappingURL=commonTypes.d.ts.map