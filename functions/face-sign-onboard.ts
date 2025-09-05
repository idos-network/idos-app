import { updateUserFaceSign } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import crypto from 'node:crypto';
import { createResponse } from './utils/response';

const facetecServer = process.env.FACETEC_SERVER as string;

export default async (request: Request, context: Context) => {
  // TODO: Get userID from token or session or whatever is available
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  const { faceScan, key, userAgent, auditTrailImage, lowQualityAuditTrailImage, sessionId } = await request.json();

  const response = await fetch(`${facetecServer}enrollment-3d"`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Key': key,
      'X-User-Agent': userAgent,
    },
    body: JSON.stringify({
      faceScan,
      auditTrailImage,
      lowQualityAuditTrailImage,
      externalDatabaseRefID: userId,
      sessionId,
    }),
  });

  if (!response.ok) {
    return createResponse(
      {
        error: true,
        wasProcessed: false,
        errorMessage: `FaceTec server error: ${response.statusText}`,
      },
      500
    );
  }

  const json = await response.json();

  if (!json.success || !json.wasProcessed || json.error !== false) {
    return createResponse({
      wasProcessed: json.wasProcessed,
      success: json.success,
      error: json.error,
      errorMessage: json.errorMessage,
    }, 400);
  }

  if (json.isLikelyDuplicate) {
    return createResponse({
      error: true,
      errorMessage: "Face already enrolled (duplicate detected)",
    }, 422);
  }

  const faceSignHash = crypto.createHash('sha256').update(faceScan).digest('hex');
  await updateUserFaceSign(userId, faceSignHash);

  return createResponse({
    success: true,
    wasProcessed: true,
    error: false,
    scanResultBlob: json.scanResultBlob,
  }, 200);
};

export const config: Config = {
  path: '/api/face-sign/:userId/onboard',
  method: 'POST',
};
