/**
 * 《跨时代过渡》· 素材接口注册表
 * 设计提醒：每一个可替换素材都必须在此拥有唯一 TODO 标记，并由页面中的 data-todo 与可见灰色占位块共同定位。
 */

/* <!-- TODO:ACT1_OLD_BANKING_UI --> */
/* <!-- TODO:ACT1_ALERT_AUDIO --> */
/* <!-- TODO:ACT2_LEGACY_FRAGMENT --> */
/* <!-- TODO:ACT2_CREDIT_BOARD --> */
/* <!-- TODO:ACT2_KEY_DNA --> */
/* <!-- TODO: 银河粒子旋转过渡 --> */
/* <!-- TODO:ACT3_HIGH_FIDELITY_PARTICLES --> */
/* <!-- TODO:ACT4_LEGACY_TRAINING_UI --> */
/* <!-- TODO:ACT5_EARTH_ASSET --> */
/* <!-- TODO:ACT5_PARTICLE_ORBIT --> */
/* <!-- TODO:ACT5_CAMERA_PULLBACK --> */

export const ASSET_TODO = {
  ACT1_OLD_BANKING_UI: "2010年代蓝色主调旧世界银行界面、Logo与整齐按钮",
  ACT1_ALERT_AUDIO: "低频嗡鸣与节奏加快的间断警报；在Act 1循环，进入Act 2后继续2.2秒并渐弱至静音；仅保留 audio 占位，默认不播放",
  ACT2_LEGACY_FRAGMENT: "旧银行界面从边缘碎裂脱落的替换动画",
  ACT2_CREDIT_BOARD: "显示信用单位数值的新看板浮现动画",
  ACT2_KEY_DNA: "密钥字符DNA螺旋组合动画",
  ACT3_GALAXY_PARTICLE_TRANSITION: "旧世界碎裂后、三秒钟银河粒子旋转流动的过渡空间",
  ACT3_HIGH_FIDELITY_PARTICLES: "替换Canvas占位为高质量粒子或WebGL网络",
  ACT4_LEGACY_TRAINING_UI: "旧机构培训页的Logo、课表、价格与报名素材",
  ACT5_EARTH_ASSET: "地球屏幕或截图素材",
  ACT5_PARTICLE_ORBIT: "地球粒子节点包围素材",
  ACT5_CAMERA_PULLBACK: "镜头拉远至星星的CSS或视频替换动画",
} as const;

export type AssetTodoKey = keyof typeof ASSET_TODO;
