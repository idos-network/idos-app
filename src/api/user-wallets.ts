import {
  type SaveUserWalletsRequest,
  type UserWallet,
  userWalletSchema,
} from '@/interfaces/user-wallets';
import { z } from 'zod';
import axiosInstance from './axios';
import { parseWithSchema } from './parser';

export async function saveUserWallets(
  data: SaveUserWalletsRequest,
): Promise<{ success: boolean; error?: string }> {
  const response = await axiosInstance.post('/user-wallets/save', data);
  return response.data;
}

export async function getUserWallets(userId: string): Promise<UserWallet[]> {
  const response = await axiosInstance.get(`/user-wallets/${userId}`);
  return parseWithSchema(response.data, z.array(userWalletSchema));
}
