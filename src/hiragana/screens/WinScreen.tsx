import type { Dispatch } from 'react';
import type { HiraganaState, Action } from '../types';
import { ALL_CHARS } from '../hiragana';

interface Props {
  state: HiraganaState;
  dispatch: Dispatch<Action>;
}

export function WinScreen({ state, dispatch }: Props) {
  const { score, highScore } = state;
  const isNewHighScore = score >= highScore;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <div className="text-6xl mb-4">🎌</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">You Win!</h2>
        <p className="text-slate-500">All {ALL_CHARS.length} characters retired</p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold text-indigo-600">{score}</div>
          <div className="text-sm text-slate-500 mt-1">correct answers</div>
          {isNewHighScore
            ? <div className="text-xs text-amber-500 font-semibold mt-1">New high score!</div>
            : <div className="text-xs text-slate-400 mt-1">Best: {highScore}</div>
          }
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <button
          onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-lg transition-colors"
        >
          Play Again
        </button>
        <button
          onClick={() => dispatch({ type: 'SHOW_STUDY' })}
          className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-medium rounded-xl border border-slate-300 transition-colors"
        >
          Study Reference
        </button>
      </div>
    </div>
  );
}
