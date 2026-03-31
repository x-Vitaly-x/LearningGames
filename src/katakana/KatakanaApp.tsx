import { useKatakana } from './useKatakana';
import { IntroScreen }   from './screens/IntroScreen';
import { StudyScreen }   from './screens/StudyScreen';
import { QuizScreen }    from './screens/QuizScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { WinScreen }     from './screens/WinScreen';

export function KatakanaApp() {
  const { state, dispatch } = useKatakana();

  switch (state.screen) {
    case 'intro':    return <IntroScreen    state={state} dispatch={dispatch} />;
    case 'study':    return <StudyScreen    state={state} dispatch={dispatch} />;
    case 'quiz':     return <QuizScreen     state={state} dispatch={dispatch} />;
    case 'gameover': return <GameOverScreen state={state} dispatch={dispatch} />;
    case 'win':      return <WinScreen      state={state} dispatch={dispatch} />;
  }
}
