import { useEffect } from 'react';
import type { Dispatch } from 'react';
import type { HiraganaState, Action } from '../types';
import { ROWS, ROW_NAMES } from '../hiragana';
import { MAX_LIVES, LIFE_REGEN_EVERY } from '../constants';
import { Lives } from '../components/Lives';

function choiceClass(
  romaji: string,
  correctRomaji: string | undefined,
  lastResult: 'correct' | 'wrong' | null,
): string {
  const base = 'py-4 rounded-xl font-semibold text-lg border-2 transition-colors ';
  if (lastResult !== null && romaji === correctRomaji)    return base + 'bg-green-100 border-green-500 text-green-800';
  if (lastResult === 'wrong' && romaji !== correctRomaji) return base + 'bg-red-50 border-red-300 text-red-400';
  return base + 'bg-white border-slate-300 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700';
}

interface Props {
  state: HiraganaState;
  dispatch: Dispatch<Action>;
}

export function QuizScreen({ state, dispatch }: Props) {
  const { lives, score, currentChar, choices, lastResult, retiredKana, toastRowIndex } = state;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= choices.length && lastResult === null) {
        dispatch({ type: 'ANSWER', romaji: choices[n - 1] });
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
    <div className="flex flex-col items-center justify-center min-h-full p-6 gap-6 max-w-md mx-auto w-full">
      {/* Top bar: lives, score, study link */}
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
          {retiredKana.length > 0 && (
            <div className="text-xs text-green-600">{retiredKana.length} retired ✓</div>
          )}
        </div>
      </div>

      {/* Kana card */}
      <div
        className="w-48 h-48 flex flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-md"
        style={{ animation: cardAnimation }}
      >
        <span className="text-8xl select-none">{currentChar?.kana}</span>
        <div className="flex gap-3 mt-2">
          {([
            { font: '"Hiragino Kaku Gothic Pro", "Hiragino Sans", sans-serif', label: 'Hira' },
            { font: '"Yu Gothic", "YuGothic", sans-serif',                     label: 'Yu G' },
            { font: '"Meiryo", "MS Gothic", sans-serif',                        label: 'Meir' },
            { font: '"Noto Serif JP", "Yu Mincho", "MS Mincho", serif',         label: 'Mnch' },
          ] as const).map(({ font, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="text-xl text-slate-500 select-none leading-none" style={{ fontFamily: font }}>
                {currentChar?.kana}
              </span>
              <span className="text-[9px] text-slate-300 mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Choice buttons */}
      <div className={`grid gap-3 w-full ${choices.length > 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
        {choices.map((romaji, i) => (
          <button
            key={romaji}
            className={choiceClass(romaji, currentChar?.romaji, lastResult)}
            onClick={() => dispatch({ type: 'ANSWER', romaji })}
            disabled={lastResult !== null}
          >
            <span className="text-xs text-slate-400 mr-1">{i + 1}.</span>{romaji}
          </button>
        ))}
      </div>

      {/* Row unlock toast */}
      {toastRowIndex !== null && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl flex flex-col items-center gap-2 z-50"
          style={{ animation: 'slide-up 0.3s ease' }}
        >
          <div className="font-bold text-lg">New row unlocked! 🎉</div>
          <div className="flex gap-3 text-2xl">
            {ROWS[toastRowIndex]?.map(c => <span key={c.kana}>{c.kana}</span>)}
          </div>
          <div className="text-sm text-indigo-200">{ROW_NAMES[toastRowIndex]} row</div>
          <button
            onClick={() => dispatch({ type: 'DISMISS_UNLOCK' })}
            className="text-xs text-indigo-300 hover:text-white mt-1 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
