import { useReducer, useEffect } from 'react';
import type { Dispatch } from 'react';
import type { KanjiState, Action } from './types';
import { reducer, freshSession } from './reducer';
import { loadHighScore, saveHighScore } from './storage';

export type { KanjiState, Action } from './types';

export function useKanji(): { state: KanjiState; dispatch: Dispatch<Action> } {
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

  return { state, dispatch };
}
