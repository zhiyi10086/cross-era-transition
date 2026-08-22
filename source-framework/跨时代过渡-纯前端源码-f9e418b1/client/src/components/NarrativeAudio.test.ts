import { describe, expect, it } from "vitest";
import { AUDIO_PLACEHOLDERS } from "./NarrativeAudio";

describe("音频占位接口", () => {
  it("保留十二个待填充音频位置，但不绑定实际资源路径", () => {
    expect(AUDIO_PLACEHOLDERS).toHaveLength(12);
    expect(AUDIO_PLACEHOLDERS.every(({ todo, cue }) => todo.length > 0 && cue.length > 0)).toBe(true);
    expect(AUDIO_PLACEHOLDERS).toEqual(expect.arrayContaining([
      expect.objectContaining({ todo: "ACT1_BALANCE_GLITCH_AUDIO" }),
      expect.objectContaining({ todo: "ACT1_BUTTON_ERROR_TOAST_AUDIO" }),
      expect.objectContaining({ todo: "ACT1_ACCOUNT_FREEZE_AUDIO" }),
      expect.objectContaining({ todo: "ACT1_LEGACY_ACTION_CLICK_AUDIO" }),
      expect.objectContaining({ todo: "ACT2_ALERT_FADE_AUDIO" }),
    ]));
    expect(JSON.stringify(AUDIO_PLACEHOLDERS)).not.toContain("/manus-storage/");
    expect(JSON.stringify(AUDIO_PLACEHOLDERS)).not.toContain(".mp3");
  });
});
