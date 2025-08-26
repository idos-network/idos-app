import { useIdOS } from '@/context/idos-context';
import type { idOSCredential } from '@idos-network/client';
import { useEffect, useState } from 'react';

export function useCredentialDetails(credentialId: string | null) {
  const { idOSClient } = useIdOS();
  const [credential, setCredential] = useState<idOSCredential | null>(null);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCredentialDetails = async () => {
      if (!credentialId || idOSClient.state !== 'logged-in') {
        setCredential(null);
        setDecryptedContent(null);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get the credential
        const cred = await idOSClient.getCredentialById(credentialId);

        if (!cred) {
          throw new Error(`Credential with id ${credentialId} not found`);
        }

        setCredential(cred);

        // Try to decrypt the content if available
        if (cred.content && cred.encryptor_public_key) {
          try {
            // Prepare the enclave provider
            await idOSClient.enclaveProvider.ensureUserEncryptionProfile();

            // Decrypt the content
            const decrypted = await idOSClient.enclaveProvider.decrypt(
              Buffer.from(cred.content, 'base64'),
              Buffer.from(cred.encryptor_public_key, 'base64'),
            );

            // Convert to UTF-8 string
            const content = new TextDecoder().decode(decrypted);
            setDecryptedContent(content);
          } catch (decryptError) {
            console.warn('Failed to decrypt credential content:', decryptError);
            setDecryptedContent(null);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch credential details'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentialDetails();
  }, [credentialId, idOSClient]);

  return { credential, decryptedContent, isLoading, error };
}
