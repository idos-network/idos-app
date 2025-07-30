import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
