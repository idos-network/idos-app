import { create } from 'zustand';

interface OnboardingStore {
  stepIndex: number;
  setStepIndex: (stepIndex: number) => void;
  nextStep: () => void;
  previousStep: () => void;
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  stepIndex: 0,
  setStepIndex: (stepIndex) => set({ stepIndex }),
  nextStep: () => {
    console.log('nextStep');
    return set((state) => ({ stepIndex: state.stepIndex + 1 }));
  },
  previousStep: () => set((state) => ({ stepIndex: state.stepIndex - 1 })),
}));
