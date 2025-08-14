import type { Config, Context } from "@netlify/functions";
import jwt from "jsonwebtoken";
import https from "node:https";
import invariant from "tiny-invariant";

export default async (_request: Request, _context: Context) => {
    const credentialId = _request.url.split("?")[1].split("=")[1];
    const response = await fetch(
        `${process.env.KRAKEN_API_URL}/public/kyc/dag/${credentialId}/sharedToken?forClientId=transak`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${await getKrakenToken()}`,
            },
            // @ts-ignore - Node.js specific option
            agent: new https.Agent({
                rejectUnauthorized: false,
                checkServerIdentity: () => undefined, // This will bypass the certificate chain verification
            }),
        },
    ).then((res) => res.json());

    return Response.json({ token: response });
}

async function getKrakenToken(): Promise<string> {
    const payload = {
        api: true,
        clientId: process.env.KRAKEN_CLIENT_ID,
    };
    invariant(process.env.KRAKEN_PRIVATE_KEY, "KRAKEN_PRIVATE_KEY is not set");

    return jwt.sign(payload, process.env.KRAKEN_PRIVATE_KEY, {
        algorithm: "ES512",
        expiresIn: "600s",
    });
}


export const config: Config = {
    path: '/api/transak-token',
    method: 'GET',
};
