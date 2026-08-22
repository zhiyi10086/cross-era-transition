/**
 * 《跨时代过渡》· 重新体验重置契约
 * 重新回到第一幕后必须显式释放叙事转场锁和首幕待处理标记，
 * 否则按钮会在视觉重置完成后仍保持禁用状态。
 */
export const REPLAY_SETTLE_MS = 620;

export function getReplayReleasedRuntimeState() {
  return {
    transitionLocked: false,
    bankPending: false,
    isTransitioning: false,
  } as const;
}
