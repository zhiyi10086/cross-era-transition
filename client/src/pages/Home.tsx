/**
 * 时代褶皱设计规范：本页以“硬边旧终端逐层剥落，露出流动星海”为唯一叙事语言。
 * 所有关键动作均由用户点击、输入或右向拖动推进；共识青蓝只用于可前进的状态和节点连接。
 */
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  AlertTriangle, ArrowRight, Check, ChevronRight, Clock3, KeyRound, Network,
  Play, RefreshCw, Send, Settings2, ShieldAlert, Sparkles, UserRound, Volume2,
  VolumeX, WalletCards, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DigitalAssetBoard, DnaKeyVisual } from "@/components/ActTwoVisuals";

type Act = 1 | 2 | 3 | 4 | 5;
type Act2Mode = "choice" | "waiting" | "identity" | "dna" | "recovery" | "fragment" | "node";
type Act4Stage = "caption" | "caption-exit" | "crossfade" | "new";
type AudioCue = keyof typeof AUDIO_SOURCES;

type LearningPlan = { duration: string; stages: string[]; tip: string };

const BRAND_MARK = "/manus-storage/cross-era-fold-mark_05281b0a.png";
const PARTICLE_STORM = "/manus-storage/cross-era-particle-storm_a15e9244.jpg";
const TERMINAL_TEXTURE = "/manus-storage/cross-era-damaged-terminal-texture_720e35ed.jpg";
const EARTH_SCENE = "/manus-storage/cross-era-decentralized-earth_10b19834.jpg";
const EARTH_DAY = "/manus-storage/earth-day-lowres_ebf2eeb9.jpg";
const ACT3_EVOLUTION_VIDEO = "/manus-storage/act3-evolution-final-v3_19c729d4.mp4";

const AUDIO_SOURCES = {
  act1ButtonWarning: "/manus-storage/act1-button-warning_0fdb3330.mp3",
  act1Click: "/manus-storage/act1-click_527cd15d.mp3",
  act1Freeze: "/manus-storage/act1-freeze_7404dd21.mp3",
  act1Popup: "/manus-storage/act1-popup-role-a_6917f0e7.wav",
  act1Explainer: "/manus-storage/act1-explainer-role-b_1721db81.wav",
  act1Idle: "/manus-storage/act1-idle-role-b_c2315e05.wav",
  act2Fade: "/manus-storage/act2-alert-fade_47714b4e.mp3",
  act2Identity: "/manus-storage/act2-identity-role-a_39259159.wav",
  act2Submit: "/manus-storage/act2-identity-submit_29950067.mp3",
  act2Mapped: "/manus-storage/act2-asset-mapped_89b632a6.mp3",
  act3Hub: "/manus-storage/act3-centralized-role-a_2d6278eb.wav",
  act3Multi: "/manus-storage/act3-multicentric-role-a_ffd99465.wav",
  act3Network: "/manus-storage/act3-decentralized-role-a_6e1eda0d.wav",
  act4Sweep: "/manus-storage/act4-scene-sweep_97e01a44.mp3",
  act4Explain: "/manus-storage/act4-explainer-role-b_045ba251.wav",
  act5Close: "/manus-storage/act5-closing-role-b_c503b531.wav",
} as const;

const ACT_META: Record<Act, { number: string; title: string; system: string }> = {
  1: { number: "01", title: "危机 · 崩塌", system: "SYSTEM FAULT" },
  2: { number: "02", title: "抉择 · 密钥", system: "CHOICE PROTOCOL" },
  3: { number: "03", title: "重塑 · 时代褶皱", system: "NETWORK MIGRATION" },
  4: { number: "04", title: "新生 · 具体生活", system: "LIFE, RECOMPOSED" },
  5: { number: "05", title: "留白 · 新世界待共建", system: "OPEN HORIZON" },
};

