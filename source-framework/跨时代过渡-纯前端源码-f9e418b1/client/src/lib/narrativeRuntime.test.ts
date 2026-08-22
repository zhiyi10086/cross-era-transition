import { describe, expect, it } from "vitest";
import {
  createInitialNarrativeState,
  getAct5AutomaticFinaleState,
  getNextFirstActBankClicks,
  getReplayReadyAct1State,
} from "./narrativeRuntime";

describe("终章自动触发与重新体验状态契约", () => {
  it("提交愿景时同时进入共建者确认和地球拉远状态，不要求二次点击", () => {
    expect(getAct5AutomaticFinaleState()).toEqual({
      wishSubmitted: true,
      screensaver: true,
      replayReady: false,
    });
  });

  it("重新体验释放交互锁并恢复可再次操作的第一幕基线", () => {
    const replayState = getReplayReadyAct1State();

    expect(replayState.runtime).toEqual({
      transitionLocked: false,
      bankPending: false,
      isTransitioning: false,
    });
    expect(replayState.narrative).toEqual(createInitialNarrativeState());
    expect(replayState.narrative.currentAct).toBe(1);
    expect(replayState.narrative.bankClicks).toBe(0);
  });

  it("重播完成后第一幕的首次按钮操作会再次被接受并推进失效计数", () => {
    const replayState = getReplayReadyAct1State();

    expect(getNextFirstActBankClicks(replayState.narrative, replayState.runtime)).toBe(1);
    expect(getNextFirstActBankClicks(replayState.narrative, { ...replayState.runtime, transitionLocked: true })).toBeNull();
    expect(getNextFirstActBankClicks(replayState.narrative, { ...replayState.runtime, bankPending: true })).toBeNull();
  });
});
