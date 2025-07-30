import { useIdOS } from '@/context/idos-context';
import React from 'react';

export function useIdOSLoginStatus() {
  const { idOSClient } = useIdOS();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    async function checkLoginStatus() {
      if (idOSClient.state !== 'logged-in') {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
    }

    checkLoginStatus();
  }, [idOSClient]);

  return isLoggedIn;
}
