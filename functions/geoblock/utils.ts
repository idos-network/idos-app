import { z } from 'zod';
import type { GeoblockConfig } from './interface';
import { ipDataSchema } from './interface';

type IpData = z.infer<typeof ipDataSchema>;

export function isBlockedIp(ipData: IpData, geoblockConfig: GeoblockConfig) {
  const isLocationBlocked =
    ipData.location.country.code &&
    geoblockConfig.countries.some(
      (country) => country.code === ipData.location.country.code,
    );

  const isSecurityBlocked = Object.entries(geoblockConfig.security).some(
    ([key, value]) => {
      return (
        value === true &&
        ipData.security[key as keyof typeof ipData.security] === true
      );
    },
  );

  return isLocationBlocked || isSecurityBlocked;
}
