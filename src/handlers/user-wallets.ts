import { saveUserWallets } from '@/api/user-wallets';
import { type IdosWallet } from '@/interfaces/idos-profile';

export async function handleSaveUserWallets(
  userId: string,
  idosWallets: IdosWallet[],
) {
  const walletsToSave = idosWallets.map((wallet) => ({
    address: wallet.address,
    walletType: wallet.wallet_type,
  }));

  return await saveUserWallets({ userId, wallets: walletsToSave });
}
