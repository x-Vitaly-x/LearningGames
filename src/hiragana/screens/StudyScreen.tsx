import { useState } from 'react';
import type { Dispatch } from 'react';
import type { HiraganaState, Action } from '../types';
import type { HiraganaChar } from '../hiragana';
import { ROWS, ROW_NAMES } from '../hiragana';
import { RETIRE_STREAK } from '../constants';
import { CharDetailModal } from './CharDetailModal';

interface Props {
  state: HiraganaState;
  dispatch: Dispatch<Action>;
}

export function StudyScreen({ state, dispatch }: Props) {
  const { unlockedRowIndices, mastery, currentChar } = state;
  const [selectedChar, setSelectedChar] = useState<HiraganaChar | null>(null);
  const hasActiveGame = currentChar !== null;

  return (
    <>
      <div className="flex flex-col p-6 max-w-2xl mx-auto w-full self-start">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Study Reference</h2>
          {hasActiveGame && (
            <button
              onClick={() => dispatch({ type: 'RESUME_QUIZ' })}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue Quiz
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {ROWS.map((row, rowIdx) => {
            const locked = !unlockedRowIndices.includes(rowIdx);
            return (
              <div key={rowIdx} className={locked ? 'opacity-40' : ''}>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  {ROW_NAMES[rowIdx]}
                  {locked && <span className="ml-2 text-slate-400">🔒 locked</span>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {row.map(char => {
                    const isMastered = (mastery[char.kana]?.streak ?? 0) >= RETIRE_STREAK;
                    return (
                      <button
                        key={char.kana}
                        disabled={locked}
                        onClick={() => !locked && setSelectedChar(char)}
                        className={`flex flex-col items-center p-3 rounded-xl border w-16 transition-colors ${
                          isMastered
                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                            : !locked
                            ? 'bg-white border-slate-200 hover:bg-indigo-50 hover:border-indigo-300'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <span className="text-3xl">{char.kana}</span>
                        <span className="text-xs text-slate-500 mt-1">{char.romaji}</span>
                        <div className={`w-2 h-2 rounded-full mt-1 ${isMastered ? 'bg-green-500' : 'bg-slate-200'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {hasActiveGame && (
          <button
            onClick={() => dispatch({ type: 'RESUME_QUIZ' })}
            className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg transition-colors"
          >
            Continue Quiz
          </button>
        )}
      </div>

      <CharDetailModal char={selectedChar} onClose={() => setSelectedChar(null)} />
    </>
  );
}
