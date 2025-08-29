import { parseWithSchema } from '@/api/parser';
import {
  InMemoryCache,
  IpregistryClient,
  IpregistryOptions,
  UserAgents,
} from '@ipregistry/client';
import type { Config, Context } from '@netlify/functions';
import geoblockConfigData from './geoblock.json';
import { ipDataSchema, type GeoblockConfig } from './interface';
import { isBlockedIp } from './utils';

const client: IpregistryClient = new IpregistryClient(
  process.env.IPREGISTRY_API_KEY as string,
  new InMemoryCache(10000, 3600 * 24 * 1000),
);

export const geoblockConfig: GeoblockConfig = geoblockConfigData;

export default async (request: Request, context: Context) => {
  if (process.env.NODE_ENV !== 'production') {
    return new Response(JSON.stringify({ blocked: false }), {
      status: 200,
    });
  }

  const userAgent = request.headers.get('user-agent') || '';
  if (UserAgents.isBot(userAgent)) {
    return new Response(JSON.stringify({ blocked: true }), {
      status: 200,
    });
  }

  const ip = context.ip;

  try {
    const response = await client.lookupIp(
      ip,
      IpregistryOptions.filter(
        'location.country.name,location.country.code,security',
      ),
    );

    const ipData = parseWithSchema(response.data, ipDataSchema);
    const isBlocked = isBlockedIp(ipData, geoblockConfig);

    return new Response(JSON.stringify({ blocked: isBlocked }), {
      status: 200,
    });
  } catch (error) {
    console.error('Unexpected IPRegistry error:', error);
    return;
  }
};

export const config: Config = {
  path: '/api/geoblock',
  method: 'GET',
};
