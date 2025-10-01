import axiosInstance from './axios';

export const subscribeNewsletter = async (
  email: string,
) => {
  const response = await axiosInstance.post('/subscribe-newsletter', {
    email
  });

  return response.data;
};
