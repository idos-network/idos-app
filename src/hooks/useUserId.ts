import { useIdOS } from '@/context/idos-context';
import { useEffect, useState } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { idOSClient, withSigner, isLoading: idosLoading } = useIdOS();

  useEffect(() => {
    const checkUser = async () => {
      if (idosLoading) {
        setIsLoading(true);
        return;
      }

      setIsLoading(true);
      try {
        // If the client is already logged in, use it directly
        if (idOSClient.state === 'logged-in') {
          setUserId(idOSClient.user.id);
          setHasProfile(true);
        } else if (withSigner) {
          // Only check if user has profile, don't trigger login here
          // The IDOSClientProvider handles the login
          const userHasProfile = await withSigner.hasProfile();
          setHasProfile(userHasProfile);
          setUserId(null); // Will be set when provider logs in
        } else {
          setHasProfile(false);
          setUserId(null);
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        setHasProfile(false);
        setUserId(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [idOSClient, withSigner, idosLoading]);

  return { userId, hasProfile, isLoading };
}
