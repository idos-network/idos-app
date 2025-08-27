import { Button } from '@/components/ui/button';
import { useCountries, type Country } from '@/hooks/useCountries';
import { useSellTokenStore } from '@/stores/sell-token-store';
import { useMemo, useState } from 'react';

export default function CountriesSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedCountry, setSelectedCountry } = useSellTokenStore();
  const { data: countries, isLoading, error } = useCountries();
  console.log({ countries });

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    console.log({ searchQuery });

    if (!countries) return [];

    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query) ||
        country.name.official.toLowerCase().includes(query),
    );
  }, [countries, searchQuery]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
  };

  if (error) {
    return (
      <div className="text-red-400 text-sm">
        Failed to load countries. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <>
          <h3 className="text-xl font-heading text-center">
            Where are you located?
          </h3>
          <p className="text-sm text-center text-neutral-400 mb-5">
            Availability may vary based on your bank’s location and our payment
            providers.
          </p>
        </>

        <div className="relative w-full ">
          {/* Search */}
          <div className="relative w-full bg-[#1B1B1B] border-neutral-700/50 text-white h-12 flex flex-col justify-center px-3 rounded-xl mb-2 ">
            {!selectedCountry ? (
              <input
                type="text"
                placeholder="Search a country"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
                className=" placeholder:text-neutral-400 focus:border-primary  ring-0 focus:ring-0 focus:outline-none"
              />
            ) : (
              <>
                <div
                  className="flex items-center gap-2"
                  onClick={() => setSelectedCountry(null)}
                >
                  <img
                    src={selectedCountry.flags.svg}
                    alt={`${selectedCountry.name.common} flag`}
                    className="w-6 h-5 object-cover rounded-sm"
                  />
                  <span className="text-white text-sm">
                    {selectedCountry.name.common}
                  </span>
                </div>
              </>
            )}

            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            )}
          </div>

          {/* Search List */}
          {!isLoading && (
            <div className=" w-full mt-1 rounded-md max-h-60 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="p-3 text-neutral-400 text-sm">
                  {searchQuery
                    ? 'No countries found'
                    : 'No countries available'}
                </div>
              ) : (
                filteredCountries.slice(0, 50).map((country) => (
                  <Button
                    key={country.name.common}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-neutral-700/50 rounded-none border-0"
                    onClick={() => handleCountrySelect(country)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <img
                        src={country.flags.svg}
                        alt={`${country.name.common} flag`}
                        className="w-6 h-5 object-cover rounded-sm flex-shrink-0"
                      />
                      <div className="text-white text-sm font-medium">
                        {country.name.common}
                      </div>
                    </div>
                  </Button>
                ))
              )}
              {filteredCountries.length > 50 && (
                <div className="p-3 text-neutral-400 text-xs border-t border-neutral-700/50">
                  Showing first 50 results. Refine your search for more specific
                  results.
                </div>
              )}
            </div>
          )}
        </div>
        {/* Continue Button */}
        <Button
          type="button"
          variant="secondary"
          className="mt-7"
          disabled={!selectedCountry}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
