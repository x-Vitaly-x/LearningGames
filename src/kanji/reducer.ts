import type { KanjiState, Action, CharMastery, MasteryMap } from './types';
import { selectNextChar, generateChoices } from './algorithm';
import { ALL_KANJI } from './kanji';
import { MAX_LIVES, LIFE_REGEN_EVERY, RETIRE_STREAK } from './constants';

export function freshSession(highScore: number): KanjiState {
  return {
    screen: 'intro',
    lives: MAX_LIVES,
    score: 0,
    highScore,
    mastery: {},
    retiredKanji: [],
    currentChar: null,
    choices: [],
    lastResult: null,
  };
}

function pickNext(state: KanjiState) {
  const lastKanji = state.currentChar?.kanji ?? null;
  const char = selectNextChar(state.mastery, lastKanji, state.retiredKanji);
  return { currentChar: char, choices: generateChoices(char, state.retiredKanji) };
}

function updateMastery(mastery: MasteryMap, kanji: string, correct: boolean): MasteryMap {
  const prev: CharMastery = mastery[kanji] ?? { correct: 0, wrong: 0, streak: 0, lastSeen: 0 };
  return {
    ...mastery,
    [kanji]: {
      correct:  prev.correct + (correct ? 1 : 0),
      wrong:    prev.wrong   + (correct ? 0 : 1),
      streak:   correct ? prev.streak + 1 : 0,
      lastSeen: Date.now(),
    },
  };
}

export function reducer(state: KanjiState, action: Action): KanjiState {
  switch (action.type) {
    case 'SHOW_STUDY':
      return { ...state, screen: 'study' };

    case 'RESUME_QUIZ':
      return { ...state, screen: 'quiz', lastResult: null, ...pickNext(state) };

    case 'START_QUIZ': {
      const base = { ...state, retiredKanji: [], score: 0, lives: MAX_LIVES, mastery: {} };
      return { ...base, screen: 'quiz', lastResult: null, ...pickNext(base) };
    }

    case 'ANSWER': {
      if (!state.currentChar || state.lastResult !== null) return state;
      const { kanji } = state.currentChar;
      const isCorrect = action.meaning === state.currentChar.meaning;
      const newMastery = updateMastery(state.mastery, kanji, isCorrect);

      if (!isCorrect) {
        return { ...state, mastery: newMastery, lives: state.lives - 1, lastResult: 'wrong' };
      }

      const newScore = state.score + 1;
      const newHighScore = Math.max(newScore, state.highScore);
      const newLives = newScore % LIFE_REGEN_EVERY === 0 && state.lives < MAX_LIVES
        ? state.lives + 1
        : state.lives;
      const newRetired = newMastery[kanji].streak >= RETIRE_STREAK
        ? [...state.retiredKanji, kanji]
        : state.retiredKanji;

      if (newRetired.length === ALL_KANJI.length) {
        return { ...state, mastery: newMastery, score: newScore, highScore: newHighScore, retiredKanji: newRetired, lastResult: 'correct', screen: 'win' };
      }

      return {
        ...state,
        mastery: newMastery,
        score: newScore,
        highScore: newHighScore,
        lives: newLives,
        retiredKanji: newRetired,
        lastResult: 'correct',
      };
    }

    case 'NEXT_QUESTION':
      if (state.lives <= 0) return { ...state, screen: 'gameover', lastResult: null };
      return { ...state, lastResult: null, ...pickNext(state) };

    case 'PLAY_AGAIN':
      return freshSession(state.highScore);

    case 'RESET_PROGRESS':
      return freshSession(state.highScore);

    default:
      return state;
  }
}
