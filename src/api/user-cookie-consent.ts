import axiosInstance from './axios';

export const saveUserCookieConsent = async (
  userId: string,
  accepted: number,
): Promise<void> => {
  const response = await axiosInstance.post(
    `/user/${userId}/cookie-consent-save`,
    {
      accepted,
    },
  );
  return response.data;
};

export const getUserCookieConsent = async (
  userId: string,
): Promise<number | null> => {
  const response = await axiosInstance.get(
    `/user/${userId}/cookie-consent-get`,
  );
  const data = response.data;

  if (!data || data.accepted === undefined) {
    return null;
  }

  return data.accepted as number;
};
