export const MOTION_DURATION = {
  fast: 160,
  normal: 280,
  slow: 480,
} as const;

export const MOTION_EASING = {
  standard:
    "cubic-bezier(0.22, 1, 0.36, 1)",
  emphasized:
    "cubic-bezier(0.16, 1, 0.3, 1)",
  entrance:
    "cubic-bezier(0.33, 1, 0.68, 1)",
} as const;

export const MOTION_DISTANCE = {
  subtle: 8,
  normal: 16,
  strong: 28,
} as const;

export const MOTION_STAGGER = {
  fast: 50,
  normal: 90,
  slow: 140,
} as const;

export type MotionDuration =
  keyof typeof MOTION_DURATION;

export type MotionDistance =
  keyof typeof MOTION_DISTANCE;

export type MotionStagger =
  keyof typeof MOTION_STAGGER;
  