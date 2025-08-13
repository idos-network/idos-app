import type { Config, Context } from "@netlify/functions";
import jwt from "jsonwebtoken";
import invariant from "tiny-invariant";

const krakenApiUrl = process.env.KRAKEN_API_URL as string;
const krakenClientId = process.env.KRAKEN_CLIENT_ID as string;
const krakenLevel = process.env.KRAKEN_LEVEL as string;
const krakenPrivateKey = process.env.KRAKEN_PRIVATE_KEY?.replace(/\\n/g, '\n') as string;


export default async (_request: Request, _context: Context) => {
    invariant(krakenApiUrl, "`KRAKEN_API_URL` is not set");
    invariant(krakenClientId, "`KRAKEN_CLIENT_ID` is not set");
    invariant(krakenLevel, "`KRAKEN_LEVEL` is not set");
    invariant(krakenPrivateKey, "`KRAKEN_PRIVATE_KEY` is not set");

    const payload = {
        clientId: krakenClientId,
        kyc: true,
        level: krakenLevel,
        state: Date.now().toString(),
    };
    try {

        const token = jwt.sign(payload, krakenPrivateKey, { algorithm: "ES512" });

        return new Response(JSON.stringify({ url: `${krakenApiUrl}/kyc?token=${token}&provider=${"persona"}` }), { status: 200 });
    } catch (error) {
        console.error('Error in kraken-url:', error);
        throw error;
    }
}



export const config: Config = {
    path: '/api/kraken-url',
    method: 'GET',
};
