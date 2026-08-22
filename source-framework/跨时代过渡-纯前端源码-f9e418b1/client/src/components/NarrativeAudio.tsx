/**
 * 《跨时代过渡》· 音频占位接口
 * 当前阶段不加载或播放任何音频文件；待最终声音资产确认后，统一在对应标签上填入 src。
 */
export const AUDIO_PLACEHOLDERS = [
  { todo: "ACT1_ALERT_AUDIO", cue: "act1-alert" },
  { todo: "ACT1_BALANCE_GLITCH_AUDIO", cue: "balance-glitch" },
  { todo: "ACT1_BUTTON_ERROR_TOAST_AUDIO", cue: "button-error-toast" },
  { todo: "ACT1_ACCOUNT_FREEZE_AUDIO", cue: "account-freeze" },
  { todo: "ACT1_LEGACY_ACTION_CLICK_AUDIO", cue: "legacy-action-click" },
  { todo: "ACT2_ALERT_FADE_AUDIO", cue: "alert-fade" },
  { todo: "ACT2_ASSET_MAPPING_AUDIO", cue: "asset-mapping" },
  { todo: "ACT2_GLASS_FRACTURE_AUDIO", cue: "glass-fracture" },
  { todo: "ACT3_PARTICLE_DRAG_AUDIO", cue: "particle-drag" },
  { todo: "ACT4_TRANSITION_AUDIO", cue: "transition-sweep" },
  { todo: "UI_INPUT_SUBMIT_AUDIO", cue: "input-submit" },
  { todo: "ACT5_STARRY_AMBIENCE_AUDIO", cue: "starry-ambience" },
] as const;

export function NarrativeAudio() {
  return (
    <div className="narrative-audio-layer" aria-hidden="true">
      {/* <!-- TODO:ACT1_ALERT_AUDIO | 警报声渐弱；转场后淡出；进入 Act 02 前结束 --> */}
      <audio data-todo="TODO:ACT1_ALERT_AUDIO" data-cue="act1-alert" preload="none" />
      {/* <!-- TODO:ACT1_BALANCE_GLITCH_AUDIO | 正常数值→负数→乱码→红色警告的故障声 --> */}
      <audio data-todo="TODO:ACT1_BALANCE_GLITCH_AUDIO" data-cue="balance-glitch" preload="none" />
      {/* <!-- TODO:ACT1_BUTTON_ERROR_TOAST_AUDIO | 右侧按钮不可用提示弹出声 --> */}
      <audio data-todo="TODO:ACT1_BUTTON_ERROR_TOAST_AUDIO" data-cue="button-error-toast" preload="none" />
      {/* <!-- TODO:ACT1_ACCOUNT_FREEZE_AUDIO | 余额定格00.0 CNY并显示冻结的弹出声 --> */}
      <audio data-todo="TODO:ACT1_ACCOUNT_FREEZE_AUDIO" data-cue="account-freeze" preload="none" />
      {/* <!-- TODO:ACT1_LEGACY_ACTION_CLICK_AUDIO | 转账、理财、客服等任意按钮的点击声 --> */}
      <audio data-todo="TODO:ACT1_LEGACY_ACTION_CLICK_AUDIO" data-cue="legacy-action-click" preload="none" />
      {/* <!-- TODO:ACT2_ALERT_FADE_AUDIO | 第二幕警报声减弱的过渡声 --> */}
      <audio data-todo="TODO:ACT2_ALERT_FADE_AUDIO" data-cue="alert-fade" preload="none" />
      {/* <!-- TODO:ACT2_ASSET_MAPPING_AUDIO --> */}
      <audio data-todo="TODO:ACT2_ASSET_MAPPING_AUDIO" data-cue="asset-mapping" preload="none" />
      {/* <!-- TODO:ACT2_GLASS_FRACTURE_AUDIO --> */}
      <audio data-todo="TODO:ACT2_GLASS_FRACTURE_AUDIO" data-cue="glass-fracture" preload="none" />
      {/* <!-- TODO:ACT3_PARTICLE_DRAG_AUDIO --> */}
      <audio data-todo="TODO:ACT3_PARTICLE_DRAG_AUDIO" data-cue="particle-drag" preload="none" />
      {/* <!-- TODO:ACT4_TRANSITION_AUDIO --> */}
      <audio data-todo="TODO:ACT4_TRANSITION_AUDIO" data-cue="transition-sweep" preload="none" />
      {/* <!-- TODO:UI_INPUT_SUBMIT_AUDIO --> */}
      <audio data-todo="TODO:UI_INPUT_SUBMIT_AUDIO" data-cue="input-submit" preload="none" />
      {/* <!-- TODO:ACT5_STARRY_AMBIENCE_AUDIO --> */}
      <audio data-todo="TODO:ACT5_STARRY_AMBIENCE_AUDIO" data-cue="starry-ambience" preload="none" />
    </div>
  );
}
