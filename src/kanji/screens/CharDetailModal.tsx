import type { KanjiChar } from '../kanji';
import { StrokeAnimation } from '../../hiragana/StrokeAnimation';

interface Props {
  char: KanjiChar | null;
  onClose: () => void;
}

export function CharDetailModal({ char, onClose }: Props) {
  if (!char) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-baseline gap-3">
          <span className="text-5xl">{char.kanji}</span>
          <div className="flex flex-col">
            <span className="text-xl text-slate-500">{char.reading}</span>
            <span className="text-sm text-slate-400">{char.meaning}</span>
          </div>
        </div>
        <StrokeAnimation kana={char.kanji} size={220} />
        <button
          onClick={onClose}
          className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
