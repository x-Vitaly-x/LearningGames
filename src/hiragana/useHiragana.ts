import { useReducer, useEffect } from 'react';
import type { Dispatch } from 'react';
import type { HiraganaState, Action } from './types';
import { reducer, freshSession } from './reducer';
import { loadHighScore, saveHighScore } from './storage';

export type { HiraganaState, Action, GameMode } from './types';

export function useHiragana(): { state: HiraganaState; dispatch: Dispatch<Action> } {
  const [state, dispatch] = useReducer(reducer, undefined, () => freshSession(loadHighScore()));

  useEffect(() => {
    saveHighScore(state.highScore);
  }, [state.highScore]);

  useEffect(() => {
    if (state.lastResult !== null && state.screen === 'quiz') {
      const timer = setTimeout(() => dispatch({ type: 'NEXT_QUESTION' }), 900);
      return () => clearTimeout(timer);
    }
  }, [state.lastResult, state.screen]);

  useEffect(() => {
    if (state.toastRowIndex !== null) {
      const timer = setTimeout(() => dispatch({ type: 'DISMISS_UNLOCK' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [state.toastRowIndex]);

  return { state, dispatch };
}