const balanceFrames = ["86,420.00", "-12,680.32", "¥ ERR.09", "0x77#?", "冻结"];
const stageLabels = ["枢纽 · 单点", "多极 · 竞争", "网络 · 共识"];
const stageNarration: AudioCue[] = ["act3Hub", "act3Multi", "act3Network"];

function requestedAct(): Act {
  if (typeof window === "undefined") return 1;
  const value = Number(new URLSearchParams(window.location.search).get("act"));
  return value >= 1 && value <= 5 ? value as Act : 1;
}

function makePlan(goal: string): LearningPlan {
  if (goal.includes("英国") || goal.includes("留学")) return { duration: "12 周 · 每周 5 天", stages: ["诊断申请与语言能力基线", "精读学术材料与表达", "模拟留学场景沟通"], tip: "每天用 25 分钟精听一段真实语料。" };
  if (goal.includes("论文")) return { duration: "8 周 · 每周 4 天", stages: ["建立论文阅读框架", "训练长句拆解与注释", "输出研究摘要与观点"], tip: "每天精读一段英文摘要，并写下三句中文要点。" };
  if (goal.includes("客户") || goal.includes("会议")) return { duration: "8 周 · 每周 4 天", stages: ["建立高频会议表达", "模拟协商与汇报", "沉淀个人表达库"], tip: "每天录下 90 秒工作复盘并重说一次。" };
  return { duration: "8 周 · 自定义节奏", stages: ["明确当下能力边界", "拆分高频使用场景", "用真实任务巩固输出"], tip: "每天给目标预留一段不被打断的 20 分钟。" };
}

function ActCaption({ act }: { act: Act }) {
  const meta = ACT_META[act];
  return <p className="act-caption"><span>ACT {meta.number}</span><i /><span>{meta.system}</span></p>;
}

function OldBankInterface({ failed }: { failed: boolean }) {
  const products = [
    ["稳健增利 12M", "+3.82%", "运行中"],
    ["人民币货币基金", "+1.65%", "待清算"],
    ["环球优选组合", "+4.19%", "需确认"],
  ];
  return <div className={`old-bank-interface ${failed ? "is-failing" : ""}`} data-anchor="ACT1_OLD_BANKING_UI" aria-label="旧世界财富管理界面">
    <div className="old-browser-bar"><span className="browser-dots"><i /><i /><i /></span><span>secure.centralwealth.cn / dashboard</span><b>已认证</b></div>
    <div className="old-bank-nav"><strong>联信财富</strong><span>资产总览</span><span>账户服务</span><span>安全中心</span><em>用户</em></div>
    <div className="old-bank-body">
      <p>尊敬的用户，您好</p>
      <section className="old-balance-card"><span>总资产（CNY）</span><strong className="mono">86,420.00</strong><small>较昨日 + ¥ 127.30</small></section>
      <div className="old-bank-columns"><section><h3>我的持仓</h3>{products.map(([name, rate, state]) => <div className="legacy-product" key={name}><span>{name}<small>{state}</small></span><b>{rate}</b></div>)}</section><section><h3>快捷服务</h3><div className="legacy-service-grid"><i>转</i><i>理</i><i>客</i><i>设</i></div><p className="legacy-tip">您的资产由中央账户统一托管</p></section></div>
    </div>
    {failed && <div className="red-data-stream" aria-hidden="true">00110　ERROR　01010　FUNDS　00011　DRAIN　11001　NODE</div>}
  </div>;
}

function LegacyShatter() {
  return <section id="scene-old-bank-shatter" className="shatter-scene" data-anchor="scene-old-bank-shatter" aria-label="旧银行界面碎裂动画">
    <div className="shatter-window"><div className="shatter-top"><span>CENTRAL LEDGER</span><b>CONNECTION LOST</b></div><strong>¥ 86,420.00</strong><i /><i /><i /></div>
    <div className="shatter-pieces" aria-hidden="true">{Array.from({ length: 22 }, (_, index) => <i key={index} style={{ "--piece": index } as CSSProperties} />)}</div>
    <p><span>LEGACY INTERFACE</span>GLASS FRACTURING</p>
  </section>;
}

