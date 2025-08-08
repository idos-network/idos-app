import { useIdOS } from '@/context/idos-context';
import { useEffect, useState } from 'react';

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { idOSClient, withSigner, isLoading: idosLoading } = useIdOS();

  useEffect(() => {
    const checkUser = async () => {
      if (idosLoading || !withSigner) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const userHasProfile = await withSigner.hasProfile();
        setHasProfile(userHasProfile);

        if (userHasProfile) {
          const loggedInClient = await withSigner.logIn();
          setUserId(loggedInClient.user.id);
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
