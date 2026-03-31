import type { Dispatch } from 'react';
import type { KanjiState, Action } from '../types';
import { ALL_KANJI } from '../kanji';

interface Props {
  state: KanjiState;
  dispatch: Dispatch<Action>;
}

export function WinScreen({ state, dispatch }: Props) {
  const { score, highScore } = state;
  const isNewHighScore = score >= highScore;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8 gap-8 max-w-md mx-auto">
      <div className="text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">You Win!</h2>
        <p className="text-slate-500">All {ALL_KANJI.length} kanji retired</p>
      </div>

      <div className="w-full bg-white rounded-2xl shadow p-6 text-center">
        <div className="text-5xl font-bold text-rose-600">{score}</div>
        <div className="text-sm text-slate-500 mt-1">correct answers</div>
        {isNewHighScore
          ? <div className="text-xs text-amber-500 font-semibold mt-1">New high score!</div>
          : <div className="text-xs text-slate-400 mt-1">Best: {highScore}</div>
        }
      </div>

      <button
        onClick={() => dispatch({ type: 'PLAY_AGAIN' })}
        className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-lg transition-colors"
      >
        Play Again
      </button>
    </div>
  );
}
