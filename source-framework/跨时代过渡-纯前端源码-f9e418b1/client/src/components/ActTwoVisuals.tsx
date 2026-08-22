import type { CSSProperties } from "react";
import "./ActTwoVisuals.css";

type VisualProps = {
  className?: string;
};

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function DnaKeyVisual({ className }: VisualProps) {
  return (
    <section className={joinClassNames("act2-visual act2-dna-visual", className)} data-todo="TODO:ACT2_KEY_DNA" aria-label="密钥字符 DNA 螺旋正在组合并固定">
      {/* TODO:ACT2_KEY_DNA */}
      <img className="act2-visual-art" src="/manus-storage/act2-dna-key-helix_5b8588e9.jpg" alt="" aria-hidden="true" />
      <div className="visual-scanline" aria-hidden="true" />
      <div className="dna-status"><span>IDENTITY SEED</span><i /> <strong>ASSEMBLING</strong></div>
      <div className="dna-helix" aria-hidden="true">
        {Array.from({ length: 15 }, (_, index) => <span className="dna-rung" key={index} style={{ "--index": index } as CSSProperties}><i /><b /></span>)}
      </div>
      <div className="dna-lock" aria-hidden="true"><span>01</span><i /><span>FIXED</span></div>
      <p>密钥字符像 DNA 螺旋一样组合、旋转、最终固定</p>
    </section>
  );
}

export function DigitalAssetBoard({ className }: VisualProps) {
  return (
    <section className={joinClassNames("act2-visual act2-credit-visual", className)} data-todo="TODO:ACT2_CREDIT_BOARD" aria-label="独立浮现的数字资产恢复看板">
      {/* TODO:ACT2_CREDIT_BOARD */}
      <img className="act2-visual-art" src="/manus-storage/act2-digital-asset-board-v2_35b2f0e0.jpg" alt="" aria-hidden="true" />
      <div className="visual-scanline" aria-hidden="true" />
      <div className="credit-board-top"><span>NETWORK ASSET LEDGER</span><i>● LIVE</i></div>
      <div className="credit-balance"><small>TOTAL CREDIT UNITS</small><strong>86,420.00</strong><span>CU</span></div>
      <div className="credit-metrics"><div><small>映射节点</small><b>128</b></div><div><small>共识状态</small><b>99.8%</b></div><div><small>托管机构</small><b>0</b></div></div>
      <div className="credit-ledger" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <p>资产已分布写入网络节点</p>
    </section>
  );
}

export function LegacyFragmentVisual({ className }: VisualProps) {
  return (
    <section className={joinClassNames("act2-visual act2-fragment-visual", className)} data-todo="TODO:ACT2_LEGACY_FRAGMENT" aria-label="旧银行界面从边缘开始像玻璃一样碎裂">
      {/* TODO:ACT2_LEGACY_FRAGMENT */}
      <img className="act2-visual-art" src="/manus-storage/act2-legacy-bank-fragment_9df8c9f2.jpg" alt="" aria-hidden="true" />
      <div className="legacy-window" aria-hidden="true"><div className="legacy-window-top"><span>CENTRAL LEDGER</span><i>CONNECTION LOST</i></div><div className="legacy-window-balance"><small>AVAILABLE BALANCE</small><b>¥ 86,420.00</b></div><div className="legacy-window-lines"><span /><span /><span /><span /></div></div>
      <div className="fragment-shards" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ "--index": index, "--x": `${(index * 29) % 88 + 3}%`, "--y": `${(index * 41) % 74 + 4}%` } as CSSProperties} />)}</div>
      <div className="fragment-message"><span>LEGACY INTERFACE</span><strong>GLASS FRACTURING</strong></div>
    </section>
  );
}
