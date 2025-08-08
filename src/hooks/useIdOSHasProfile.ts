import { useIdOS } from '@/context/idos-context';

export function useIdOSLoginStatus() {
  const { idOSClient, isLoading } = useIdOS();

  // Only return true if not loading and actually logged in
  return !isLoading && idOSClient.state === 'logged-in';
}
