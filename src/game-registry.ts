import type { ComponentType } from 'react';

export interface GameTab {
  id: string;
  icon: string;
  label: string;
  component: ComponentType;
}
