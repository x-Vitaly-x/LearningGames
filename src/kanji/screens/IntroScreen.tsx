import type { Dispatch } from 'react';
import type { KanjiState, Action } from '../types';
import { ALL_KANJI } from '../kanji';
import { RETIRE_STREAK, MAX_LIVES, LIFE_REGEN_EVERY, CHOICE_COUNT } from '../constants';

interface Props {
  state: KanjiState;
  dispatch: Dispatch<Action>;
}

export function IntroScreen({ state, dispatch }: Props) {
  const retiredCount = state.retiredKanji.length;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">漢字</h1>
        <p className="text-slate-500">Grade 1 — {ALL_KANJI.length} characters</p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-3 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>Characters</span>
          <span className="font-medium text-slate-800">All {ALL_KANJI.length} open from the start</span>
        </div>
        <div className="flex justify-between">
          <span>Choices per question</span>
          <span className="font-medium text-slate-800">{CHOICE_COUNT}</span>
        </div>
        <div className="flex justify-between">
          <span>Retire after</span>
          <span className="font-medium text-slate-800">{RETIRE_STREAK} correct in a row</span>
        </div>
        <div className="flex justify-between">
          <span>Lives</span>
          <span className="font-medium text-slate-800">{MAX_LIVES} ♥, +1 every {LIFE_REGEN_EVERY} correct</span>
        </div>
        <div className="flex justify-between">
          <span>Quiz type</span>
          <span className="font-medium text-slate-800">See kanji → pick meaning</span>
        </div>
        {state.highScore > 0 && (
          <div className="flex justify-between border-t border-slate-100 pt-3 mt-1">
            <span>High score</span>
            <span className="font-medium text-indigo-600">{state.highScore}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => dispatch({ type: 'START_QUIZ' })}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-lg transition-colors"
        >
          Start Quiz
        </button>
        <button
          onClick={() => dispatch({ type: 'SHOW_STUDY' })}
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 transition-colors"
        >
          Study Reference
        </button>
      </div>

      {retiredCount > 0 && (
        <button
          onClick={() => dispatch({ type: 'RESET_PROGRESS' })}
          className="text-xs text-slate-400 hover:text-red-400 transition-colors"
        >
          Reset progress ({retiredCount} retired)
        </button>
      )}
    </div>
  );
}
