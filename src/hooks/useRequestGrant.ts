import { useIdOS } from '@/context/idos-context';
import { useMutation } from '@tanstack/react-query';

export const useRequestGrant = () => {
  const { idOSClient } = useIdOS();

  return useMutation({
    mutationKey: ['request-grant'],
    mutationFn: async () => {
      if (!idOSClient) return;
      if (idOSClient.state !== 'logged-in') {
        console.warn('Please login to continue');
        return;
      }
      const credentials = await idOSClient.getAllCredentials();
      const credential = credentials.find(
        (credential) => !credential.original_id,
      );
      if (!credential) {
        console.warn('No credential found');
        return;
      }
      const credentialId = credential.id;
      const accessGrant = await idOSClient.requestAccessGrant(credentialId, {
        consumerAuthPublicKey: import.meta.env.VITE_IDOS_AUTH_PUBLIC_KEY,
        consumerEncryptionPublicKey: import.meta.env
          .VITE_IDOS_ENCRYPTION_PUBLIC_KEY,
      });
      if (!accessGrant) {
        console.warn('Failed to request access grant');
        return;
      }
      return accessGrant;
    },
  });
};
