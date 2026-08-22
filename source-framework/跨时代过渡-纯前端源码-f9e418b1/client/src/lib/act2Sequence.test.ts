import { describe, expect, it } from "vitest";
import { getAct2VisibleAssetSlots, getNextAct2SequenceStage } from "./act2Sequence";

describe("Act 02 严格串行动画契约", () => {
  it("初始选择和等待状态不暴露任何后续动画或素材占位", () => {
    expect(getAct2VisibleAssetSlots("choice")).toEqual([]);
    expect(getAct2VisibleAssetSlots("waiting")).toEqual([]);
  });

  it("仅按身份确认、DNA、恢复、碎裂、节点入口的顺序推进", () => {
    expect(getNextAct2SequenceStage("identity")).toBe("dna");
    expect(getNextAct2SequenceStage("dna")).toBe("recovery");
    expect(getNextAct2SequenceStage("recovery")).toBe("fragment");
    expect(getNextAct2SequenceStage("fragment")).toBe("node");
    expect(getNextAct2SequenceStage("node")).toBeNull();
    expect(getAct2VisibleAssetSlots("dna")).toEqual(["ACT2_KEY_DNA"]);
    expect(getAct2VisibleAssetSlots("recovery")).toEqual(["ACT2_CREDIT_BOARD"]);
    expect(getAct2VisibleAssetSlots("fragment")).toEqual(["ACT2_LEGACY_FRAGMENT"]);
  });
});
