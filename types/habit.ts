export type Frequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'


export type Habit = {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  completedDates: string[];

  frequency: Frequency;
  selectedDays?: number[];
  dayOfMonth?: number;
  monthOfYear?: number;
};