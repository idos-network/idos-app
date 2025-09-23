import axiosInstance from './axios';

export const getFaceSignMobileUrl = async (userId: string): Promise<string> => {
  const response = await axiosInstance.post(`/face-sign/${userId}/mobile-url`);

  return response.data.url;
};

export const checkToken = async (token: string): Promise<string> => {
  const response = await axiosInstance.get(`/face-sign/${token}/user`, {
    headers: { Accept: 'application/json' },
  });

  return response.data.userId;
};

export const getPublicKey = async (): Promise<string> => {
  const response = await axiosInstance.get(`/face-sign/public-key`, {
    headers: { Accept: 'plain/text' },
  });

  return response.data;
};

export const getFaceSignStatus = async (
  userId: string,
): Promise<{ faceSignDone: boolean; popCredentialsWritten: boolean }> => {
  const response = await axiosInstance.get(`/face-sign/${userId}/status`, {
    headers: { Accept: 'application/json' },
  });

  return response.data;
};

export const getSessionToken = async (
  userId: string,
  key: string,
  deviceIdentifier: string,
): Promise<string> => {
  const response = await axiosInstance.post(
    `/face-sign/${userId}/session-token`,
    { key, deviceIdentifier },
  );

  return response.data.sessionToken;
};
