import type { HiraganaChar } from './hiragana';
import type { MasteryMap } from './algorithm';

export type GameMode = 'basic' | 'advanced';

export interface HiraganaState {
  screen: 'intro' | 'study' | 'quiz' | 'gameover' | 'win';
  mode: GameMode;
  lives: number;
  score: number;
  highScore: number;
  unlockedRowIndices: number[];
  mastery: MasteryMap;
  sessionCorrect: Record<string, number>;
  retiredKana: string[];
  currentChar: HiraganaChar | null;
  choices: string[];
  lastResult: 'correct' | 'wrong' | null;
  toastRowIndex: number | null;
}

export type Action =
  | { type: 'START_QUIZ'; mode: GameMode }
  | { type: 'RESUME_QUIZ' }
  | { type: 'SHOW_STUDY' }
  | { type: 'ANSWER'; romaji: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'DISMISS_UNLOCK' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'RESET_PROGRESS' };
