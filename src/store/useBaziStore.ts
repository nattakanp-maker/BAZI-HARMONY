import { create } from 'zustand';
import { BaZiAnalysis } from '../services/geminiService';

interface BaziState {
  userData: {
    name: string;
    birthDate: string;
    birthTime: string;
    gender: string;
  } | null;
  analysis: BaZiAnalysis | null;
  appState: 'input' | 'loading' | 'result';
  setUserData: (data: { name: string; birthDate: string; birthTime: string; gender: string } | null) => void;
  setAnalysis: (analysis: BaZiAnalysis | null) => void;
  setAppState: (state: 'input' | 'loading' | 'result') => void;
  reset: () => void;
}

export const useBaziStore = create<BaziState>((set) => ({
  userData: null,
  analysis: null,
  appState: 'input',
  setUserData: (data) => set({ userData: data }),
  setAnalysis: (analysis) => set({ analysis }),
  setAppState: (state) => set({ appState: state }),
  reset: () => set({ userData: null, analysis: null, appState: 'input' }),
}));
