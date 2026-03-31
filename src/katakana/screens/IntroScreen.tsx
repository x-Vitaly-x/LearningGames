import type { Dispatch } from 'react';
import type { HiraganaState as KatakanaState, Action } from '../../hiragana/types';
import { ALL_CHARS } from '../katakana';
import { RETIRE_STREAK, MAX_LIVES, LIFE_REGEN_EVERY, UNLOCK_CORRECT } from '../../hiragana/constants';

interface Props {
  state: KatakanaState;
  dispatch: Dispatch<Action>;
}

export function IntroScreen({ state, dispatch }: Props) {
  const masteredCount = ALL_CHARS.filter(c => (state.mastery[c.kana]?.streak ?? 0) >= RETIRE_STREAK).length;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Katakana</h1>
        <p className="text-slate-500">Learn all {ALL_CHARS.length} basic characters</p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Basic</h2>
            <span className="text-xs text-slate-400">4 choices</span>
          </div>
          <div className="text-sm text-slate-500 flex flex-col gap-1">
            <div>Starts with vowel row — new rows unlock as you progress</div>
            <div>Retire after {RETIRE_STREAK} correct in a row · {MAX_LIVES} ♥ · +1 every {LIFE_REGEN_EVERY} correct</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'START_QUIZ', mode: 'basic' })}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
          >
            Play Basic
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800 text-lg">Advanced</h2>
            <span className="text-xs text-slate-400">8 choices · all rows open</span>
          </div>
          <div className="text-sm text-slate-500 flex flex-col gap-1">
            <div>All {ALL_CHARS.length} characters from the start — no row unlocking</div>
            <div>Retire after {RETIRE_STREAK} correct in a row · {MAX_LIVES} ♥ · +1 every {LIFE_REGEN_EVERY} correct</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'START_QUIZ', mode: 'advanced' })}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors"
          >
            Play Advanced
          </button>
        </div>
      </div>

      <button
        onClick={() => dispatch({ type: 'SHOW_STUDY' })}
        className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 transition-colors"
      >
        Study Reference
      </button>

      {masteredCount > 0 && (
        <button
          onClick={() => dispatch({ type: 'RESET_PROGRESS' })}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Reset all progress
        </button>
      )}
    </div>
  );
}
