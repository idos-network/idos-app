import { useState } from 'react';

export function useStepState(initial = 'idle') {
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { state, setState, loading, setLoading, error, setError };
}
