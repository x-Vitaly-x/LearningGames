import type { GameTab } from './game-registry';
import { HiraganaApp } from './hiragana/HiraganaApp';
import { KatakanaApp } from './katakana/KatakanaApp';
import { KanjiApp }    from './kanji/KanjiApp';

export const PUBLIC_GAMES: GameTab[] = [
  { id: 'hiragana', icon: 'あ', label: 'Hiragana', component: HiraganaApp },
  { id: 'katakana', icon: 'ア', label: 'Katakana', component: KatakanaApp },
  { id: 'kanji',    icon: '漢', label: 'Kanji',    component: KanjiApp    },
];
