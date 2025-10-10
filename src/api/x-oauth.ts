import axiosInstance from './axios';
import { parseWithSchema } from './parser';
import { z } from 'zod';

export const xOAuthResponseSchema = z.object({
  url: z.string(),
  codeVerifier: z.string(),
  state: z.string(),
});

export type XOAuthResponse = z.infer<typeof xOAuthResponseSchema>;

export const getXOAuth = async (userId: string): Promise<XOAuthResponse> => {
  const response = await axiosInstance.post(`/user/${userId}/x-oauth`);
  return parseWithSchema(response.data, xOAuthResponseSchema);
};
