import { useIdOS } from '@/context/idos-context';
import { useMutation } from '@tanstack/react-query';

export const useRequestGrant = () => {
  const { idOSClient } = useIdOS();

  return useMutation({
    mutationKey: ['request-grant'],
    mutationFn: async () => {
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
        consumerAuthPublicKey:
          import.meta.env.VITE_CONSUMER_AUTH_PUBLIC_KEY ||
          'b1115801ea37364102d0ecddd355c0465293af6efb5f7391c6b4b8065475af4e',
        consumerEncryptionPublicKey:
          import.meta.env.VITE_CONSUMER_ENCRYPTION_PUBLIC_KEY ||
          'veZMZWRsyW81K3yvyNpk7lECrNpH8W/Xhi4CIy/8vRg=',
      });
      if (!accessGrant) {
        console.warn('Failed to request access grant');
        return;
      }
      return accessGrant;
    },
  });
};
