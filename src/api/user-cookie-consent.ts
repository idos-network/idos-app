import axiosInstance from './axios';

export const saveUserCookieConsent = async (
  userId: string,
  accepted: boolean,
): Promise<void> => {
  const response = await axiosInstance.post(`/user/${userId}/cookie-consent`, {
    accepted,
  });
  return response.data;
};

export const getUserCookieConsent = async (
  userId: string,
): Promise<boolean | null> => {
  const response = await axiosInstance.get(`/user/${userId}/cookie-consent`);
  const data = response.data;

  if (!data || data.accepted === undefined) {
    return null;
  }

  return data.accepted;
};
