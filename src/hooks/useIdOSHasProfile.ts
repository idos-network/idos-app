import { useIdOS } from '@/context/idos-context';

export function useIdOSLoginStatus() {
  const { idOSClient, initializing } = useIdOS();

  // Only return true if not loading and actually logged in
  return !initializing && idOSClient && idOSClient.state === 'logged-in';
}
