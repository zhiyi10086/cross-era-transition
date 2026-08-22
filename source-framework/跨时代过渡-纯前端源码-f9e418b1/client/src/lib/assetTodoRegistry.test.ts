/**
 * 《跨时代过渡》· 素材接口测试
 * 设计提醒：确保脚本表格要求的替换接口不会在后续填充素材时遗漏或发生重复命名。
 */
import { describe, expect, it } from "vitest";
import { ASSET_TODO } from "./assetTodoRegistry";

describe("素材 TODO 接口", () => {
  it("覆盖五幕所需的全部可替换素材位", () => {
    expect(Object.keys(ASSET_TODO)).toHaveLength(11);
    expect(ASSET_TODO).toHaveProperty("ACT1_OLD_BANKING_UI");
    expect(ASSET_TODO).toHaveProperty("ACT3_GALAXY_PARTICLE_TRANSITION");
    expect(ASSET_TODO).toHaveProperty("ACT3_HIGH_FIDELITY_PARTICLES");
    expect(ASSET_TODO).toHaveProperty("ACT5_CAMERA_PULLBACK");
  });

  it("为每个接口保留可读填充说明", () => {
    expect(Object.values(ASSET_TODO).every((label) => label.length > 8)).toBe(true);
  });
});
