import { getKrakenUrl } from '@/api/kraken-url';
import { useIdOS } from '@/context/idos-context';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

export default function Kyc() {
  const { idOSClient, setIdOSClient } = useIdOS();
  const { data: url } = useQuery({
    queryKey: ['kyc-url'],
    queryFn: () => {
      return getKrakenUrl().then((res) => res);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const onSuccess = useCallback(
    async (data: any) => {
      console.log('onSuccess', data);
      if (idOSClient.state === 'with-user-signer') {
        const loggedIn = await idOSClient.logIn();
        if (loggedIn) setIdOSClient(loggedIn);
      }
    },
    [idOSClient, setIdOSClient],
  );

  const messageReceiver = useCallback(
    (message: MessageEvent) => {
      // React only messages from ID iframe
      if (message.origin === 'https://kraken.staging.sandbox.fractal.id') {
        if (message.data.open) {
          window.open(
            message.data.open,
            message.data.target,
            message.data.features,
          );
        } else {
          onSuccess(message.data);
        }
      }
    },
    [onSuccess],
  );

  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener('message', messageReceiver, {
      signal: controller.signal,
    });

    return () => controller.abort();
  }, []);

  return (
    <div>
      <iframe src={url} className="w-full" style={{ height: '85vh' }} />
    </div>
  );
}
