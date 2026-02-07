import React, { useEffect, useState } from "react";

type GlowState = "glow-ok" | "glow-warn" | "glow-crit" | "glow-all" | "none";
type LayoutState = "stack" | "line";

export default function App() {
  const [layout, setLayout] = useState<LayoutState>("stack");
  const [glow, setGlow] = useState<GlowState>("none");

  // Animação: stack → line → ok → warn → crit → tri-color → respiro → ok
  useEffect(() => {
    const stepMs = 1050;
    const allMs = 380;
    const idleMs = 620;

    const t1 = window.setTimeout(() => setLayout("line"), 700);

    let stopped = false;
    const seq: GlowState[] = ["glow-ok", "glow-warn", "glow-crit"];
    let idx = 0;

    const cycle = () => {
      if (stopped) return;
      setGlow(seq[idx]);

      window.setTimeout(() => {
        if (stopped) return;
        setGlow("none");

        if (idx === seq.length - 1) {
          setGlow("glow-all");

          window.setTimeout(() => {
            if (stopped) return;
            setGlow("none");

            window.setTimeout(() => {
              if (stopped) return;
              idx = 0;
              cycle();
            }, idleMs);
          }, allMs);
        } else {
          idx++;
          cycle();
        }
      }, stepMs);
    };

    const t2 = window.setTimeout(cycle, 1700);

    return () => {
      stopped = true;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="page">
      <div className={`mark ${layout} ${glow}`} aria-label="TheAlert logo">
        <div className="barsWrap" aria-hidden="true">
          <div className="bar b1" />
          <div className="bar b2" />
          <div className="bar b3" />
        </div>

        <div className="wordmark">
          THE&nbsp;ALERT
        </div>
      </div>
    </div>
  );
}
