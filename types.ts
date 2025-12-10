import { LucideIcon } from 'lucide-react';

export interface InfoCardData {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Section {
  HOME = 'HOME',
  TYPES = 'TYPES',
  FUTURE = 'FUTURE',
  CHAT = 'CHAT',
  MONITOR = 'MONITOR'
}