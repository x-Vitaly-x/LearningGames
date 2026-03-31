import { useState, useEffect } from 'react';

export interface StrokeData {
  paths: string[];
  status: 'loading' | 'ready' | 'error';
}

export function useStrokeData(kana: string): StrokeData {
  const [paths, setPaths] = useState<string[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const cp = kana.codePointAt(0)?.toString(16).padStart(5, '0');
    if (!cp) return;
    setStatus('loading');
    setPaths([]);

    let cancelled = false;
    fetch(`https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${cp}.svg`)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(text => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
        const d = Array.from(doc.querySelectorAll('path'))
          .map(p => p.getAttribute('d') ?? '')
          .filter(Boolean);
        setPaths(d);
        setStatus('ready');
      })
      .catch(() => { if (!cancelled) setStatus('error'); });

    return () => { cancelled = true; };
  }, [kana]);

  return { paths, status };
}
