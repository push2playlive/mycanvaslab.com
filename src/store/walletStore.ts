import { create } from 'zustand';

interface WalletState {
  balance: number;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 1500, // Initial "Neural Fuel"
  addCredits: (amount) => set((state) => ({ balance: state.balance + amount })),
  deductCredits: (amount) => set((state) => ({ balance: state.balance - amount })),
}));
