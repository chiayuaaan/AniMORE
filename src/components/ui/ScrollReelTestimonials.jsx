import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

const CELL = 121.33;
const GAP = 8;
const STEP = 3 * (CELL + GAP);

const EXIT_MS = 240; 
const SLIDE_MS = 800; 

const EASE_INOUT = "cubic-bezier(0.65,0,0.35,1)";

const FEATURED_SHADOW =
  "0 1.008px 0.705px -0.563px rgba(0,0,0,0.18), 0 2.389px 1.672px -1.125px rgba(0,0,0,0.17), 0 4.357px 3.05px -1.688px rgba(0,0,0,0.17), 0 7.244px 5.07px -2.25px rgba(0,0,0,0.16), 0 11.698px 8.188px -2.813px rgba(0,0,0,0.15), 0 19.148px 13.404px -3.375px rgba(0,0,0,0.13), 0 32.972px 23.08px -3.938px rgba(0,0,0,0.09), 0 60px 42px -4.5px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(0,0,0,0.6)";

// CSS saved as a safe array to prevent copy-paste syntax errors
const STYLES = [
  "/* Core Layout Components */",
  ".srt-wrapper { position: relative; display: flex; flex-direction: column; width: 100%; max-width: 1060px; margin: 0 auto; gap: 10px; overflow: hidden; border-radius: 16px; border: 1px solid var(--border, #E8DDD0); outline: none; background-color: var(--bg-card, #FAF4EE); box-shadow: inset 0 2px 0 rgba(255,255,255,1); }",
  "@media (min-width: 768px) { .srt-wrapper { flex-direction: row; min-height: 320px; } }",
  ".srt-mask { position: relative; height: 224px; width: 100%; flex-shrink: 0; align-self: stretch; overflow: hidden; -webkit-mask-image: linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%); -webkit-mask-composite: source-in; mask-composite: intersect; }",
  "@media (min-width: 768px) { .srt-mask { height: auto; width: 380px; } }",
  ".srt-track { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; }",
  ".srt-col { display: flex; flex-shrink: 0; flex-direction: column; gap: 8px; will-change: transform; }",
  ".srt-cell { flex-shrink: 0; border-radius: 12px; border: 1px solid var(--border, #E8DDD0); filter: blur(1px); background-color: var(--bg-surface, #F3EBE1); box-shadow: 0 1px 2px rgba(0,0,0,0.05), inset 0 2px 0 rgba(255,255,255,1); }",
  ".srt-featured { position: relative; flex-shrink: 0; overflow: hidden; border-radius: 12px; background-color: #e5e7eb; }",
  ".srt-img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 30%; }",
  ".srt-content { display: flex; min-width: 0; flex: 1; flex-direction: column; justify-content: space-between; align-self: stretch; padding: 32px 24px; }",
  "@media (min-width: 768px) { .srt-content { padding: 40px 24px; } }",
  ".srt-icon { display: block; height: 48px; width: 48px; color: var(--border, #E8DDD0); }",
  ".srt-text-stage { position: relative; width: 100%; max-width: 420px; overflow: hidden; }",
  ".srt-text-invisible { visibility: hidden; display: flex; min-height: 140px; flex-direction: column; gap: 19px; }",
  ".srt-text-visible { position: absolute; left: 0; right: 0; top: 0; display: flex; flex-direction: column; gap: 19px; will-change: transform, opacity; }",
  ".srt-quote { margin: 0; font-size: 1.125rem; font-weight: 500; line-height: 1.3; letter-spacing: -0.02em; color: var(--text, #2C1F14); }",
  "@media (min-width: 640px) { .srt-quote { font-size: 22px; } }",
  ".srt-author { margin: 0; font-size: 0.875rem; font-weight: 500; line-height: 1.3; color: var(--text-muted, #8C7B6E); }",
  ".srt-controls { margin-top: 24px; display: flex; align-items: center; gap: 8px; }",
  "@media (min-width: 768px) { .srt-controls { margin-top: 0; } }",
  ".srt-btn { display: grid; height: 40px; width: 40px; cursor: pointer; place-items: center; border-radius: 50%; border: 1px solid rgba(140,123,110,0.3); background-color: transparent; color: var(--text, #2C1F14); transition: all 0.2s; }",
  ".srt-btn:hover { background-color: var(--border, #E8DDD0); }",
  ".srt-btn:active { transform: scale(0.95); }",
  ".scroll-reel-char { opacity: 0; transform: translateY(12px); animation: scroll-reel-char-rise 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; display: inline-block; }",
  ".scroll-reel-exit { animation: scroll-reel-exit 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }",
  "@keyframes scroll-reel-char-rise { to { opacity: 1; transform: translateY(0); } }",
  "@keyframes scroll-reel-exit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-12px); } }"
].join("\n");

/* Blurred placeholder cell */
function Cell() {
  return (
    <div aria-hidden="true" className="srt-cell" style={{ width: CELL, height: CELL }} />
  );
}

