import { idOSConsumer } from "@/config/consumer.config";
import type { Config, Context } from "@netlify/functions";
import { withSentry } from "./utils/sentry";

export default withSentry(async (request: Request, _context: Context) => {
  const userId = request.url.split("?")[1].split("=")[1];

  if (!userId) {
    return new Response(JSON.stringify({ error: "Credential ID and address are required" }), { status: 400 });
  }
  const consumer = await idOSConsumer();
  const credentials = await consumer.getCredentialsSharedByUser(userId);
  const [usableCredential] = credentials.filter(
    (credential) => credential.issuer_auth_public_key === process.env.IDOS_PUBLIC_KEY,
  );
  const issuerURL = process.env.KRAKEN_ISSUER;
  const publicKeyMultibase = process.env.KRAKEN_PUBLIC_KEY_MULTIBASE;

  if (!usableCredential)
    return new Response(JSON.stringify({ error: "No credential were shared with this user" }), { status: 400 });

  const credentialContent = await consumer.getSharedCredentialContentDecrypted(usableCredential.id);

  if (!credentialContent)
    return new Response(JSON.stringify({
      success: false,
      credential: null,
      message: "No credential found",
    }), { status: 400 });

  // @todo: some users can get their credentials from other issuers. meaning that verificationResult will be false. what should we do about that?
  const verificationResult = await consumer.verifyCredential(JSON.parse(credentialContent), [
    {
      issuerURL,
      publicKeyMultibase,
    },
  ]);

  // @todo: what should we do about
  // if (!verificationResult) {
  //   return Response.json(
  //     { error: `Invalid credential signature for credential ${credentialId}` },
  //     { status: 400 },
  //   );
  // }

  return new Response(JSON.stringify({
    credentialContent: JSON.parse(credentialContent).credentialSubject,
    verificationResult,
    credentialId: usableCredential.id,
  }), { status: 200 });
});

export const config: Config = {
  path: "/api/get-shared-credential",
  method: "GET",
};