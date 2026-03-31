const LS_KEY = 'katakana:highscore';

export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return parseInt(raw, 10) || 0;
  } catch {}
  return 0;
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(LS_KEY, String(score));
  } catch {}
}
