import { create } from 'zustand';

interface ProfileStore {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isLoadingAuth: boolean;
  setIsLoadingAuth: (isLoadingAuth: boolean) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  isLoadingAuth: false,
  setIsLoadingAuth: (isLoadingAuth) => set({ isLoadingAuth }),
}));
