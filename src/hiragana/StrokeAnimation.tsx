import { useState, useEffect, useRef, useCallback } from 'react';
import { useStrokeData } from './useStrokeData';

const STROKE_DURATION = 0.5;    // seconds per stroke
const STROKE_GAP = 0.25;        // seconds between strokes
const HIDDEN_STROKE_LEN = 9999; // hides a stroke until its real length is measured

interface Props {
  kana: string;
  size?: number;
}

export function StrokeAnimation({ kana, size = 200 }: Props) {
  const { paths, status } = useStrokeData(kana);
  const [lengths, setLengths] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(0);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  // Reset animation state whenever paths change
  useEffect(() => {
    setLengths([]);
    setPlaying(false);
    setCurrentStroke(0);
  }, [paths]);

  // Measure path lengths after render, then start animation
  useEffect(() => {
    if (paths.length === 0) return;
    requestAnimationFrame(() => {
      const lens = pathRefs.current
        .slice(0, paths.length)
        .map(el => el?.getTotalLength() ?? 200);
      setLengths(lens);
      requestAnimationFrame(() => setPlaying(true));
    });
  }, [paths]);

  // Advance stroke counter during playback
  useEffect(() => {
    if (!playing || paths.length === 0) { setCurrentStroke(0); return; }
    const timers = paths.map((_, i) =>
      setTimeout(() => setCurrentStroke(i + 1), i * (STROKE_DURATION + STROKE_GAP) * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, [playing, paths]);

  const replay = useCallback(() => {
    setPlaying(false);
    setCurrentStroke(0);
    // Two frames: first to commit playing=false, then to start the transition
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
  }, []);

  if (status !== 'ready' || paths.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-200"
          style={{ width: size, height: size }}
        >
          {status === 'loading' ? 'Loading…' : 'Unavailable'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 109 109"
        width={size}
        height={size}
        className="rounded-xl border border-slate-200 bg-white"
      >
        {/* Guide cross */}
        <line x1="54.5" y1="4"   x2="54.5" y2="105" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="4"   y1="54.5" x2="105"  y2="54.5" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 3" />

        {paths.map((d, i) => {
          const len = lengths[i] ?? HIDDEN_STROKE_LEN;
          const delay = i * (STROKE_DURATION + STROKE_GAP);
          return (
            <path
              key={i}
              ref={el => { pathRefs.current[i] = el; }}
              d={d}
              fill="none"
              stroke="#3730a3"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: len,
                strokeDashoffset: playing ? 0 : len,
                transition: playing
                  ? `stroke-dashoffset ${STROKE_DURATION}s linear ${delay}s`
                  : 'none',
              }}
            />
          );
        })}
      </svg>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">
          {currentStroke > 0
            ? `Stroke ${Math.min(currentStroke, paths.length)} / ${paths.length}`
            : `${paths.length} strokes`}
        </span>
        <button
          onClick={replay}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ↺ Replay
        </button>
      </div>
    </div>
  );
}
