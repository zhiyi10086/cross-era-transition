import { getReplayReleasedRuntimeState } from "./replayReset";

export type NarrativeAppState = {
  currentAct: 1 | 2 | 3 | 4 | 5;
  bankClicks: number;
  identityCode: string;
  evolutionProgress: number;
  learningGoal: string;
  creationWish: string;
};

export function createInitialNarrativeState(): NarrativeAppState {
  return {
    currentAct: 1,
    bankClicks: 0,
    identityCode: "",
    evolutionProgress: 0,
    learningGoal: "",
    creationWish: "",
  };
}

export function getAct5AutomaticFinaleState() {
  return {
    wishSubmitted: true,
    screensaver: true,
    replayReady: false,
  } as const;
}

export function getReplayReadyAct1State() {
  return {
    narrative: createInitialNarrativeState(),
    runtime: getReplayReleasedRuntimeState(),
  } as const;
}

export function getNextFirstActBankClicks(
  narrative: NarrativeAppState,
  runtime: { isTransitioning: boolean; transitionLocked: boolean; bankPending: boolean },
) {
  if (narrative.currentAct !== 1 || runtime.isTransitioning || runtime.transitionLocked || runtime.bankPending) {
    return null;
  }
  return narrative.bankClicks + 1;
}