/* Featured portrait tile */
function Featured({ src, alt }) {
  return (
    <div className="srt-featured" style={{ width: CELL, height: CELL, boxShadow: FEATURED_SHADOW }}>
      <img src={src} alt={alt ?? ""} loading="lazy" className="srt-img" />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, backgroundColor: 'white', mixBlendMode: 'saturation', pointerEvents: 'none' }} />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: 3, filter: 'blur(6px)', mixBlendMode: 'overlay', pointerEvents: 'none',
          background: "linear-gradient(220.99deg, rgba(244,132,95,0) 32%, rgba(244,132,95,0.8) 41%, rgba(212,96,122,0.8) 47%, rgba(130,189,237,0.57) 54%, rgba(130,189,237,0) 65%)",
        }}
      />
    </div>
  );
}

function Chars({ text, startIndex, staggerMs }) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <React.Fragment>
      {words.map((word, wi) => {
        const wordSpan = (
          <span key={"word-" + wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span key={ci} className="scroll-reel-char" style={{ animationDelay: delay + "ms" }}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <React.Fragment key={wi}>
            {wordSpan}
            {wi < words.length - 1 ? " " : null}
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
}

export default function ScrollReelTestimonials({ testimonials, charStaggerMs = 6, className = "" }) {
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Tracks if mouse is inside
  
  const animating = useRef(false);
  const timeouts = useRef([]);

  const count = testimonials.length;

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  // Updated to wrap infinitely around the array
  const paginate = useCallback(
    (dir) => {
      if (count <= 1 || animating.current) return;
      animating.current = true;

      let next = index + dir;
      if (next < 0) next = count - 1; // Loop to end
      if (next >= count) next = 0;    // Loop to start
      
      setIndex(next);
      setExiting(true);

      timeouts.current.push(setTimeout(() => { setDisplayIndex(next); setExiting(false); }, EXIT_MS));
      timeouts.current.push(setTimeout(() => { animating.current = false; }, SLIDE_MS));
    },
    [index, count]
  );

  // Auto-scroll loop triggered on hover
  useEffect(() => {
    let interval;
    if (isHovered) {
      interval = setInterval(() => {
        paginate(1);
      }, 3500); // Advances automatically every 3.5 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, paginate]); // Re-runs when paginate updates (which is every slide), resetting the 3.5s timer so it never double-fires!

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); paginate(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); paginate(-1); }
  };

  const middleItems = useMemo(() => {
    const items = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    testimonials.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) items.push({ type: "cell" }, { type: "cell" });
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [testimonials, count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y) => ({
    transform: "translateY(" + y + "px)",
    transition: mounted ? "transform " + SLIDE_MS + "ms " + EASE_INOUT : "none",
  });

  const current = testimonials[displayIndex];

  return (
    <React.Fragment>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div 
        role="region" 
        aria-roledescription="carousel" 
        aria-label="Testimonials" 
        tabIndex={0} 
        onKeyDown={onKeyDown} 
        onMouseEnter={() => setIsHovered(true)} // Starts the auto-scroll
        onMouseLeave={() => setIsHovered(false)} // Stops the auto-scroll
        className={"srt-wrapper " + className}
      >
        
        <div aria-hidden="true" className="srt-mask">
          <div className="srt-track">
            <div className="srt-col" style={colStyle(sideY)}>
              {Array.from({ length: sideCellCount }).map((_, i) => <Cell key={"l-" + i} />)}
            </div>
            <div className="srt-col" style={colStyle(middleY)}>
              {middleItems.map((item, i) => item.type === "featured" ? (
                <Featured key={"m-" + i} src={testimonials[item.i].image} alt={testimonials[item.i].alt} />
              ) : <Cell key={"m-" + i} />)}
            </div>
            <div className="srt-col" style={colStyle(sideY)}>
              {Array.from({ length: sideCellCount }).map((_, i) => <Cell key={"r-" + i} />)}
            </div>
          </div>
        </div>

        <div className="srt-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            <svg className="srt-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4.58 17.32C3.55 16.23 3 15 3 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18zm10 0C13.55 16.23 13 15 13 13.01c0-3.5 2.46-6.64 6.03-8.19l.9 1.38c-3.34 1.8-4 4.15-4.25 5.62.54-.28 1.24-.38 1.93-.31 1.8.17 3.23 1.65 3.23 3.49a3.5 3.5 0 0 1-3.5 3.5c-1.07 0-2.1-.49-2.75-1.18z" />
            </svg>

            <div className="srt-text-stage" aria-live="polite">
              <div aria-hidden="true" className="srt-text-invisible">
                <p className="srt-quote">{current.quote}</p>
                <p className="srt-author">{current.author}</p>
              </div>
              <div key={displayIndex} className={"srt-text-visible " + (exiting ? 'scroll-reel-exit' : '')}>
                <p className="srt-quote"><Chars text={current.quote} startIndex={0} staggerMs={charStaggerMs} /></p>
                <p className="srt-author"><Chars text={current.author} startIndex={current.quote.length + 6} staggerMs={charStaggerMs} /></p>
              </div>
            </div>
          </div>

          <div className="srt-controls">
            <button type="button" onClick={() => paginate(-1)} aria-label="Previous" className="srt-btn">
              <svg style={{ height: '16px', width: '16px' }} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 2.5 3.5 6l4 3.5" /></svg>
            </button>
            <button type="button" onClick={() => paginate(1)} aria-label="Next" className="srt-btn">
              <svg style={{ height: '16px', width: '16px' }} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4.5 2.5 4 3.5-4 3.5" /></svg>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}