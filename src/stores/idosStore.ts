import { queryClient } from '@/providers/tanstack-query/query-client';
import { createIDOSClient, type idOSClient } from '@idos-network/client';
import { create } from 'zustand';

export const _idOSClient = createIDOSClient({
  nodeUrl: import.meta.env.VITE_IDOS_NODE_URL,
  enclaveOptions: {
    container: '#idOS-enclave',
    url: import.meta.env.VITE_IDOS_ENCLAVE_URL,
  },
});

interface IdosStore {
  idOSClient: idOSClient | null;
  setIdOSClient: (idOSClient: idOSClient) => void;
  initializing: boolean;
  settingSigner: boolean;
  resetStore: () => void;
  setSettingSigner: (settingSigner: boolean) => void;
}

export const useIdosStore = create<IdosStore>((set) => ({
  idOSClient: null,
  initializing: false,
  settingSigner: true,
  setIdOSClient: (idOSClient) => set({ idOSClient }),
  setSettingSigner: (settingSigner) => set({ settingSigner }),
  resetStore: async () => {
    const { idOSClient } = useIdosStore.getState();
    if (idOSClient && 'logOut' in idOSClient) {
      const idleClient = await idOSClient.logOut();
      set({ idOSClient: idleClient, initializing: true });
      window.location.reload();
      queryClient.removeQueries();
    }
  },
}));
