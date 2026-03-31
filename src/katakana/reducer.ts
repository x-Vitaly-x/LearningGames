import type { HiraganaState as KatakanaState, Action, GameMode } from '../hiragana/types';
import type { CharMastery, MasteryMap } from './algorithm';
import { selectNextChar, generateChoices, shouldUnlock, pickRandomLockedRow } from './algorithm';
import { ALL_CHARS, ROWS } from './katakana';
import { MAX_LIVES, LIFE_REGEN_EVERY, RETIRE_STREAK } from '../hiragana/constants';

const ALL_ROW_INDICES = ROWS.map((_, i) => i);

export function freshSession(highScore: number, mode: GameMode = 'basic'): KatakanaState {
  return {
    screen: 'intro',
    mode,
    lives: MAX_LIVES,
    score: 0,
    highScore,
    unlockedRowIndices: mode === 'advanced' ? ALL_ROW_INDICES : [0],
    mastery: {},
    sessionCorrect: {},
    retiredKana: [],
    currentChar: null,
    choices: [],
    lastResult: null,
    toastRowIndex: null,
  };
}

function pickNext(state: KatakanaState) {
  const lastKana = state.currentChar?.kana ?? null;
  const choiceCount = state.mode === 'advanced' ? 8 : 4;
  const char = selectNextChar(state.mastery, state.unlockedRowIndices, lastKana, state.retiredKana);
  return {
    currentChar: char,
    choices: generateChoices(char, state.unlockedRowIndices, state.retiredKana, choiceCount),
  };
}

function updateMastery(mastery: MasteryMap, kana: string, correct: boolean): MasteryMap {
  const prev: CharMastery = mastery[kana] ?? { correct: 0, wrong: 0, streak: 0, lastSeen: 0 };
  return {
    ...mastery,
    [kana]: {
      correct:  prev.correct + (correct ? 1 : 0),
      wrong:    prev.wrong   + (correct ? 0 : 1),
      streak:   correct ? prev.streak + 1 : 0,
      lastSeen: Date.now(),
    },
  };
}

export function reducer(state: KatakanaState, action: Action): KatakanaState {
  switch (action.type) {
    case 'START_QUIZ': {
      const allRows = action.mode === 'advanced' ? ALL_ROW_INDICES : [0];
      const base = { ...state, mode: action.mode, retiredKana: [], score: 0, lives: MAX_LIVES, unlockedRowIndices: allRows, sessionCorrect: {}, mastery: {} };
      return { ...base, screen: 'quiz', lastResult: null, ...pickNext(base) };
    }

    case 'RESUME_QUIZ':
      return { ...state, screen: 'quiz', lastResult: null, ...pickNext(state) };

    case 'SHOW_STUDY':
      return { ...state, screen: 'study' };

    case 'ANSWER': {
      if (!state.currentChar || state.lastResult !== null) return state;
      const { kana } = state.currentChar;
      const isCorrect = action.romaji === state.currentChar.romaji;
      const newMastery = updateMastery(state.mastery, kana, isCorrect);

      if (!isCorrect) {
        return { ...state, mastery: newMastery, lives: state.lives - 1, lastResult: 'wrong' };
      }

      const newScore = state.score + 1;
      const newHighScore = Math.max(newScore, state.highScore);
      const newLives = newScore % LIFE_REGEN_EVERY === 0 && state.lives < MAX_LIVES
        ? state.lives + 1
        : state.lives;
      const newRetired = newMastery[kana].streak >= RETIRE_STREAK
        ? [...state.retiredKana, kana]
        : state.retiredKana;

      if (newRetired.length === ALL_CHARS.length) {
        return { ...state, mastery: newMastery, score: newScore, highScore: newHighScore, retiredKana: newRetired, lastResult: 'correct', screen: 'win' };
      }

      const newSessionCorrect = { ...state.sessionCorrect, [kana]: (state.sessionCorrect[kana] ?? 0) + 1 };

      let newUnlocked = state.unlockedRowIndices;
      let toastRowIndex = state.toastRowIndex;
      if (state.mode === 'basic' && shouldUnlock(newSessionCorrect, state.unlockedRowIndices)) {
        const nextRow = pickRandomLockedRow(state.unlockedRowIndices);
        if (nextRow !== null) {
          newUnlocked = [...state.unlockedRowIndices, nextRow];
          toastRowIndex = nextRow;
        }
      }

      return { ...state, mastery: newMastery, sessionCorrect: newSessionCorrect, score: newScore, highScore: newHighScore, lives: newLives, retiredKana: newRetired, unlockedRowIndices: newUnlocked, toastRowIndex, lastResult: 'correct' };
    }

    case 'NEXT_QUESTION':
      if (state.lives <= 0) return { ...state, screen: 'gameover', lastResult: null };
      return { ...state, lastResult: null, ...pickNext(state) };

    case 'DISMISS_UNLOCK':
      return { ...state, toastRowIndex: null };

    case 'PLAY_AGAIN':
      return freshSession(state.highScore, state.mode);

    case 'RESET_PROGRESS':
      return freshSession(state.highScore, state.mode);

    default:
      return state;
  }
}
