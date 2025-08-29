import axiosInstance from '@/api/axios';
import { parseWithSchema } from '@/api/parser';
import { z } from 'zod';

const authTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string(),
  userId: z.string().optional(),
  publicAddress: z.string(),
});

export type AuthTokens = z.infer<typeof authTokensSchema>;

const authMessageSchema = z.object({
  message: z.string(),
  nonce: z.string(),
  publicAddress: z.string(),
  userId: z.string().optional(),
});

export type AuthMessage = z.infer<typeof authMessageSchema>;

class AuthService {
  private static instance: AuthService;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    this.loadTokensFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadTokensFromStorage(): void {
    try {
      const storedTokens = localStorage.getItem('auth_tokens');
      if (storedTokens) {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      }
    } catch (error) {
      console.error('Error loading tokens from storage:', error);
      this.clearTokens();
    }
  }

  public saveTokensToStorage(tokens: AuthTokens): void {
    try {
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
    } catch (error) {
      console.error('Error saving tokens to storage:', error);
    }
  }

  private clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('auth_tokens');
  }

  public async getAuthMessage(
    publicAddress: string,
    publicKey: string,
  ): Promise<AuthMessage> {
    const response = await axiosInstance.post('auth/message', {
      publicAddress,
      publicKey,
    });

    return parseWithSchema(response.data, authMessageSchema);
  }

  public async verifySignature(
    publicAddress: string,
    publicKey: string,
    signature: string,
    message: string,
    nonce: string,
    walletType: string,
  ): Promise<AuthTokens> {
    const response = await axiosInstance.post('auth/verify', {
      publicAddress,
      publicKey,
      signature,
      message,
      nonce,
      walletType,
    });

    return response.data;
  }

  public async refreshTokens(): Promise<AuthTokens | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await axiosInstance.post('auth/refresh', {
        refreshToken: this.refreshToken,
      });

      return parseWithSchema(response.data, authTokensSchema);
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      this.clearTokens();
      return null;
    }
  }

  public getAccessToken(): string | null {
    if (!this.accessToken) {
      return null;
    }

    return this.accessToken;
  }

  public isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  public logout(): void {
    this.clearTokens();
  }

  public async authenticateWithWallet(): Promise<AuthTokens | null> {
    try {
      // TODO: Implement wallet connection logic
      return null;
    } catch (error) {
      console.error('Error authenticating with wallet:', error);
      return null;
    }
  }
}

export const authService = AuthService.getInstance();
