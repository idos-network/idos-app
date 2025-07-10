import type { IdosDWG } from '@/interfaces/idos-credential';

export const saveNewDWG = async (dwg: IdosDWG) => {
  const newIdOSDWG = {
    ...dwg,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  localStorage.setItem('idosDWG', JSON.stringify(newIdOSDWG));

  return newIdOSDWG;
};
