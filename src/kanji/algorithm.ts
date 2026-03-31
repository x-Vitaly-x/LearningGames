import type { KanjiChar } from './kanji';
import type { MasteryMap } from './types';
import { ALL_KANJI } from './kanji';
import { CHOICE_COUNT } from './constants';

function weight(char: KanjiChar, mastery: MasteryMap, now: number): number {
  const m = mastery[char.kanji];
  const accuracy = m && (m.correct + m.wrong) > 0
    ? m.correct / (m.correct + m.wrong)
    : 0.5;
  const recency = Math.min(m ? (now - m.lastSeen) / 30_000 : 0, 1);
  const streak = m?.streak ?? 0;
  return (1 - accuracy) * 2.0 + recency * 1.0 + (streak === 0 ? 0.5 : 0);
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function selectNextChar(
  mastery: MasteryMap,
  lastKanji: string | null,
  retiredKanji: string[],
): KanjiChar {
  const nonRetired = ALL_KANJI.filter(c => !retiredKanji.includes(c.kanji));
  const base = nonRetired.length > 0 ? nonRetired : ALL_KANJI;
  const pool = base.filter(c => c.kanji !== lastKanji);
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

export function generateChoices(correct: KanjiChar, retiredKanji: string[]): string[] {
  const pool = ALL_KANJI.filter(c => c.kanji !== correct.kanji && !retiredKanji.includes(c.kanji));
  const distPool = pool.length >= CHOICE_COUNT - 1 ? pool : ALL_KANJI.filter(c => c.kanji !== correct.kanji);
  const distractors = shuffle(distPool).slice(0, CHOICE_COUNT - 1).map(c => c.meaning);
  return shuffle([correct.meaning, ...distractors]);
}
