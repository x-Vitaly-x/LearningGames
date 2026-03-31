import { MAX_LIVES } from '../constants';

interface Props {
  lives: number;
}

export function Lives({ lives }: Props) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: MAX_LIVES }, (_, i) => (
        <span key={i} className={`text-lg ${i < lives ? 'text-red-500' : 'text-slate-300'}`}>♥</span>
      ))}
    </div>
  );
}
