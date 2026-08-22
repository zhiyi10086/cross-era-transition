export const ACT2_SEQUENCE = ["identity", "dna", "recovery", "fragment", "node"] as const;

export type Act2SequenceStage = (typeof ACT2_SEQUENCE)[number];

export function getNextAct2SequenceStage(stage: Act2SequenceStage) {
  const index = ACT2_SEQUENCE.indexOf(stage);
  return index < 0 || index === ACT2_SEQUENCE.length - 1 ? null : ACT2_SEQUENCE[index + 1];
}

export function getAct2VisibleAssetSlots(stage: "choice" | "waiting" | Act2SequenceStage) {
  if (stage === "dna") return ["ACT2_KEY_DNA"] as const;
  if (stage === "recovery") return ["ACT2_CREDIT_BOARD"] as const;
  if (stage === "fragment") return ["ACT2_LEGACY_FRAGMENT"] as const;
  return [] as const;
}
