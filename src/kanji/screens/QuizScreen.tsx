import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { KanjiState, Action } from '../types';
import { MAX_LIVES, LIFE_REGEN_EVERY } from '../constants';
import { Lives } from '../components/Lives';

function choiceClass(
  meaning: string,
  correctMeaning: string | undefined,
  lastResult: 'correct' | 'wrong' | null,
): string {
  const base = 'py-3 px-2 rounded-xl font-medium text-sm border-2 transition-colors text-center ';
  if (lastResult !== null && meaning === correctMeaning)    return base + 'bg-green-100 border-green-500 text-green-800';
  if (lastResult === 'wrong' && meaning !== correctMeaning) return base + 'bg-red-50 border-red-300 text-red-400';
  return base + 'bg-white border-slate-300 text-slate-700 hover:bg-rose-50 hover:border-rose-400 hover:text-rose-700';
}

interface Props {
  state: KanjiState;
  dispatch: Dispatch<Action>;
}

export function QuizScreen({ state, dispatch }: Props) {
  const { lives, score, currentChar, choices, lastResult, retiredKanji } = state;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= choices.length && lastResult === null) {
        dispatch({ type: 'ANSWER', meaning: choices[n - 1] });
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [choices, lastResult, dispatch]);

  const cardAnimation = lastResult === 'correct'
    ? 'kana-correct 0.9s ease forwards'
    : lastResult === 'wrong'
    ? 'kana-wrong 0.6s ease forwards'
    : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 gap-5 max-w-lg mx-auto w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-1">
          <Lives lives={lives} />
          {lives < MAX_LIVES && (
            <div className="text-xs text-slate-400">
              +♥ in {LIFE_REGEN_EVERY - (score % LIFE_REGEN_EVERY)}
            </div>
          )}
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-slate-800">{score}</div>
          <div className="text-xs text-slate-400">score</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={() => dispatch({ type: 'SHOW_STUDY' })}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Study
          </button>
          {retiredKanji.length > 0 && (
            <div className="text-xs text-green-600">{retiredKanji.length} retired ✓</div>
          )}
        </div>
      </div>

      {/* Kanji card */}
      <div
        className="w-48 h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-md"
        style={{ animation: cardAnimation }}
      >
        <span className="text-8xl select-none">{currentChar?.kanji}</span>
        <span className="text-base text-slate-400 mt-2 select-none">{currentChar?.reading}</span>
      </div>

      {/* 8-choice grid */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {choices.map((meaning, i) => (
          <button
            key={meaning}
            className={choiceClass(meaning, currentChar?.meaning, lastResult)}
            onClick={() => dispatch({ type: 'ANSWER', meaning })}
            disabled={lastResult !== null}
          >
            <span className="text-xs text-slate-400 block">{i + 1}.</span>
            {meaning}
          </button>
        ))}
      </div>
    </div>
  );
}
