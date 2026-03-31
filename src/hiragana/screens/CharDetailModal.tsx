import type { HiraganaChar } from '../hiragana';
import { StrokeAnimation } from '../StrokeAnimation';

interface Props {
  char: HiraganaChar | null;
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
          <span className="text-5xl">{char.kana}</span>
          <span className="text-2xl text-slate-500">{char.romaji}</span>
        </div>
        <StrokeAnimation kana={char.kana} size={220} />
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
