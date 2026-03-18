/** 统一的动效配置 */
export const spring = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
}

export const springSoft = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
}

export const tween = {
  duration: 0.35,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

export const fadeInUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] },
}

export const staggerContainer = (delayChildren = 0.05, staggerChildren = 0.06) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
})

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}
