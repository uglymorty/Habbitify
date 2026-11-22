import React, {
    createContext,
    useContext,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from 'react';

import type { Habit } from '../../types/habit';

type HabitsContextType = {
  habits: Habit[];
  setHabits: Dispatch<SetStateAction<Habit[]>>;
};

const HabitsContext = createContext<HabitsContextType | undefined>(
  undefined
);

type HabitsProviderProps = {
  children: ReactNode;
};

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: 'Выпить 2 литра воды',
      category: 'health',
      description: '',
      createdAt: '2026-11-10',
      completedDates: [],
      frequency: 'daily',
    },
    {
      id: 2,
      name: 'Сходить в спортзал',
      category: 'sport',
      description: '',
      createdAt: '2026-11-10',
      completedDates: [],
      frequency: 'daily',
    },
  ]);

  return (
    <HabitsContext.Provider value={{ habits, setHabits }}>
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error('useHabits must be used inside HabitsProvider');
  }

  return context;
}