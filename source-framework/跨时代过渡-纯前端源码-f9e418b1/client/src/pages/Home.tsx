/**
 * 《跨时代过渡》· 五幕互动叙事
 * 设计提醒：本页严格采用用户确认的五幕定稿。所有可填充资产保留灰色可见占位块与 TODO 源码注释；
 * 所有点击、输入、拖动和提交节点均绑定事件处理器，避免“看起来可操作但不响应”的展示壳。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  KeyRound,
  LoaderCircle,
  Network,
  Orbit,
  RefreshCw,
  Send,
  Settings2,
  ShieldAlert,
  Sparkles,
  UserRound,
  WalletCards,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ParticleNetwork } from "@/components/ParticleNetwork";
import { DigitalAssetBoard, DnaKeyVisual, LegacyFragmentVisual } from "@/components/ActTwoVisuals";
import { trpc } from "@/lib/trpc";
import { SCRIPT_COPY } from "@/lib/scriptCopy";
import { getDragIntensity, IMMERSION_TIMELINE } from "@/lib/immersionTimeline";
import { getReplayReleasedRuntimeState, REPLAY_SETTLE_MS } from "@/lib/replayReset";
import { createInitialNarrativeState, getAct5AutomaticFinaleState, getNextFirstActBankClicks, type NarrativeAppState } from "@/lib/narrativeRuntime";
import { getNextAct2SequenceStage, type Act2SequenceStage } from "@/lib/act2Sequence";
import { NarrativeAudio } from "@/components/NarrativeAudio";

type ActNumber = 1 | 2 | 3 | 4 | 5;
type Act2Mode = "choice" | "waiting" | Act2SequenceStage;
type Act3Sequence = "galaxy" | "evolution";
type Act4Stage = "caption" | "caption-exit" | "legacy" | "crossfade" | "new";

type LearningPlan = { duration: string; stages: string[]; tip: string };

const ACT_META: Record<ActNumber, { number: string; title: string; label: string }> = {
  1: { number: "01", title: "危机 · 崩塌", label: "SYSTEM FAULT" },
  2: { number: "02", title: "抉择 · 密钥", label: "CHOICE PROTOCOL" },
  3: { number: "03", title: "重塑 · 节点网络", label: "NETWORK MIGRATION" },
  4: { number: "04", title: "新生 · 具体生活", label: "LIFE, RECOMPOSED" },
  5: { number: "05", title: "留白 · 新世界待共建", label: "OPEN HORIZON" },
};

const initialAppState = createInitialNarrativeState();
const legacyAmounts = ["¥ 86,420.00", "¥ 12,680.32", "- ¥ 8,640.00", "¥ ERR.09", "- ¥ 86,420.00"];
const act3Sentences = ["所有路径，指向同一个中心。", "权力开始分散，连接仍受限。", "每一个节点，都是新世界的入口。"];

function getInitialAct(): ActNumber {
  if (typeof window === "undefined") return 1;
  const requested = Number(new URLSearchParams(window.location.search).get("act"));
  return requested >= 1 && requested <= 5 ? requested as ActNumber : 1;
}

function getRequestedAct2Mode(): Act2Mode | null {
  if (typeof window === "undefined") return null;
  const requested = new URLSearchParams(window.location.search).get("act2Stage");
  return requested === "choice" || requested === "waiting" || requested === "identity" || requested === "dna" || requested === "recovery" || requested === "fragment" || requested === "node" ? requested : null;
}

function getRequestedAct4Stage(): Act4Stage | null {
  if (typeof window === "undefined") return null;
  const requested = new URLSearchParams(window.location.search).get("act4Stage");
  return requested === "caption" || requested === "caption-exit" || requested === "legacy" || requested === "crossfade" || requested === "new" ? requested : null;
}

function restoreIdentity() {
  try {
    const saved = window.localStorage.getItem("cross-era-identity")?.trim();
    return saved && /#\d{4}$/.test(saved) ? saved : "访客#0000";
  } catch {
    return "访客#0000";
  }
}

function extractSuffix(code: string) {
  const suffix = code.match(/#(\d{4})$/)?.[1];
  return suffix ? `#${suffix}` : "#0000";
}

function makePlan(goal: string): LearningPlan {
  if (goal.includes("英国") || goal.includes("留学")) return { duration: "12 周 · 每周 5 天", stages: ["诊断申请与语言能力基线", "精读学术材料与表达", "模拟留学场景沟通"], tip: "每天用 25 分钟精听一段真实语料。" };
  if (goal.includes("论文")) return { duration: "8 周 · 每周 4 天", stages: ["建立论文阅读框架", "训练长句拆解与注释", "输出研究摘要与观点"], tip: "每天精读一段英文摘要，并写下三句中文要点。" };
  if (goal.includes("客户") || goal.includes("会议")) return { duration: "8 周 · 每周 4 天", stages: ["建立高频会议表达", "模拟协商与汇报", "沉淀个人表达库"], tip: "每天录下 90 秒工作复盘并重说一次。" };
  return { duration: "8 周 · 自定义节奏", stages: ["明确当下能力边界", "拆分高频使用场景", "用真实任务巩固输出"], tip: "每天给目标预留一段不被打断的 20 分钟。" };
}

function ActCaption({ act }: { act: ActNumber }) {
  const meta = ACT_META[act];
  return <div className="act-caption"><span>ACT {meta.number}</span><i /><span>{meta.label}</span></div>;
}

function AssetSlot({ todo, label, className = "" }: { todo: string; label: string; className?: string }) {
  if (todo === "ACT2_KEY_DNA") return <DnaKeyVisual className={className} />;
  if (todo === "ACT2_CREDIT_BOARD") return <DigitalAssetBoard className={className} />;
  if (todo === "ACT2_LEGACY_FRAGMENT") return <LegacyFragmentVisual className={className} />;
  return (
    <div className={`asset-slot ${className}`} data-todo={`TODO:${todo}`} aria-label={`${label}，待替换素材占位`}>
      {/* <!-- TODO:{todo} --> */}
      <span>TODO:{todo}</span><small>{label}</small>
    </div>
  );
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<NarrativeAppState>(() => ({ ...initialAppState, currentAct: getInitialAct(), identityCode: restoreIdentity() }));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [bankCollapsed, setBankCollapsed] = useState(false);
  const [act1Tone, setAct1Tone] = useState<"stable" | "alert" | "deep-space">("stable");
  const [visibleAmount, setVisibleAmount] = useState(legacyAmounts[0]);
  const [bankFeedback, setBankFeedback] = useState("");
  const [act2Mode, setAct2Mode] = useState<Act2Mode>("choice");
  const [waitingSeconds, setWaitingSeconds] = useState(5);
  const [nameInput, setNameInput] = useState("");
  const [identityDraft, setIdentityDraft] = useState("");
  const [identityError, setIdentityError] = useState("");
  const [act3Phase, setAct3Phase] = useState(act3Sentences[0]);
  const [act3Sequence, setAct3Sequence] = useState<Act3Sequence>("galaxy");
  const [motionBoost, setMotionBoost] = useState(0);
  const [flowNotice, setFlowNotice] = useState("自动演变中");
  const [act4Stage, setAct4Stage] = useState<Act4Stage>("caption");
  const [goalInput, setGoalInput] = useState("");
  const [goalError, setGoalError] = useState("");
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [planSource, setPlanSource] = useState<"ai" | "offline" | null>(null);
  const [planNote, setPlanNote] = useState("");
  const [wishInput, setWishInput] = useState("");
  const [wishError, setWishError] = useState("");
  const [wishSubmitted, setWishSubmitted] = useState(false);
  const [screensaver, setScreensaver] = useState(false);
  const [replayReady, setReplayReady] = useState(false);

  const timersRef = useRef<number[]>([]);
  const intervalsRef = useRef<number[]>([]);
  const transitionTimerRef = useRef<number | null>(null);
  const transitionLockRef = useRef(false);
  const bankPendingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);
  const dragMovedRef = useRef(false);
  const boostTimerRef = useRef<number | null>(null);
  const aiPlanMutation = trpc.narrative.generateLearningPlan.useMutation({
    onSuccess: (result) => {
      setPlan({ duration: result.duration, stages: result.stages, tip: result.tip });
      setPlanSource(result.source);
      setPlanNote(result.note ?? "个性化学习计划已生成，无需登录。");
    },
    onError: (_error, variables) => {
      setPlan(makePlan(variables.goal));
      setPlanSource("offline");
      setPlanNote("AI 连接暂不可用，已切换为本地演示计划。");
    },
  });

  const currentAct = state.currentAct;
  const meta = ACT_META[currentAct];
  const progress = state.evolutionProgress;
  const stageIndex = progress < 34 ? 0 : progress < 67 ? 1 : 2;

  const clearActTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    intervalsRef.current.forEach((timer) => window.clearInterval(timer));
    timersRef.current = [];
    intervalsRef.current = [];
  };
  const registerTimer = (callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
    return timer;
  };
  const registerInterval = (callback: () => void, delay: number) => {
    const timer = window.setInterval(callback, delay);
    intervalsRef.current.push(timer);
    return timer;
  };
  const saveIdentity = (code: string) => {
    setState((previous) => ({ ...previous, identityCode: code }));
    try { window.localStorage.setItem("cross-era-identity", code); } catch { /* localStorage 异常时保持内存态 */ }
  };
  const goToAct = (targetAct: ActNumber) => {
    if (transitionLockRef.current || targetAct === currentAct) return;
    transitionLockRef.current = true;
    setIsTransitioning(true);
    clearActTimers();
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    setState((previous) => ({ ...previous, currentAct: targetAct }));
    setTransitionKey((value) => value + 1);
    transitionTimerRef.current = window.setTimeout(() => {
      transitionLockRef.current = false;
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, 420);
  };

  useEffect(() => {
    const loadTimer = window.setTimeout(() => setIsLoading(false), 980);
    return () => window.clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    clearActTimers();
    if (currentAct === 1) {
      setBankCollapsed(false); setAct1Tone("stable"); setVisibleAmount(legacyAmounts[0]); setBankFeedback("");
      return clearActTimers;
    }
    if (currentAct === 2) {
      setAct2Mode(getRequestedAct2Mode() ?? "choice"); setWaitingSeconds(Math.ceil(IMMERSION_TIMELINE.act2WaitObserveMs / 1_000)); setIdentityDraft(""); setIdentityError("");
      return clearActTimers;
    }
    if (currentAct === 3) {
      setState((previous) => ({ ...previous, evolutionProgress: 0 })); setAct3Sequence("galaxy"); setMotionBoost(0); setFlowNotice("银河过渡中");
      registerTimer(() => {
        setAct3Sequence("evolution"); setFlowNotice("自动演变中");
        registerInterval(() => {
          setState((previous) => ({ ...previous, evolutionProgress: Math.min(100, previous.evolutionProgress + IMMERSION_TIMELINE.act3AutoProgressDelta) }));
        }, IMMERSION_TIMELINE.act3AutoProgressTickMs);
      }, IMMERSION_TIMELINE.act3GalaxyTransitionMs);
      return clearActTimers;
    }
    if (currentAct === 4) {
      const requestedStage = getRequestedAct4Stage();
      setGoalError(""); setAct4Stage(requestedStage ?? "caption");
      if (requestedStage) return clearActTimers;
      registerTimer(() => setAct4Stage("caption-exit"), IMMERSION_TIMELINE.act4CaptionHoldMs);
      registerTimer(() => setAct4Stage("crossfade"), IMMERSION_TIMELINE.act4CaptionHoldMs + IMMERSION_TIMELINE.act4CaptionFadeOutMs);
      registerTimer(() => setAct4Stage("new"), IMMERSION_TIMELINE.act4CaptionHoldMs + IMMERSION_TIMELINE.act4CaptionFadeOutMs + IMMERSION_TIMELINE.act4CrossfadeMs);
      return clearActTimers;
    }
    setWishError(""); setScreensaver(false); setReplayReady(false);
    return clearActTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAct]);

  useEffect(() => { setAct3Phase(act3Sentences[stageIndex]); }, [stageIndex]);
  useEffect(() => {
    if (currentAct !== 3 || act3Sequence !== "evolution" || progress < 100) return;
    const timer = window.setTimeout(() => goToAct(4), IMMERSION_TIMELINE.act3AutoAdvanceDelayMs);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [act3Sequence, currentAct, progress]);
  useEffect(() => {
    if (currentAct !== 4 || typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("debugAct4Timing") !== "1") return;
    const key = "act4-runtime-timing";
    const prior = act4Stage === "caption" ? [] : JSON.parse(window.sessionStorage.getItem(key) ?? "[]") as { stage: Act4Stage; at: number }[];
    const next = [...prior, { stage: act4Stage, at: performance.now() }];
    window.sessionStorage.setItem(key, JSON.stringify(next));
    (window as typeof window & { __act4Timing?: typeof next }).__act4Timing = next;
  }, [act4Stage, currentAct]);
  useEffect(() => () => {
    clearActTimers();
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current);
    if (boostTimerRef.current !== null) window.clearTimeout(boostTimerRef.current);
  }, []);

  useEffect(() => {
    if (!bankCollapsed || currentAct !== 1) return;
    const timer = registerInterval(() => setVisibleAmount(legacyAmounts[Math.floor(Math.random() * legacyAmounts.length)]), IMMERSION_TIMELINE.act1BalanceTickMs);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bankCollapsed, currentAct]);

  const handleLegacyAction = (action: string) => {
    const nextClicks = getNextFirstActBankClicks(state, {
      isTransitioning,
      transitionLocked: transitionLockRef.current,
      bankPending: bankPendingRef.current,
    });
    if (nextClicks === null) return;
    setBankCollapsed(true);
    setState((previous) => ({ ...previous, bankClicks: nextClicks }));
    setBankFeedback(nextClicks >= 4 ? SCRIPT_COPY.act1.frozen : SCRIPT_COPY.act1.closing);
    if (nextClicks >= 4) {
      bankPendingRef.current = true;
      setAct1Tone("alert");
      registerTimer(() => setAct1Tone("deep-space"), 460);
      registerTimer(() => { bankPendingRef.current = false; goToAct(2); }, IMMERSION_TIMELINE.act1FailurePauseMs);
    }
  };
  const beginWaiting = () => {
    if (act2Mode !== "choice") return;
    const waitSeconds = Math.ceil(IMMERSION_TIMELINE.act2WaitObserveMs / 1_000);
    setAct2Mode("waiting"); setWaitingSeconds(waitSeconds);
    const countdown = registerInterval(() => { setWaitingSeconds((previous) => Math.max(previous - 1, 0)); }, IMMERSION_TIMELINE.act2FaultBeatMs);
    registerTimer(() => { clearInterval(countdown); setAct2Mode("choice"); setWaitingSeconds(waitSeconds); }, IMMERSION_TIMELINE.act2WaitObserveMs);
  };
  const beginAct2KeySequence = () => {
    setAct2Mode("dna");
    registerTimer(() => {
      const recoveryStage = getNextAct2SequenceStage("dna");
      if (!recoveryStage) return;
      setAct2Mode(recoveryStage);
      registerTimer(() => {
        const fragmentStage = getNextAct2SequenceStage(recoveryStage);
        if (!fragmentStage) return;
        setAct2Mode(fragmentStage);
        registerTimer(() => {
          const nodeStage = getNextAct2SequenceStage(fragmentStage);
          if (nodeStage) setAct2Mode(nodeStage);
        }, IMMERSION_TIMELINE.act2FragmentMs);
      }, IMMERSION_TIMELINE.act2RecoveryMs);
    }, IMMERSION_TIMELINE.act2DnaFixMs);
  };
  const generateIdentity = () => {
    const name = nameInput.trim();
    if (!name) { setIdentityError("请输入姓名后再生成密钥。"); setIdentityDraft(""); return; }
    const code = `${name}#${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    setIdentityError(""); setIdentityDraft(code); saveIdentity(code); beginAct2KeySequence();
  };
  const triggerFlowBoost = (strength: number) => {
    const nextBoost = Math.min(1, Math.max(0.18, strength));
    setMotionBoost(nextBoost); setFlowNotice(`手动加速 ×${(1 + nextBoost * 4.2).toFixed(1)}`);
    if (boostTimerRef.current !== null) window.clearTimeout(boostTimerRef.current);
    boostTimerRef.current = window.setTimeout(() => { setMotionBoost(0); setFlowNotice("自动演变中"); }, 520);
  };
  const advanceProgress = (delta: number, boost = 0) => {
    if (act3Sequence !== "evolution") return;
    setState((previous) => ({ ...previous, evolutionProgress: Math.min(100, Math.max(previous.evolutionProgress, previous.evolutionProgress + delta)) }));
    if (boost > 0) triggerFlowBoost(boost);
  };
  const handleDragStart = (clientX: number) => { dragStartRef.current = { x: clientX, time: performance.now() }; dragMovedRef.current = false; };
  const handleDragMove = (clientX: number, width: number) => {
    if (dragStartRef.current === null) return;
    const delta = clientX - dragStartRef.current.x;
    if (delta > 0) {
      const elapsed = Math.max(10, performance.now() - dragStartRef.current.time);
      const boost = getDragIntensity(delta, elapsed);
      advanceProgress((delta / Math.max(width, 1)) * 165, boost);
      dragStartRef.current = { x: clientX, time: performance.now() };
      dragMovedRef.current = true;
    }
  };
  const requestPlan = (goal: string) => {
    const normalizedGoal = goal.trim();
    if (!normalizedGoal) { setGoalError("请先选择或输入你的学习目标"); return; }
    setGoalError(""); setPlan(null); setPlanSource(null); setPlanNote("");
    setState((previous) => ({ ...previous, learningGoal: normalizedGoal }));
    aiPlanMutation.mutate({ goal: normalizedGoal });
  };
  const selectGoal = (goal: string) => { setGoalInput(goal); requestPlan(goal); };
  const generatePlan = () => requestPlan(goalInput);
  const startEarthPullback = () => {
    const automaticFinale = getAct5AutomaticFinaleState();
    setScreensaver(automaticFinale.screensaver); setReplayReady(automaticFinale.replayReady);
    registerTimer(() => setReplayReady(true), IMMERSION_TIMELINE.act5ReplayReadyMs);
  };
  const submitWish = () => {
    const wish = wishInput.trim();
    if (!wish) { setWishError("请输入你想在新世界中创造的内容。"); return; }
    setWishError(""); setWishSubmitted(true); setState((previous) => ({ ...previous, creationWish: wish }));
    startEarthPullback();
  };
  const replayExperience = () => {
    clearActTimers();
    transitionLockRef.current = true;
    bankPendingRef.current = false;
    setIsTransitioning(true); setScreensaver(false); setReplayReady(false);
    try { window.localStorage.removeItem("cross-era-identity"); } catch { /* 浏览器隐私模式下无持久化状态 */ }
    registerTimer(() => {
      setState(createInitialNarrativeState()); setBankCollapsed(false); setVisibleAmount(legacyAmounts[0]); setBankFeedback(""); setAct2Mode("choice"); setWaitingSeconds(5); setNameInput(""); setIdentityDraft(""); setIdentityError(""); setMotionBoost(0); setFlowNotice("自动演变中"); setGoalInput(""); setGoalError(""); setPlan(null); setPlanSource(null); setPlanNote(""); setWishInput(""); setWishError(""); setWishSubmitted(false); setTransitionKey((value) => value + 1);
      window.setTimeout(() => {
        const released = getReplayReleasedRuntimeState();
        transitionLockRef.current = released.transitionLocked;
        bankPendingRef.current = released.bankPending;
        setIsTransitioning(released.isTransitioning);
      }, REPLAY_SETTLE_MS);
    }, 680);
  };

  const legacyActions = [
    { label: "转账", icon: ArrowRight }, { label: "理财", icon: WalletCards }, { label: "客服", icon: UserRound }, { label: "设置", icon: Settings2 },
  ];
  const learningGoals = ["我要去英国留学", "我想看懂英文论文", "我要和外国客户开会"];
  const timeline = useMemo(() => Object.entries(ACT_META) as [string, (typeof ACT_META)[ActNumber]][], []);

  return (
    <main className={`experience-shell act-${currentAct} ${isTransitioning ? "is-transitioning" : ""}`}>
      <div className="ambient-noise" aria-hidden="true" />
      <NarrativeAudio />
      {isLoading && <div className="loading-curtain" role="status" aria-live="polite"><div className="loading-mark"><Orbit size={28} /><span /></div><p>跨时代过渡</p><small>正在校准叙事坐标</small></div>}
      <header className="global-header"><div className="brand-lockup"><span className="brand-node" aria-hidden="true" /><div><strong><b>ARCHIVE 01</b><i />跨时代过渡</strong><span>单点 / 分叉 / 网络迁徙</span></div></div></header>
      <div className="migration-spine" aria-hidden="true"><i className="spine-node spine-origin" /><i className="spine-node spine-branch" /><i className="spine-node spine-network-a" /><i className="spine-node spine-network-b" /><svg viewBox="0 0 1400 760" preserveAspectRatio="none"><path d="M-30 650 C 240 620, 370 460, 610 500 S 945 285, 1430 180" /><path d="M610 500 C 810 580, 980 560, 1220 490" /></svg></div>
      <section className="act-stage" aria-label={`${meta.title}互动场景`}>
        {currentAct === 1 && <section className={`act-panel act-one act-enter is-tone-${act1Tone}`} key={`act-one-${transitionKey}`} aria-labelledby="act-one-title"><div className="act-content bank-layout"><div className="bank-asset-column"><AssetSlot todo="ACT1_OLD_BANKING_UI" label="旧世界银行界面 UI" className="bank-asset-slot" /></div><div className="bank-experience-column"><div className="bank-intro"><ActCaption act={1} /><p className="script-subtitle">{SCRIPT_COPY.act1.subtitle}</p><h1 id="act-one-title">{SCRIPT_COPY.act1.title}</h1><p>{SCRIPT_COPY.act1.closing}</p></div><div className={`bank-terminal ${bankCollapsed ? "is-collapsed" : ""}`}><div className="terminal-topline"><span>CENTRAL LEDGER / 2010 ARCHIVE</span><span><WifiOff size={14} />联机异常</span></div><div className="account-card"><div><span>中央账户总额</span><strong className="mono">{visibleAmount}</strong></div><ShieldAlert size={34} strokeWidth={1.3} /></div><div className="transactions" aria-label="系统状态"><div><span>交易清算</span><span className={bankCollapsed ? "bad-status" : "normal-status"}>{bankCollapsed ? SCRIPT_COPY.act1.frozen : "正常"}</span></div><div><span>资产托管</span><span className={bankCollapsed ? "bad-status" : "normal-status"}>{bankCollapsed ? "风险警告" : "正常"}</span></div><div><span>终端连接</span><span className={bankCollapsed ? "bad-status" : "normal-status"}>{bankCollapsed ? "中断" : "正常"}</span></div></div><div className="legacy-actions">{legacyActions.map(({ label, icon: Icon }) => <Button key={label} variant="outline" onClick={() => handleLegacyAction(label)} disabled={isTransitioning || bankPendingRef.current} aria-label={`${label}，当前系统不可用`}><Icon size={15} />{label}</Button>)}</div><p className="feedback-line" aria-live="polite">{bankFeedback || (bankCollapsed ? SCRIPT_COPY.act1.frozen : SCRIPT_COPY.act1.closing)}</p><div className="click-meter"><span>失效请求 {Math.min(state.bankClicks, 4)} / 4</span><div><i style={{ width: `${Math.min(state.bankClicks, 4) * 25}%` }} /></div></div></div></div></div></section>}

        {currentAct === 2 && <section className={`act-panel act-two act-enter is-act2-${act2Mode}`} key={`act-two-${transitionKey}`} aria-label="去中心化密钥选择与资产映射流程"><div className="act-content choice-layout">{act2Mode === "choice" && <div className="choice-cards" aria-label="选择路径"><button className="choice-card legacy-choice" onClick={beginWaiting}><Clock3 /><span>{SCRIPT_COPY.act2.wait}</span><small>{SCRIPT_COPY.act2.waitHint}</small><ChevronRight /></button><button className="choice-card key-choice" onClick={() => setAct2Mode("identity")}><KeyRound /><span>{SCRIPT_COPY.act2.key}</span><small>{SCRIPT_COPY.act2.keyHint}</small><ChevronRight /></button></div>}{act2Mode === "waiting" && <div className="waiting-panel" aria-live="polite"><LoaderCircle className="slow-spin" size={42} /><div><span>排队中……中心仍不可用</span><p>{SCRIPT_COPY.act2.waitHint}；{waitingSeconds} 秒后返回选择。</p></div><div className="broken-loader"><i style={{ width: `${(5 - waitingSeconds) * 20}%` }} /></div></div>}{act2Mode === "identity" && <div className="identity-panel"><div className="identity-copy"><span className="eyebrow"><KeyRound size={14} />IDENTITY CONFIRMATION</span><h2>{SCRIPT_COPY.act2.identityTitle}</h2><p>{SCRIPT_COPY.act2.identityDuplicateNote}</p><p>{SCRIPT_COPY.act2.identitySystemCode}</p><p>{SCRIPT_COPY.act2.identityMappingNote}</p></div><div className="identity-form"><label htmlFor="identity-name">姓名+随机四位数</label><Input id="identity-name" value={nameInput} onChange={(event) => setNameInput(event.target.value)} placeholder="姓名+随机四位数" aria-describedby="identity-error" /><p id="identity-error" className="inline-error" aria-live="polite">{identityError}</p><Button onClick={generateIdentity} className="full-action"><Sparkles size={16} />生成并确认密钥</Button></div></div>}{act2Mode === "dna" && <div className="act2-sequence-panel dna-sequence" aria-live="polite"><span className="eyebrow"><KeyRound size={14} />KEY ASSEMBLY</span><h2>密钥字符正在组合并固定</h2><strong className="mono key-reveal">{identityDraft}</strong><AssetSlot todo="ACT2_KEY_DNA" label="密钥字符 DNA 螺旋动画" className="act2-large-slot dna-slot" /></div>}{act2Mode === "recovery" && <div className="act2-sequence-panel recovery-sequence" aria-live="polite"><span className="eyebrow"><Sparkles size={14} />NETWORK MAPPING</span><div className="recovery-grid"><div className="recovery-copy"><h2>{SCRIPT_COPY.act2.recoveryTitle}</h2><strong>{SCRIPT_COPY.act2.recoveryTotal}</strong><p>{SCRIPT_COPY.act2.recoveryNote}</p></div><AssetSlot todo="ACT2_CREDIT_BOARD" label="数字资产看板 / 信用单位" className="act2-large-slot credit-slot" /></div></div>}{act2Mode === "fragment" && <div className="act2-sequence-panel fragment-sequence" aria-live="polite"><span className="eyebrow"><AlertTriangle size={14} />LEGACY DETACHMENT</span><h2>旧银行界面正在碎裂</h2><AssetSlot todo="ACT2_LEGACY_FRAGMENT" label="旧银行界面碎裂动画" className="act2-large-slot fragment-slot" /></div>}{act2Mode === "node" && <div className="act2-sequence-panel node-sequence"><span className="eyebrow"><Network size={14} />NODE ENTRY</span><h2>{SCRIPT_COPY.act2.nodeTitle}</h2><Button onClick={() => goToAct(3)} className="full-action"><Network size={16} />{SCRIPT_COPY.act2.nodeStart}</Button></div>}</div></section>}

        {currentAct === 3 && <section className="act-panel act-three act-enter" key={`act-three-${transitionKey}`} aria-labelledby="act-three-title"><div className="act-content network-layout"><div className="network-heading"><ActCaption act={3} /><div><p className="script-subtitle">{SCRIPT_COPY.act3.subtitle}</p><h1 id="act-three-title">{SCRIPT_COPY.act3.title}</h1></div></div><div className="network-field" data-act3-sequence={act3Sequence} onPointerDown={(event) => { if (act3Sequence !== "evolution") return; event.currentTarget.setPointerCapture(event.pointerId); handleDragStart(event.clientX); }} onPointerMove={(event) => handleDragMove(event.clientX, event.currentTarget.clientWidth)} onPointerUp={() => { dragStartRef.current = null; }} onPointerCancel={() => { dragStartRef.current = null; }} onWheel={(event) => { if (act3Sequence === "evolution" && event.deltaX > 0) { event.preventDefault(); advanceProgress(Math.min(event.deltaX / 3, 14), Math.min(1, event.deltaX / 100)); } }} role="slider" aria-label={act3Sequence === "galaxy" ? "银河粒子过渡中，请稍候" : "网络自动演变中；向右滑动可加速演变"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} tabIndex={0} onKeyDown={(event) => { if (event.key === "ArrowRight" && act3Sequence === "evolution") { event.preventDefault(); advanceProgress(12, .42); } }}><div className="galaxy-transition" data-todo="TODO:ACT3_GALAXY_PARTICLE_TRANSITION" aria-live="polite">{/* <!-- TODO: 银河粒子旋转过渡 --> */}<div className="galaxy-particles" aria-hidden="true">{Array.from({ length: 48 }, (_, index) => <i key={index} style={{ left: `${(index * 37) % 96 + 2}%`, top: `${(index * 61) % 88 + 6}%`, animationDelay: `${(index % 9) * -0.42}s` }} />)}</div><p>正在重构信任网络·请稍候</p></div><div className="network-evolution"><ParticleNetwork progress={progress} motionBoost={motionBoost} />{/* <!-- TODO:ACT3_HIGH_FIDELITY_PARTICLES --> */}</div>{act3Sequence === "evolution" && <><div className="network-stage-indicator" aria-live="polite"><span>{SCRIPT_COPY.act3.labels[stageIndex]}</span><i style={{ width: `${Math.max(18, progress)}%` }} /></div><p className="act3-swipe-hint">向右滑动可加速演变</p><div className="network-symbols" aria-hidden="true"><span>₿</span><span>⌘</span><span>◌</span></div></>}</div>{act3Sequence === "evolution" && <div className="progress-area"><div className="phase-copy"><span>{SCRIPT_COPY.act3.labels[stageIndex]}</span><strong>{act3Phase}</strong></div><div className="progress-track" aria-hidden="true"><i style={{ width: `${progress}%` }} />{SCRIPT_COPY.act3.labels.map((label, index) => <span key={label} className={stageIndex >= index ? "is-reached" : ""}>{label}</span>)}</div></div>}</div></section>}

        {currentAct === 4 && <section className={`act-panel act-four act-enter is-${act4Stage}`} data-act4-stage={act4Stage} key={`act-four-${transitionKey}`} aria-labelledby="act-four-title"><div className="act4-caption-overlay" aria-live="polite"><ActCaption act={4} /><p>{SCRIPT_COPY.act4.caption}</p></div><section className="act4-scene legacy-scene" aria-label="旧机构培训界面"><div className="legacy-grid-noise" aria-hidden="true" /><div className="act4-inner"><span className="legacy-login-wall">请登录 · 请登录 · 请登录</span><div className="legacy-brand">CENTRAL ENGLISH<br /><small>EST. 2010</small></div><h1>课程只能由<br />旧机构分配。</h1><AssetSlot todo="ACT4_LEGACY_TRAINING_UI" label="旧机构培训 UI：Logo / 课表 / 价格 / 报名" className="training-slot" /><div className="legacy-course"><div className="frozen-video"><WifiOff /><span>该机构已停止运营</span></div><div className="course-line"><span>全程套餐</span><strong>¥ 12,800</strong></div><div className="course-line"><span>人工预约</span><strong>排队 47 人</strong></div></div></div></section><section className="act4-scene future-scene" aria-labelledby="act-four-title"><div className="data-stream" aria-hidden="true" /><div className="act4-inner future-inner"><p id="act-four-title" className="future-prompt">{SCRIPT_COPY.act4.title}</p><label htmlFor="learning-goal" className="sr-only">学习目标</label><div className="goal-input-row"><Input id="learning-goal" value={goalInput} onChange={(event) => setGoalInput(event.target.value)} placeholder="输入你的学习目标" aria-describedby="goal-error" /><Button onClick={generatePlan} disabled={aiPlanMutation.isPending} aria-label="生成我的计划">{aiPlanMutation.isPending ? <LoaderCircle className="slow-spin" size={16} /> : <Sparkles size={15} />}</Button></div><div className="goal-chips">{learningGoals.map((goal) => <button key={goal} className={goalInput === goal ? "is-selected" : ""} onClick={() => selectGoal(goal)} disabled={aiPlanMutation.isPending}>{goal}<ChevronRight size={14} /></button>)}</div><p id="goal-error" className="inline-error" aria-live="polite">{goalError}</p>{planNote && <p className={`plan-note ${planSource === "offline" ? "is-offline" : ""}`} aria-live="polite">{planSource === "offline" ? <CircleAlert size={13} /> : <Sparkles size={13} />}{planNote}</p>}{plan && <div className="plan-card"><div className="plan-card-top"><span>为「{state.learningGoal}」生成</span><strong>{plan.duration}</strong></div><ol>{plan.stages.map((stage, index) => <li key={stage}><span>0{index + 1}</span>{stage}</li>)}</ol><p><Sparkles size={15} />每日建议：{plan.tip}</p><Button onClick={() => goToAct(5)} className="start-learning"><ArrowRight size={16} />{SCRIPT_COPY.act4.start}</Button></div>}</div></section></section>}

        {currentAct === 5 && <section className={`act-panel act-five act-enter ${screensaver ? "is-screensaver" : ""}`} key={`act-five-${transitionKey}`} aria-labelledby="act-five-title"><div className="star-layer" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ left: `${(index * 41) % 96}%`, top: `${(index * 23) % 88}%`, animationDelay: `${index * 0.38}s` }} />)}</div>{/* <!-- TODO:ACT5_EARTH_ASSET --> */}<AssetSlot todo="ACT5_EARTH_ASSET" label="地球素材 / 屏幕或截图占位" className="earth-slot" />{/* <!-- TODO:ACT5_PARTICLE_ORBIT --> */}<div className="earth-orbit" data-todo="TODO:ACT5_PARTICLE_ORBIT" aria-hidden="true" /><div className="act-content final-layout"><ActCaption act={5} /><span className="eyebrow bright-eyebrow">OPEN HORIZON / {state.identityCode || restoreIdentity()}</span><h1 id="act-five-title">{SCRIPT_COPY.act5.title}</h1><p className="final-subtitle">{SCRIPT_COPY.act5.subtitle}</p><p className="final-footer">{SCRIPT_COPY.act5.footer}</p>{!wishSubmitted ? <div className="wish-form"><label htmlFor="creation-wish">{SCRIPT_COPY.act5.placeholder}</label><Textarea id="creation-wish" value={wishInput} onChange={(event) => setWishInput(event.target.value)} placeholder={SCRIPT_COPY.act5.placeholder} aria-describedby="wish-error" /><p id="wish-error" className="inline-error" aria-live="polite">{wishError}</p><Button onClick={submitWish}><Send size={16} />记录我的愿景</Button></div> : <div className="wish-success" aria-live="polite"><span><Check size={17} />已记录·共建者{extractSuffix(state.identityCode || restoreIdentity())}</span><strong>{state.creationWish}</strong><p>{screensaver ? "愿景正在成为永恒星空的一部分。" : "正在将愿景写入新的连接……"}</p>{replayReady && <Button className="replay-button" onClick={replayExperience}><RefreshCw size={16} />重新体验</Button>}</div>}</div>{/* <!-- TODO:ACT5_CAMERA_PULLBACK --> */}<div className="camera-pullback-marker" data-todo="TODO:ACT5_CAMERA_PULLBACK" aria-hidden="true" /></section>}
      </section>
      <nav className="act-timeline" aria-label="五幕叙事进度">{timeline.map(([number, item]) => <div className={Number(number) === currentAct ? "is-current" : Number(number) < currentAct ? "is-past" : ""} key={number}><span>{number.padStart(2, "0")}</span><i /><small>{item.title}</small></div>)}</nav>
    </main>
  );
}
