import { queryClient } from '@/providers/tanstack-query/query-client';
import { createIDOSClient, type idOSClient } from '@idos-network/client';
import { create } from 'zustand';

export const _idOSClient = new idOSClientConfiguration({
  nodeUrl: 'https://nodes.staging.idos.network/',
  enclaveOptions: {
    container: '#idOS-enclave',
    url: 'https://enclave.staging.idos.network/',
  },
});

interface IdosStore {
  idOSClient: idOSClient | null;
  setIdOSClient: (idOSClient: idOSClient) => void;
  initializing: boolean;
  resetStore: () => void;
}

export const useIdosStore = create<IdosStore>((set) => ({
  idOSClient: null,
  initializing: false,
  setIdOSClient: (idOSClient) => set({ idOSClient }),
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
