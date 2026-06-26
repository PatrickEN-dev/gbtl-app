// src/lib/animations.ts
import { useEffect } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  Easing as ReanimatedEasing,
  SharedValue,
} from 'react-native-reanimated'

// ─── Duration tokens ─────────────────────────────────────────────────────────
export const Duration = {
  fast: 150,
  base: 250,
  slow: 400,
  lazy: 600,
} as const

// ─── Easing tokens ───────────────────────────────────────────────────────────
export const Easing = {
  standard:   ReanimatedEasing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: ReanimatedEasing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: ReanimatedEasing.bezier(0.4, 0.0, 1.0, 1),
} as const

// ─── Spring tokens ───────────────────────────────────────────────────────────
export const Spring = {
  gentle: { damping: 15, stiffness: 150 },
  snappy: { damping: 12, stiffness: 200 },
} as const

// ─── useFadeInUp ─────────────────────────────────────────────────────────────
export function useFadeInUp(delay = 0) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(20)

  useEffect(() => {
    const config = { duration: Duration.slow, easing: Easing.decelerate }
    if (delay > 0) {
      opacity.value    = withTiming(0, { duration: 0 })
      translateY.value = withTiming(20, { duration: 0 })
      const timer = setTimeout(() => {
        opacity.value    = withTiming(1, config)
        translateY.value = withTiming(0, config)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      opacity.value    = withTiming(1, config)
      translateY.value = withTiming(0, config)
    }
  }, [delay])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return { animatedStyle }
}

// ─── useScaleIn ──────────────────────────────────────────────────────────────
export function useScaleIn(delay = 0) {
  const scale   = useSharedValue(0.92)
  const opacity = useSharedValue(0)

  useEffect(() => {
    const config = { duration: Duration.slow, easing: Easing.decelerate }
    if (delay > 0) {
      const timer = setTimeout(() => {
        scale.value   = withTiming(1, config)
        opacity.value = withTiming(1, config)
      }, delay)
      return () => clearTimeout(timer)
    } else {
      scale.value   = withTiming(1, config)
      opacity.value = withTiming(1, config)
    }
  }, [delay])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ scale: scale.value }],
  }))

  return { animatedStyle }
}

// ─── useSlideInRight ─────────────────────────────────────────────────────────
export function useSlideInRight() {
  const translateX = useSharedValue(40)
  const opacity    = useSharedValue(0)

  useEffect(() => {
    const config = { duration: Duration.slow, easing: Easing.decelerate }
    translateX.value = withTiming(0, config)
    opacity.value    = withTiming(1, config)
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateX: translateX.value }],
  }))

  return { animatedStyle }
}

// ─── useStagger ──────────────────────────────────────────────────────────────
// Max 10 staggered items. Hooks are declared unconditionally at the top level
// (React rules of hooks: no hooks inside loops/callbacks).
export function useStagger(count: number, baseDelay: number) {
  // Pre-declare 10 opacity shared values
  const o0 = useSharedValue(0); const o1 = useSharedValue(0)
  const o2 = useSharedValue(0); const o3 = useSharedValue(0)
  const o4 = useSharedValue(0); const o5 = useSharedValue(0)
  const o6 = useSharedValue(0); const o7 = useSharedValue(0)
  const o8 = useSharedValue(0); const o9 = useSharedValue(0)

  // Pre-declare 10 translateY shared values
  const t0 = useSharedValue(20); const t1 = useSharedValue(20)
  const t2 = useSharedValue(20); const t3 = useSharedValue(20)
  const t4 = useSharedValue(20); const t5 = useSharedValue(20)
  const t6 = useSharedValue(20); const t7 = useSharedValue(20)
  const t8 = useSharedValue(20); const t9 = useSharedValue(20)

  const opacities   = [o0, o1, o2, o3, o4, o5, o6, o7, o8, o9]
  const translateYs = [t0, t1, t2, t3, t4, t5, t6, t7, t8, t9]

  useEffect(() => {
    const cfg = { duration: Duration.slow, easing: Easing.decelerate }
    const timers: ReturnType<typeof setTimeout>[] = []
    const safeCount = Math.min(count, 10)
    for (let i = 0; i < safeCount; i++) {
      const timer = setTimeout(() => {
        opacities[i].value   = withTiming(1, cfg)
        translateYs[i].value = withTiming(0, cfg)
      }, i * baseDelay)
      timers.push(timer)
    }
    return () => timers.forEach(clearTimeout)
  }, [count, baseDelay])

  // Pre-declare 10 animated styles — all at top level (no hooks in loops)
  const s0 = useAnimatedStyle(() => ({ opacity: o0.value, transform: [{ translateY: t0.value }] }))
  const s1 = useAnimatedStyle(() => ({ opacity: o1.value, transform: [{ translateY: t1.value }] }))
  const s2 = useAnimatedStyle(() => ({ opacity: o2.value, transform: [{ translateY: t2.value }] }))
  const s3 = useAnimatedStyle(() => ({ opacity: o3.value, transform: [{ translateY: t3.value }] }))
  const s4 = useAnimatedStyle(() => ({ opacity: o4.value, transform: [{ translateY: t4.value }] }))
  const s5 = useAnimatedStyle(() => ({ opacity: o5.value, transform: [{ translateY: t5.value }] }))
  const s6 = useAnimatedStyle(() => ({ opacity: o6.value, transform: [{ translateY: t6.value }] }))
  const s7 = useAnimatedStyle(() => ({ opacity: o7.value, transform: [{ translateY: t7.value }] }))
  const s8 = useAnimatedStyle(() => ({ opacity: o8.value, transform: [{ translateY: t8.value }] }))
  const s9 = useAnimatedStyle(() => ({ opacity: o9.value, transform: [{ translateY: t9.value }] }))

  return [s0, s1, s2, s3, s4, s5, s6, s7, s8, s9].slice(0, Math.min(count, 10))
}

// ─── usePressScale ───────────────────────────────────────────────────────────
export function usePressScale(scale = 0.96) {
  const scaleValue = useSharedValue(1)

  const handlePressIn = () => {
    scaleValue.value = withSpring(scale, Spring.snappy)
  }

  const handlePressOut = () => {
    scaleValue.value = withSpring(1, Spring.snappy)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }))

  return { animatedStyle, handlePressIn, handlePressOut }
}

// ─── useCartBounce ───────────────────────────────────────────────────────────
export function useCartBounce() {
  const scale = useSharedValue(1)

  const trigger = () => {
    scale.value = withSequence(
      withSpring(1.3, Spring.snappy),
      withSpring(1,   Spring.gentle)
    )
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return { animatedStyle, trigger }
}

// ─── useShimmer ──────────────────────────────────────────────────────────────
export function useShimmer() {
  const translateX = useSharedValue(-300)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, { duration: 1000, easing: Easing.standard }),
      -1,
      false
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return { animatedStyle }
}

// ─── useParallax ─────────────────────────────────────────────────────────────
export function useParallax(
  scrollY: SharedValue<number>,
  factor = 0.3
) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scrollY.value * factor }],
  }))

  return { animatedStyle }
}
