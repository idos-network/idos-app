import { useIdOS } from '@/providers/idos/idos-client';
import React from 'react';

export function useIdOSLoginStatus() {
  const client = useIdOS();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    async function checkLoginStatus() {
      if (client.state !== 'logged-in') {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
    }

    checkLoginStatus();
  }, [client]);

  return isLoggedIn;
}
