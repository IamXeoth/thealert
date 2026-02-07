import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

type GlowState = "glow-ok" | "glow-warn" | "glow-crit" | "glow-all" | "none";
type LayoutState = "stack" | "line";

export default function App() {
  const barsWrapRef = useRef<HTMLDivElement | null>(null);
  const [layout, setLayout] = useState<LayoutState>("stack");
  const [glow, setGlow] = useState<GlowState>("none");
  const [barsWidth, setBarsWidth] = useState<number>(0);

  // mede a largura real do grupo de barras (responsivo real)
  useLayoutEffect(() => {
    const el = barsWrapRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setBarsWidth(rect.width);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);

    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  // animação: stack -> line -> ok -> warn -> crit -> tri-color -> respiro -> ok
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

  // gap entre o grupo e o texto (responsivo)
  const gapPx = 22;
  const wordmarkLeft = `calc(50% + ${Math.round(barsWidth / 2)}px + ${gapPx}px)`;

  return (
    <div className="page">
      <div className={`mark ${layout} ${glow}`} aria-label="TheAlert logo">
        <div className="barsWrap" ref={barsWrapRef} aria-hidden="true">
          <div className="bar b1" />
          <div className="bar b2" />
          <div className="bar b3" />
        </div>

        <div className="wordmark" style={{ left: wordmarkLeft }}>
          THE&nbsp;ALERT
        </div>
      </div>
    </div>
  );
}
