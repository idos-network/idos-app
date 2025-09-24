import { updateUserFaceSign } from '@/db/user';
import { UserNotFoundError } from '@/utils/errors';
import type { Config, Context } from '@netlify/functions';
import { createResponse } from './utils/response';

const facetecServer = process.env.FACETEC_SERVER as string;

export default async (request: Request, context: Context) => {
  // TODO: Get userID from token or session or whatever is available
  const { userId } = context.params;

  if (!userId) {
    throw new UserNotFoundError(userId);
  }

  const { faceScan, key, userAgent, auditTrailImage, lowQualityAuditTrailImage, sessionId } = await request.json();

  const response = await fetch(`${facetecServer}login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      userAgent,
      faceScan,
      auditTrailImage,
      lowQualityAuditTrailImage,
      sessionId,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    return createResponse(
      {
        error: true,
        wasProcessed: false,
        errorMessage: json.errorMessage ?? `FaceSign server error: ${response.statusText}`,
      },
      500
    );
  }

  if (!json.success) {
    return createResponse({
      wasProcessed: false,
      success: false,
      error: json.error,
      errorMessage: json.errorMessage,
    }, 400);
  }

  try {
    await updateUserFaceSign(userId, json.faceSignUserId);

    return createResponse({
      success: true,
      wasProcessed: true,
      error: false,
      duplicate: false,
      scanResultBlob: json.scanResultBlob,
    }, 200);
  } catch (e) {
    return createResponse({
      success: false,
      wasProcessed: true,
      error: true,
      duplicate: true,
      errorMessage: "Sorry, you have already created an idOS profile with FaceSign on another wallet. Please disconnect and reconnect with that original wallet.",
    }, 400);
  }
};

export const config: Config = {
  path: '/api/face-sign/:userId/onboard',
  method: 'POST',
};
