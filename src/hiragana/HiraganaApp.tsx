import { useHiragana } from './useHiragana';
import { IntroScreen }   from './screens/IntroScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { WinScreen }     from './screens/WinScreen';
import { StudyScreen }   from './screens/StudyScreen';
import { QuizScreen }    from './screens/QuizScreen';

export function HiraganaApp() {
  const { state, dispatch } = useHiragana();

  switch (state.screen) {
    case 'intro':    return <IntroScreen    state={state} dispatch={dispatch} />;
    case 'gameover': return <GameOverScreen state={state} dispatch={dispatch} />;
    case 'win':      return <WinScreen      state={state} dispatch={dispatch} />;
    case 'study':    return <StudyScreen    state={state} dispatch={dispatch} />;
    case 'quiz':     return <QuizScreen     state={state} dispatch={dispatch} />;
  }
}
