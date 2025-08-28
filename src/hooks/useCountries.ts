import { useQuery } from '@tanstack/react-query';

export interface Country {
  name: {
    common: string;
    official: string;
  };
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
  region: string;
  subregion?: string;
  population: number;
  capital?: string[];
  currencies?: Record<
    string,
    {
      name: string;
      symbol: string;
    }
  >;
  languages?: Record<string, string>;
}

async function fetchCountries(): Promise<Country[]> {
  const response = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,flags',
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.statusText}`);
  }

  const countries: Country[] = await response.json();

  return countries;
}

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
