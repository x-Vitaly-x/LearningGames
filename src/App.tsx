import { useState } from 'react';
import { PUBLIC_GAMES } from './public-games';
import { PRIVATE_GAMES } from './private-games';

const TABS = [...PUBLIC_GAMES, ...PRIVATE_GAMES];

export default function App() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const ActiveComponent = TABS.find(t => t.id === activeId)?.component ?? TABS[0].component;

  return (
    <div className="flex h-screen overflow-hidden">
      <nav className="w-44 bg-slate-800 flex flex-col shrink-0">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`flex items-center gap-3 px-4 py-4 text-left transition-colors ${
              activeId === tab.id
                ? 'bg-slate-600 text-white'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </nav>

      <main className="flex-1 flex items-center justify-center bg-slate-100 overflow-auto">
        <ActiveComponent />
      </main>
    </div>
  );
}
