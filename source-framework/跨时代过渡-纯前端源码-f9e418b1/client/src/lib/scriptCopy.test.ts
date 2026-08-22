/**
 * 《跨时代过渡》· 定稿文案合约测试
 * 设计提醒：用最小测试锁定用户已确认的关键句，避免后续填充素材时意外改写叙事主线。
 */
import { describe, expect, it } from "vitest";
import { SCRIPT_COPY } from "./scriptCopy";

describe("叙述脚本定稿", () => {
  it("保留五幕的锁定主文案", () => {
    expect(SCRIPT_COPY.act1.title).toBe("中心不再可信");
    expect(SCRIPT_COPY.act1.closing).toBe("系统将于 3 小时 47 分后关闭，请做好资产备份");
    expect(SCRIPT_COPY.act2.waitHint).toBe("中心化系统报错 预计恢复时间：未知");
    expect(SCRIPT_COPY.act2.keyHint).toBe("无需等待·即刻启动·数字身份·主权回归");
    expect("flash" in SCRIPT_COPY.act3).toBe(false);
    expect(SCRIPT_COPY.act4.caption).toBe("当网络重构完成，去中心化来到最具体的日常生活中。");
    expect(SCRIPT_COPY.act4.title).toBe("告诉我你的目标 · 为你生成专属学习路径");
    expect(SCRIPT_COPY.act4.start).toBe("开始我的学习");
    expect(SCRIPT_COPY.act5.title).toBe("时代褶皱");
  });

  it("保留脚本要求的输入占位与三段网络标签", () => {
    expect(SCRIPT_COPY.act5.placeholder).toBe("你想在新世界中创造什么？");
    expect(SCRIPT_COPY.act3.labels).toEqual(["枢纽·单点", "多极·竞争", "网络·共识"]);
  });
});
