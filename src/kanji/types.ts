import type { KanjiChar } from './kanji';

export interface CharMastery {
  correct: number;
  wrong: number;
  streak: number;
  lastSeen: number;
}

export type MasteryMap = Record<string, CharMastery>;

export interface KanjiState {
  screen: 'intro' | 'study' | 'quiz' | 'gameover' | 'win';
  lives: number;
  score: number;
  highScore: number;
  mastery: MasteryMap;
  retiredKanji: string[];
  currentChar: KanjiChar | null;
  choices: string[];
  lastResult: 'correct' | 'wrong' | null;
}

export type Action =
  | { type: 'START_QUIZ' }
  | { type: 'RESUME_QUIZ' }
  | { type: 'SHOW_STUDY' }
  | { type: 'ANSWER'; meaning: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESET_PROGRESS' };
