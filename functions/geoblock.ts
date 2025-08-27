import { IpregistryClient, IpregistryOptions } from '@ipregistry/client';
import type { Config, Context } from '@netlify/functions';

export default async (_request: Request, context: Context) => {
  const ip = context.ip;
  console.log('///// CONTEXT', context, '\n/////');

  const client: IpregistryClient = new IpregistryClient(
    process.env.IPREGISTRY_API_KEY as string,
  );
  try {
    const response = await client.lookupIp(
      ip,
      IpregistryOptions.filter(
        'location.country.name,location.country.code,location.region.name,location.city,security',
      ),
    );

    return new Response(
      JSON.stringify({ data: response.data, context: context.ip }),
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error('Unexpected IPRegistry error:', error);
    return;
  }
};

export const config: Config = {
  path: '/api/geoblock',
  method: 'GET',
};
