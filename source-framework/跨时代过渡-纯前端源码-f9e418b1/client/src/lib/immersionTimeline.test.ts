import { describe, expect, it } from "vitest";
import { getDragIntensity, getParticleDragVolume, IMMERSION_TIMELINE } from "./immersionTimeline";

describe("沉浸式节奏契约", () => {
  it("将第一幕余额跳动、第二幕串行阶段与第四幕自动转场锁定为共享规范时序", () => {
    expect(IMMERSION_TIMELINE.act1BalanceTickMs).toBe(2_000);
    expect(IMMERSION_TIMELINE.act2WaitObserveMs).toBe(5_000);
    expect(IMMERSION_TIMELINE.act2DnaFixMs).toBeGreaterThan(0);
    expect(IMMERSION_TIMELINE.act2RecoveryMs).toBeGreaterThan(0);
    expect(IMMERSION_TIMELINE.act2FragmentMs).toBeGreaterThan(0);
    expect(IMMERSION_TIMELINE.act3GalaxyTransitionMs).toBe(3_000);
    expect(IMMERSION_TIMELINE.act3EvolutionDurationMs).toBe(20_000);
    expect(IMMERSION_TIMELINE.act3AutoProgressTickMs).toBe(100);
    expect(IMMERSION_TIMELINE.act3AutoProgressDelta).toBeCloseTo(0.5);
    expect(
      IMMERSION_TIMELINE.act3AutoProgressTickMs * (100 / IMMERSION_TIMELINE.act3AutoProgressDelta),
    ).toBe(IMMERSION_TIMELINE.act3EvolutionDurationMs);
    expect(IMMERSION_TIMELINE.act3AutoAdvanceDelayMs).toBe(860);
    expect(IMMERSION_TIMELINE.act4CaptionHoldMs).toBe(2_000);
    expect(IMMERSION_TIMELINE.act4CaptionFadeOutMs).toBe(400);
    expect(IMMERSION_TIMELINE.act4LegacyObserveMs).toBe(0);
    expect(IMMERSION_TIMELINE.act4CrossfadeMs).toBe(1_500);
    expect(IMMERSION_TIMELINE.act5EarthPullbackDelayMs).toBe(0);
    expect(IMMERSION_TIMELINE.act5ReplayReadyMs).toBeGreaterThanOrEqual(2_600);
  });

  it("按拖动速度增加粒子音效音量，并限制最大值", () => {
    expect(getParticleDragVolume(0.15)).toBeLessThan(getParticleDragVolume(0.8));
    expect(getParticleDragVolume(2)).toBeCloseTo(0.42);
    expect(getParticleDragVolume(-1)).toBeCloseTo(0.0504);
    const slowIntensity = getDragIntensity(16, 650);
    const fastIntensity = getDragIntensity(95, 12);
    expect(fastIntensity).toBeGreaterThan(slowIntensity);
    expect(getParticleDragVolume(fastIntensity)).toBeGreaterThan(getParticleDragVolume(slowIntensity));
  });
});
