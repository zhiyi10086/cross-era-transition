/**
 * 《跨时代过渡》· 沉浸节奏契约
 * 设计提醒：时长与速度计算集中管理，防止各幕交互在后续素材接入后再次被压缩。
 */
export const IMMERSION_TIMELINE = {
  act1BalanceTickMs: 2_000,
  act1FailurePauseMs: 2_200,
  act2FaultBeatMs: 1_000,
  act2WaitObserveMs: 5_000,
  act2DnaFixMs: 2_800,
  act2RecoveryMs: 2_800,
  act2FragmentMs: 3_200,
  act3GalaxyTransitionMs: 3_000,
  act3EvolutionDurationMs: 20_000,
  act3AutoProgressTickMs: 100,
  act3AutoProgressDelta: 0.5,
  act3AutoAdvanceDelayMs: 860,
  act4CaptionHoldMs: 2_000,
  act4CaptionFadeOutMs: 400,
  act4LegacyObserveMs: 0,
  act4CrossfadeMs: 1_500,
  act5EarthPullbackDelayMs: 0,
  act5ReplayReadyMs: 3_000,
} as const;

export function getParticleDragVolume(intensity: number) {
  const normalized = Math.max(0, Math.min(1, intensity));
  return 0.42 * (0.12 + normalized * 0.88);
}

export function getDragIntensity(deltaPx: number, elapsedMs: number) {
  const distanceWeight = Math.max(0, deltaPx) / 55;
  const speedWeight = Math.max(0, deltaPx) / Math.max(10, elapsedMs) * 0.42;
  return Math.min(1, Math.max(0.18, distanceWeight, speedWeight));
}