function LegacyTraining() {
  return <div className="legacy-training" data-anchor="ACT4_LEGACY_TRAINING_UI" aria-label="旧世界英语培训机构界面">
    <div className="legacy-training-top"><b>BRIDGE ENGLISH</b><span>请登录　|　个人中心　|　关于我们</span></div>
    <div className="legacy-training-hero"><small>ESTABLISHED IN 2010</small><h2>标准化英语<br />培训体系</h2><p>统一课表 · 统一教材 · 统一认证</p><button type="button" disabled>立即报名</button></div>
    <div className="legacy-timetable"><span>周一</span><span>周三</span><span>周六</span><b>晚间口语班</b><b>学术写作班</b><b>雅思强化班</b></div>
    <div className="legacy-stopped"><WifiOff size={16} /><span>该机构已停止运营</span></div>
  </div>;
}

function EarthNetwork({ screensaver }: { screensaver: boolean }) {
  return <div className={`earth-network ${screensaver ? "is-pulling-back" : ""}`} aria-hidden="true">
    <div className="earth-globe" style={{ backgroundImage: `url(${EARTH_DAY})` }} />
    <div className="earth-node-sphere">{Array.from({ length: 64 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}</div>
    <div className="earth-ring ring-a" /><div className="earth-ring ring-b" /><div className="earth-ring ring-c" />
  </div>;
}

function FutureTrace() {
  return <aside className="future-trace" aria-hidden="true"><span>CENTRAL ENGLISH / ARCHIVE EXPIRED</span><i /><i /><i /><b>ACCESS<br />NO LONGER<br />REQUIRED</b></aside>;
}

export default function Home() {
  const [currentAct, setCurrentAct] = useState<Act>(requestedAct);
  const [transitioning, setTransitioning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [bankClicks, setBankClicks] = useState(0);
  const [bankFeedback, setBankFeedback] = useState("所有资产仍由单一核心节点托管");
  const [balance, setBalance] = useState("86,420.00");
  const [act2Mode, setAct2Mode] = useState<Act2Mode>("choice");
  const [waitSeconds, setWaitSeconds] = useState(5);
  const [identityName, setIdentityName] = useState("");
  const [identityCode, setIdentityCode] = useState("访客#0000");
  const [identityError, setIdentityError] = useState("");
  const [act3Sequence, setAct3Sequence] = useState<"galaxy" | "evolution">("galaxy");
  const [evolution, setEvolution] = useState(0);
  const [motionBoost, setMotionBoost] = useState(0);
  const [act4Stage, setAct4Stage] = useState<Act4Stage>("caption");
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [waterExit, setWaterExit] = useState(false);
  const [wish, setWish] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [screensaver, setScreensaver] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const audioRefs = useRef<Partial<Record<AudioCue, HTMLAudioElement>>>({});
  const act3VideoRef = useRef<HTMLVideoElement | null>(null);
  const act3BoostTimer = useRef<number | null>(null);
  const idlePlayed = useRef(false);
  const usedCodes = useRef(new Set<string>());
  const voicedStage = useRef(-1);
  const dragStart = useRef<number | null>(null);

  const playCue = useCallback((cue: AudioCue, volume = 1) => {
    if (!soundEnabled) return;
    const audio = audioRefs.current[cue];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    void audio.play().catch(() => undefined);
  }, [soundEnabled]);

  const goToAct = useCallback((act: Act) => {
    setTransitioning(true);
    window.setTimeout(() => { setCurrentAct(act); setTransitioning(false); }, 420);
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => setLoaded(true), 760); return () => window.clearTimeout(timer); }, []);

  useEffect(() => {
    if (currentAct !== 1 || bankClicks > 0 || idlePlayed.current) return;
    const timer = window.setTimeout(() => { idlePlayed.current = true; playCue("act1Idle", 0.32); }, 8000);
    return () => window.clearTimeout(timer);
  }, [bankClicks, currentAct, playCue]);

  useEffect(() => {
    if (currentAct !== 2) return;
    setAct2Mode("choice"); setWaitSeconds(5); setIdentityError("");
    const fade = window.setTimeout(() => playCue("act2Fade", 0.45), 50);
    return () => { window.clearTimeout(fade); };
  }, [currentAct, playCue]);

  useEffect(() => {
    if (currentAct !== 3) return;
    setAct3Sequence("galaxy"); setEvolution(0); setMotionBoost(0); voicedStage.current = -1;
    const start = window.setTimeout(() => setAct3Sequence("evolution"), 2100);
    const video = act3VideoRef.current;
    if (video) { video.currentTime = 0; video.playbackRate = 1; void video.play().catch(() => undefined); }
    return () => { window.clearTimeout(start); if (act3BoostTimer.current !== null) window.clearTimeout(act3BoostTimer.current); };
  }, [currentAct]);

  const stageIndex = evolution < 34 ? 0 : evolution < 67 ? 1 : 2;
  useEffect(() => {
    if (currentAct !== 3 || act3Sequence !== "evolution" || voicedStage.current === stageIndex) return;
    voicedStage.current = stageIndex;
    playCue(stageNarration[stageIndex], 0.9);
  }, [act3Sequence, currentAct, playCue, stageIndex]);
  useEffect(() => {
    if (currentAct !== 4) return;
    setAct4Stage("caption"); setWaterExit(false);
    const exit = window.setTimeout(() => setAct4Stage("caption-exit"), 2250);
    const cross = window.setTimeout(() => { setAct4Stage("crossfade"); playCue("act4Sweep", 0.8); }, 2900);
    const fresh = window.setTimeout(() => { setAct4Stage("new"); playCue("act4Explain", 0.9); }, 4400);
    return () => { window.clearTimeout(exit); window.clearTimeout(cross); window.clearTimeout(fresh); };
  }, [currentAct, playCue]);

  useEffect(() => {
    if (currentAct !== 5) return;
    setWishSubmitted(false); setWish(""); setScreensaver(false);
    const timer = window.setTimeout(() => playCue("act5Close", 0.9), 650);
    return () => window.clearTimeout(timer);
  }, [currentAct, playCue]);

  useEffect(() => {
    if (currentAct !== 1 || bankClicks === 0 || bankClicks >= 4) return;
    const timer = window.setInterval(() => {
      setBalance(balanceFrames[Math.floor(Math.random() * (balanceFrames.length - 1))]);
    }, 260);
    return () => window.clearInterval(timer);
  }, [bankClicks, currentAct]);

  const handleLegacyAction = () => {
    const next = Math.min(4, bankClicks + 1);
    idlePlayed.current = true;
    setBankClicks(next);
    setBalance(balanceFrames[Math.min(next, balanceFrames.length - 2)]);
    playCue("act1Click", 0.42); playCue("act1ButtonWarning", 0.72);
    if (next === 1) playCue("act1Popup", 0.9);
    if (next < 4) setBankFeedback("系统将于 3 小时 47 分后关闭 · 请做好资产备份");
    if (next === 4) {
      setBalance("冻结");
      setBankFeedback("核心节点故障 · 资产状态：冻结");
      playCue("act1Freeze", 0.9); playCue("act1Explainer", 0.9);
      window.setTimeout(() => goToAct(2), 2200);
    }
  };

  const beginWaiting = () => {
    setAct2Mode("waiting"); setWaitSeconds(5);
    const countdown = window.setInterval(() => setWaitSeconds(value => Math.max(0, value - 1)), 1000);
    window.setTimeout(() => { window.clearInterval(countdown); setAct2Mode("choice"); }, 5200);
  };

  const generateIdentity = () => {
    const name = identityName.trim();
    if (!name) { setIdentityError("请输入姓名后再确认你的数字身份。"); return; }
    let suffix = "";
    for (let tries = 0; tries < 8; tries += 1) { suffix = Math.floor(Math.random() * 10000).toString().padStart(4, "0"); if (!usedCodes.current.has(`${name}#${suffix}`)) break; }
    const code = `${name}#${suffix}`;
    usedCodes.current.add(code); setIdentityCode(code); setIdentityError(""); setAct2Mode("dna"); playCue("act2Submit", 0.9);
    window.setTimeout(() => { setAct2Mode("recovery"); playCue("act2Mapped", 0.8); }, 3400);
    window.setTimeout(() => setAct2Mode("fragment"), 6100);
    window.setTimeout(() => setAct2Mode("node"), 8700);
  };

  const boostEvolution = (delta: number) => {
    if (act3Sequence !== "evolution" || delta <= 0) return;
    const video = act3VideoRef.current;
    if (!video) return;
    const duration = Number.isFinite(video.duration) ? video.duration : 22.416667;
    video.currentTime = Math.min(duration - .04, video.currentTime + delta / 9);
    video.playbackRate = 2.2; setMotionBoost(Math.min(1, delta / 18));
    if (act3BoostTimer.current !== null) window.clearTimeout(act3BoostTimer.current);
    act3BoostTimer.current = window.setTimeout(() => { if (act3VideoRef.current) act3VideoRef.current.playbackRate = 1; setMotionBoost(0); }, 760);
  };
  const handlePointerMove = (x: number, width: number) => {
    if (dragStart.current === null) return;
    const delta = x - dragStart.current;
    if (delta > 0) { boostEvolution(Math.min(24, (delta / Math.max(width, 1)) * 135)); dragStart.current = x; }
  };

  const requestPlan = (nextGoal: string) => { const value = nextGoal.trim(); if (!value) return; setGoal(value); setPlan(makePlan(value)); };
  const launchFinale = () => { setWaterExit(true); window.setTimeout(() => goToAct(5), 920); };
  const submitWish = () => { if (!wish.trim()) return; setWishSubmitted(true); window.setTimeout(() => setScreensaver(true), 950); };
  const replay = () => { setBankClicks(0); setBalance("86,420.00"); setBankFeedback("所有资产仍由单一核心节点托管"); setIdentityName(""); setIdentityCode("访客#0000"); setPlan(null); idlePlayed.current = false; goToAct(1); };

  const timeline = useMemo(() => [1, 2, 3, 4, 5] as Act[], []);
  const caption = "当网络重构完成，去中心化来到最具体的日常生活中。";
  const legacyActions = [["转账", ArrowRight], ["理财", WalletCards], ["客服", UserRound], ["设置", Settings2]] as const;

  return <main className={`experience-shell act-${currentAct} ${transitioning ? "is-transitioning" : ""}`}>
    {!loaded && <div className="loading-curtain" role="status"><img src={BRAND_MARK} alt="" /><strong>跨时代过渡</strong><span>正在校准叙事坐标</span></div>}
    <div className="ambient-noise" aria-hidden="true" />
    <header className="global-header"><div className="brand-lockup"><img src={BRAND_MARK} alt="时代褶皱" /><div><strong>时代褶皱</strong><span>ARCHIVE 01 · 单点 / 分叉 / 网络迁徙</span></div></div><button className={`sound-toggle ${soundEnabled ? "" : "is-muted"}`} onClick={() => setSoundEnabled(value => !value)} aria-label={soundEnabled ? "关闭音效" : "开启音效"}>{soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>{soundEnabled ? "音效开启" : "音效关闭"}</span></button></header>

    <section className="act-stage" aria-label={`${ACT_META[currentAct].title}互动场景`}>
      {currentAct === 1 && <section className="act-panel act-one" aria-labelledby="act-one-title" style={{ "--terminal-texture": `url(${TERMINAL_TEXTURE})` } as CSSProperties}>
        <div className="act-content bank-layout"><div className="bank-asset-column"><OldBankInterface failed={bankClicks > 0} /></div><div className="bank-experience-column"><div className="bank-intro"><ActCaption act={1} /><p className="eyebrow">一个枢纽 · 亿万终端 · 亿万风险</p><h1 id="act-one-title">中心不再可信</h1><p>熟悉的秩序看似稳固，直到核心节点开始失去响应。</p></div><div className={`bank-terminal ${bankClicks > 0 ? "is-collapsed" : ""}`}><div className="terminal-topline"><span>CENTRAL LEDGER / 2010 ARCHIVE</span><span><WifiOff size={14} />联机{bankClicks ? "异常" : "稳定"}</span></div><div className="account-card"><div><span>中央账户总额</span><strong className="mono">{balance === "冻结" ? "冻结" : `¥ ${balance}`}</strong></div><ShieldAlert size={34} /></div><div className="transactions"><p><span>交易清算</span><b>{bankClicks ? "风险警告" : "正常"}</b></p><p><span>资产托管</span><b>{bankClicks ? "中断" : "正常"}</b></p><p><span>终端连接</span><b>{bankClicks ? "失效" : "正常"}</b></p></div><div className="legacy-actions">{legacyActions.map(([label, Icon]) => <Button variant="outline" key={label} onClick={handleLegacyAction} disabled={bankClicks >= 4}><Icon size={15} />{label}</Button>)}</div><p className="feedback-line" aria-live="polite">{bankFeedback}</p><div className="click-meter"><span>失效请求 {bankClicks} / 4</span><i><b style={{ width: `${bankClicks * 25}%` }} /></i></div></div></div></div>
      </section>}

      {currentAct === 2 && <section className="act-panel act-two" aria-label="去中心化密钥选择与资产映射流程">
        <div className="act-content choice-layout">
          {act2Mode === "choice" && <><div className="choice-heading"><ActCaption act={2} /><p className="eyebrow">当中心不再可信 · 权力开始重新拓扑</p><h1>选择一条<br />不会消失的路径</h1><p>页面不替你做决定。你必须亲手选择下一步。</p></div><div className="choice-cards"><button className="choice-card legacy-choice" onClick={beginWaiting}><Clock3 /><span>等待中心恢复</span><small>中心化系统报错 · 预计恢复时间：未知</small><ChevronRight /></button><button className="choice-card key-choice" onClick={() => { setAct2Mode("identity"); playCue("act2Identity", 0.9); }}><KeyRound /><span>启用去中心化密钥</span><small>无需等待 · 即刻启动 · 数字身份 · 主权回归</small><ChevronRight /></button></div></>}
          {act2Mode === "waiting" && <div className="waiting-panel"><Clock3 size={42} /><div><strong>中心仍不可用</strong><p>恢复进度：未知。{waitSeconds} 秒后自动返回选择。</p></div><i><b style={{ width: `${(5 - waitSeconds) * 20}%` }} /></i></div>}
          {act2Mode === "identity" && <div className="identity-panel"><div><span className="eyebrow"><KeyRound size={14} />IDENTITY CONFIRMATION</span><h2>请确认您的<br />数字身份</h2><p>姓名与随机四位数将构成一次性的识别码。</p><p className="identity-note">此身份用于映射旧世界资产记录 · 无需任何中心化机构认证。</p></div><div className="identity-form"><label htmlFor="identity-name">姓名 + 随机四位数</label><Input id="identity-name" value={identityName} onChange={event => setIdentityName(event.target.value)} placeholder="输入姓名" /><p>{identityError}</p><Button onClick={generateIdentity}><Sparkles size={16} />生成并确认密钥</Button></div></div>}
          {act2Mode === "dna" && <div className="act2-sequence-panel"><span className="eyebrow"><KeyRound size={14} />KEY ASSEMBLY</span><h2>密钥字符正在组合并固定</h2><strong className="mono">{identityCode}</strong><DnaKeyVisual /></div>}
          {act2Mode === "recovery" && <div className="act2-sequence-panel recovery-panel"><span className="eyebrow"><Sparkles size={14} />NETWORK MAPPING</span><div><h2>您的资产已通过去中心化网络映射完成</h2><p>这些资产不存储在任何单一机构中 · 它们存在于网络的每一个节点上。</p><b>总资产：86,420.00 信用单位</b></div><DigitalAssetBoard /></div>}
          {act2Mode === "fragment" && <div className="act2-sequence-panel fragment-panel"><span className="eyebrow"><AlertTriangle size={14} />LEGACY DETACHMENT</span><h2>旧银行界面正在碎裂</h2><LegacyShatter /></div>}
          {act2Mode === "node" && <div className="node-panel"><Network size={36} /><span className="eyebrow">NODE ENTRY</span><h2>映射已完成。<br />你的节点，正在加入网络。</h2><Button onClick={() => goToAct(3)}><Network size={16} />启用自己的节点</Button></div>}
        </div>
      </section>}

      {currentAct === 3 && <section className="act-panel act-three" aria-labelledby="act-three-title" style={{ "--particle-storm": `url(${PARTICLE_STORM})` } as CSSProperties}>
        <div className="act-content network-layout"><div className="network-heading"><ActCaption act={3} /><div><p className="eyebrow">既可独立存在 · 也能临时聚合成簇</p><h1 id="act-three-title">每个粒子都是<br />一个微型节点</h1></div></div><div className="network-field" data-sequence={act3Sequence} onPointerDown={event => { if (act3Sequence === "evolution") { event.currentTarget.setPointerCapture(event.pointerId); dragStart.current = event.clientX; } }} onPointerMove={event => handlePointerMove(event.clientX, event.currentTarget.clientWidth)} onPointerUp={() => { dragStart.current = null; }} onPointerCancel={() => { dragStart.current = null; }} onWheel={event => { if (event.deltaX > 0) { event.preventDefault(); boostEvolution(event.deltaX / 4); } }} onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); boostEvolution(12); } }} role="slider" tabIndex={0} aria-label="网络演变进度，向右滑动或按右方向键可以加速" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(evolution)}><div className="galaxy-transition"><p>正在重构信任网络 · 请稍候</p></div><div className="network-evolution"><video ref={act3VideoRef} className="act3-evolution-video" src={ACT3_EVOLUTION_VIDEO} autoPlay muted playsInline preload="auto" onTimeUpdate={event => { const { currentTime, duration } = event.currentTarget; if (Number.isFinite(duration) && duration > 0) setEvolution((currentTime / duration) * 100); }} onEnded={() => goToAct(4)} aria-label="粒子从枢纽单点演变为多极竞争和网络共识的动画" /></div>{act3Sequence === "evolution" && <><div className="network-state"><span>{stageLabels[stageIndex]}</span><i><b style={{ width: `${Math.max(10, evolution)}%` }} /></i></div><p className="swipe-hint">向右滑动可加速演变</p><div className="network-symbols"><span>₿</span><span>010011</span><span>⌘</span></div></>}</div>{act3Sequence === "evolution" && <div className="network-progress"><p>{stageLabels[stageIndex]}</p><strong>{["所有路径，指向同一个中心。", "权力开始分散，连接仍受限。", "每一个节点，都是新世界的入口。"][stageIndex]}</strong><div>{stageLabels.map((label, index) => <span className={index <= stageIndex ? "is-reached" : ""} key={label}>{label}</span>)}</div></div>}</div>
      </section>}

      {currentAct === 4 && <section className={`act-panel act-four is-${act4Stage} ${waterExit ? "is-watering-out" : ""}`} aria-labelledby="act-four-title">
        <div className="act4-caption-overlay"><ActCaption act={4} /><p>{caption.split("").map((character, index) => <span key={`${character}-${index}`} style={{ animationDelay: `${index * 45}ms` }}>{character}</span>)}</p></div>
        <section className="act4-scene legacy-scene" aria-label="旧机构培训界面"><LegacyTraining /></section>
        <section className="act4-scene future-scene" aria-labelledby="act-four-title"><div className="future-particle-wash" /><FutureTrace /><div className="future-inner"><p className="eyebrow">NO LOGIN · NO PLATFORM · ONE IDENTITY</p><h1 id="act-four-title">告诉我你的目标<br />为你生成专属学习路径</h1><p className="identity-path-note">身份不再请求中心。此路径只向你的节点确认。</p><div className="goal-input-row"><Input value={goal} onChange={event => setGoal(event.target.value)} placeholder="写入你的学习目标" /><Button onClick={() => requestPlan(goal)} aria-label="确认此目标"><Sparkles size={16} /></Button></div><div className="goal-chips">{["我要去英国留学", "我想看懂英文论文", "我要和外国客户开会"].map(item => <button key={item} className={goal === item ? "is-selected" : ""} onClick={() => requestPlan(item)}>{item}<ChevronRight size={14} /></button>)}</div>{plan && <div className="plan-card"><div><span>由 {identityCode} 确认</span><b>{plan.duration}</b></div><ol>{plan.stages.map((item, index) => <li key={item}><i>0{index + 1}</i>{item}</li>)}</ol><p><Sparkles size={15} />每日建议：{plan.tip}</p><Button onClick={launchFinale}><ArrowRight size={16} />开始我的学习</Button></div>}</div></section>
      </section>}

      {currentAct === 5 && <section className={`act-panel act-five ${screensaver ? "is-screensaver" : ""}`} aria-labelledby="act-five-title" style={{ "--earth-scene": `url(${EARTH_SCENE})` } as CSSProperties}>
        <div className="star-layer" aria-hidden="true">{Array.from({ length: 58 }, (_, index) => <i key={index} style={{ "--i": index } as CSSProperties} />)}</div><EarthNetwork screensaver={screensaver} /><div className="act-content final-layout"><ActCaption act={5} /><span className="eyebrow">OPEN HORIZON / {identityCode}</span><h1 id="act-five-title">时代褶皱</h1><p className="transition-complete">过渡已完成</p><p className="final-subtitle">但新世界的内容 · 等待你来填充</p><p className="final-footer">旧世界已经结束 · 新世界刚刚开始<br />我们不是在见证时代 · 我们正在编写它</p>{!wishSubmitted ? <div className="wish-form"><label htmlFor="creation-wish">你想在新世界中创造什么？</label><Textarea id="creation-wish" value={wish} onChange={event => setWish(event.target.value)} placeholder="你想在新世界中创造什么？" /><Button onClick={submitWish}><Send size={16} />记录我的愿景</Button></div> : <div className="wish-success"><span><Check size={17} />已记录 · 共建者 {identityCode.slice(-5)}</span><strong>{wish}</strong><p>{screensaver ? "愿景正在成为永恒星空的一部分。" : "正在将愿景写入新的连接……"}</p>{screensaver && <Button onClick={replay}><RefreshCw size={16} />重新体验</Button>}</div>}</div>
      </section>}
    </section>
    <nav className="act-timeline" aria-label="五幕叙事进度">{timeline.map(act => <div className={act === currentAct ? "is-current" : act < currentAct ? "is-past" : ""} key={act}><span>{String(act).padStart(2, "0")}</span><i /><small>{ACT_META[act].title}</small></div>)}</nav>
    <div className="audio-bank" aria-hidden="true">{(Object.entries(AUDIO_SOURCES) as [AudioCue, string][]).map(([cue, source]) => <audio key={cue} preload="auto" ref={element => { if (element) audioRefs.current[cue] = element; }} src={source} />)}</div>
  </main>;
}
