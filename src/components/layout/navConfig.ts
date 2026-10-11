import React from 'react';
import {
  Atom,
  Compass,
  Stethoscope,
  FileCheck,
  BookmarkPlus,
  Zap,
  Target,
  BookOpen,
  Layers,
  Bot,
  BarChart3,
} from 'lucide-react';
import { ActiveTab } from '../../types';

export interface NavItem {
  id: ActiveTab;
  label: string;
  /** Short label used in the tablet icon rail and compact contexts. */
  short: string;
  icon: React.ElementType;
  group: NavGroupId;
  description: string;
}

export type NavGroupId = 'learn' | 'practice' | 'study' | 'mentor' | 'insights';

export interface NavGroup {
  id: NavGroupId;
  label: string;
}

export const NAV_GROUPS: NavGroup[] = [
  { id: 'learn', label: 'Learn' },
  { id: 'practice', label: 'Practice' },
  { id: 'study', label: 'Study' },
  { id: 'mentor', label: 'Mentor' },
  { id: 'insights', label: 'Insights' },
];

export const NAV_ITEMS: NavItem[] = [
  { id: 'jee', label: 'JEE Hub (PCM)', short: 'JEE Hub', icon: Atom, group: 'learn', description: 'PCM command center' },
  { id: 'blueprint', label: 'JEE Blueprint', short: 'Blueprint', icon: Compass, group: 'learn', description: 'Class 11 / 12 / Dropper roadmap' },
  { id: 'neet', label: 'NEET Hub (PCB)', short: 'NEET Hub', icon: Stethoscope, group: 'learn', description: 'PCB command center' },
  { id: 'tests', label: 'NTA CBT Tests', short: 'Mock Tests', icon: FileCheck, group: 'practice', description: 'Full-length CBT simulator' },
  { id: 'mistakes', label: 'Mistake Notebook', short: 'Mistakes', icon: BookmarkPlus, group: 'practice', description: 'Your galti diary' },
  { id: 'formulas', label: 'Formula Deck', short: 'Formulas', icon: Zap, group: 'practice', description: 'High-yield formula sheets' },
  { id: 'planner', label: 'Daily Goals & Focus', short: 'Planner', icon: Target, group: 'study', description: 'Daily goals and focus blocks' },
  { id: 'notes', label: 'NCERT Notes', short: 'Notes', icon: BookOpen, group: 'study', description: 'Line-by-line NCERT notes' },
  { id: 'flashcards', label: 'Flashcards', short: 'Flashcards', icon: Layers, group: 'study', description: 'Active-recall decks' },
  { id: 'tutor', label: 'AI Rank Mentor', short: 'AI Mentor', icon: Bot, group: 'mentor', description: 'Ask your AI mentor' },
  { id: 'analytics', label: 'Performance & Rank', short: 'Analytics', icon: BarChart3, group: 'insights', description: 'Performance and rank trends' },
];

export const getNavItem = (id: ActiveTab): NavItem =>
  NAV_ITEMS.find((item) => item.id === id) ?? NAV_ITEMS[0];

export const getNavGroup = (id: ActiveTab): NavGroup =>
  NAV_GROUPS.find((group) => group.id === getNavItem(id).group) ?? NAV_GROUPS[0];
