import { describe, expect, it } from "vitest";
import { getReplayReleasedRuntimeState, REPLAY_SETTLE_MS } from "./replayReset";

describe("重新体验重置契约", () => {
  it("在首幕重置动画结束后释放转场锁、待处理状态与交互遮罩", () => {
    expect(REPLAY_SETTLE_MS).toBe(620);
    expect(getReplayReleasedRuntimeState()).toEqual({
      transitionLocked: false,
      bankPending: false,
      isTransitioning: false,
    });
  });
});
