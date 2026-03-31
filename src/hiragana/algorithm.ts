import type { HiraganaChar } from './hiragana';
import { ROWS, ALL_CHARS } from './hiragana';
import { UNLOCK_CORRECT } from './constants';

export interface CharMastery {
  correct: number;
  wrong: number;
  streak: number;
  lastSeen: number;
}

export type MasteryMap = Record<string, CharMastery>;

function weight(char: HiraganaChar, mastery: MasteryMap, now: number): number {
  const m = mastery[char.kana];
  const accuracy = m && (m.correct + m.wrong) > 0
    ? m.correct / (m.correct + m.wrong)
    : 0.5;
  const recency = Math.min(m ? (now - m.lastSeen) / 30_000 : 0, 1);
  const streak = m?.streak ?? 0;
  return (1 - accuracy) * 2.0 + recency * 1.0 + (streak === 0 ? 0.5 : 0);
}

export function selectNextChar(
  mastery: MasteryMap,
  unlockedRowIndices: number[],
  lastKana: string | null,
  retiredKana: string[],
): HiraganaChar {
  const active = unlockedRowIndices.flatMap(i => ROWS[i]);
  const nonRetired = active.filter(c => !retiredKana.includes(c.kana));
  const base = nonRetired.length > 0 ? nonRetired : active;
  const pool = base.filter(c => c.kana !== lastKana);
  const candidates = pool.length > 0 ? pool : base;

  const now = Date.now();
  const weights = candidates.map(c => weight(c, mastery, now));
  const total = weights.reduce((a, b) => a + b, 0);

  let rand = Math.random() * total;
  for (let i = 0; i < candidates.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return candidates[i];
  }
  return candidates[candidates.length - 1];
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function generateChoices(
  correct: HiraganaChar,
  unlockedRowIndices: number[],
  retiredKana: string[],
  count = 4,
): string[] {
  const distractorCount = count - 1;
  const active = unlockedRowIndices.flatMap(i => ROWS[i]);
  const distPool = active.filter(c => c.kana !== correct.kana && !retiredKana.includes(c.kana));
  const pool = distPool.length >= distractorCount ? distPool : ALL_CHARS.filter(c => c.kana !== correct.kana);

  const distractors = shuffle(pool).slice(0, distractorCount).map(c => c.romaji);
  return shuffle([correct.romaji, ...distractors]);
}

// Unlock when every active char has been answered correctly >= UNLOCK_CORRECT times this session
export function shouldUnlock(sessionCorrect: Record<string, number>, unlockedRowIndices: number[]): boolean {
  if (unlockedRowIndices.length >= ROWS.length) return false;
  const active = unlockedRowIndices.flatMap(i => ROWS[i]);
  return active.length > 0 && active.every(c => (sessionCorrect[c.kana] ?? 0) >= UNLOCK_CORRECT);
}

// Pick a random row index from those not yet unlocked
export function pickRandomLockedRow(unlockedRowIndices: number[]): number | null {
  const locked = ROWS.map((_, i) => i).filter(i => !unlockedRowIndices.includes(i));
  return locked.length > 0 ? locked[Math.floor(Math.random() * locked.length)] : null;
}
