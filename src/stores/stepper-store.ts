import { create } from 'zustand';

interface StepperStore {
    started: boolean;
    setStarted: (started: boolean) => void;
    step: number;
    setStep: (step: number) => void;
    reset: () => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const useStepperStore = create<StepperStore>((set) => ({
    started: false,
    setStarted: (started) => set({ started }),
    step: 0,
    setStep: (step) => {
        console.log('setStep', step);
        return set({ step })
    },
    reset: () => set({ started: false, step: 0 }),
    nextStep: () => {
        console.log('nextStep');
        return set((state) => ({ step: state.step + 1 }))
    },
    prevStep: () => {
        console.log('prevStep');
        return set((state) => ({ step: state.step - 1 }))
    },
}));