import { useState } from 'react';
import type { Dispatch } from 'react';
import type { KanjiState, Action } from '../types';
import type { KanjiChar } from '../kanji';
import { ALL_KANJI } from '../kanji';
import { RETIRE_STREAK } from '../constants';
import { ROWS as HIRAGANA_ROWS, ROW_NAMES } from '../../hiragana/hiragana';
import { KATAKANA_ROWS, KATAKANA_ROW_NAMES } from '../kana-reference';
import { CharDetailModal } from './CharDetailModal';

type Tab = 'kanji' | 'hiragana' | 'katakana';

interface Props {
  state: KanjiState;
  dispatch: Dispatch<Action>;
}

function KanaGrid({ rows, rowNames }: { rows: { kana: string; romaji: string }[][]; rowNames: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx}>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {rowNames[rowIdx]}
          </div>
          <div className="flex flex-wrap gap-3">
            {row.map(char => (
              <div
                key={char.kana}
                className="flex flex-col items-center p-3 rounded-xl border w-16 bg-white border-slate-200"
              >
                <span className="text-3xl">{char.kana}</span>
                <span className="text-xs text-slate-500 mt-1">{char.romaji}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudyScreen({ state, dispatch }: Props) {
  const { mastery, retiredKanji, currentChar } = state;
  const [activeTab, setActiveTab] = useState<Tab>('kanji');
  const [selectedChar, setSelectedChar] = useState<KanjiChar | null>(null);
  const hasActiveGame = currentChar !== null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'kanji',    label: '漢字 Kanji' },
    { id: 'hiragana', label: 'あ Hiragana' },
    { id: 'katakana', label: 'ア Katakana' },
  ];

  return (
    <>
      <div className="flex flex-col p-6 max-w-2xl mx-auto w-full self-start">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Study Reference</h2>
          {hasActiveGame && (
            <button
              onClick={() => dispatch({ type: 'RESUME_QUIZ' })}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors"
            >
              Continue Quiz
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'kanji' && (
          <div className="flex flex-wrap gap-3">
            {ALL_KANJI.map(char => {
              const isRetired = retiredKanji.includes(char.kanji);
              const isMastered = (mastery[char.kanji]?.streak ?? 0) >= RETIRE_STREAK || isRetired;
              return (
                <button
                  key={char.kanji}
                  onClick={() => setSelectedChar(char)}
                  className={`flex flex-col items-center p-3 rounded-xl border w-20 transition-colors ${
                    isMastered
                      ? 'bg-green-50 border-green-300 hover:bg-green-100'
                      : 'bg-white border-slate-200 hover:bg-rose-50 hover:border-rose-300'
                  }`}
                >
                  <span className="text-3xl">{char.kanji}</span>
                  <span className="text-xs text-slate-500 mt-1">{char.reading}</span>
                  <span className="text-[10px] text-slate-400 truncate w-full text-center">{char.meaning}</span>
                  <div className={`w-2 h-2 rounded-full mt-1 ${isMastered ? 'bg-green-500' : 'bg-slate-200'}`} />
                </button>
              );
            })}
          </div>
        )}

        {activeTab === 'hiragana' && (
          <KanaGrid rows={HIRAGANA_ROWS} rowNames={ROW_NAMES} />
        )}

        {activeTab === 'katakana' && (
          <KanaGrid rows={KATAKANA_ROWS} rowNames={KATAKANA_ROW_NAMES} />
        )}

        {hasActiveGame && (
          <button
            onClick={() => dispatch({ type: 'RESUME_QUIZ' })}
            className="mt-8 w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-lg transition-colors"
          >
            Continue Quiz
          </button>
        )}
      </div>

      <CharDetailModal char={selectedChar} onClose={() => setSelectedChar(null)} />
    </>
  );
}
