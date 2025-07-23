import {
  base64Decode,
  binaryWriteUint16BE,
  borshSerialize,
  bytesConcat,
  hexEncode,
  utf8Decode,
} from '@/utils/codecs';
import type {
  Wallet as NearWallet,
  SignedMessage,
  SignMessageParams,
} from '@near-wallet-selector/core';
import type { connect as connectT } from 'near-api-js';
import type { AccessKeyList } from 'near-api-js/lib/providers/provider';
import { getNearConnectionConfig } from './get-config';

function createNearWalletSigner(
  wallet: NearWallet,
  recipient: string,
): (message: string | Uint8Array) => Promise<Uint8Array> {
  return async (message: string | Uint8Array): Promise<Uint8Array> => {
    const messageString =
      typeof message === 'string' ? message : utf8Decode(message);

    if (!wallet.signMessage) {
      throw new Error('Only wallets with signMessage are supported.');
    }

    const nonceSuggestion = Buffer.from(
      window.crypto.getRandomValues(new Uint8Array(32)),
    );

    const {
      nonce = nonceSuggestion,
      signature,
      // @ts-expect-error Signatures don't seem to be updated for NEP413 yet.
      callbackUrl,
      // biome-ignore lint/style/noNonNullAssertion: Only non-signing wallets return void.
    } = (await (
      wallet.signMessage as (
        _: SignMessageParams,
      ) => Promise<SignedMessage & { nonce?: Uint8Array }>
    )({
      message: messageString,
      recipient,
      nonce: nonceSuggestion,
    }))!;

    const nep413BorschSchema = {
      struct: {
        tag: 'u32',
        message: 'string',
        nonce: { array: { type: 'u8', len: 32 } },
        recipient: 'string',
        callbackUrl: { option: 'string' },
      },
    };

    const nep413BorshParams = {
      tag: 2147484061,
      message: messageString,
      nonce: Array.from(nonce),
      recipient,
      callbackUrl,
    };

    const nep413BorshPayload = borshSerialize(
      nep413BorschSchema,
      nep413BorshParams,
    );

    return bytesConcat(
      binaryWriteUint16BE(nep413BorshPayload.length),
      nep413BorshPayload,
      base64Decode(signature),
    );
  };
}

export async function signNearMessage(
  wallet: NearWallet,
  message: string,
  recipient = 'idos.network',
): Promise<string> {
  const signer = createNearWalletSigner(wallet, recipient);
  const signedPayload = await signer(message);
  return hexEncode(signedPayload);
}

export async function getNearFullAccessPublicKeys(
  namedAddress: string,
): Promise<string[] | undefined> {
  let connect: typeof connectT;
  try {
    connect = (await import('near-api-js')).connect;
  } catch (_e) {
    throw new Error("Can't load near-api-js");
  }
  const connectionConfig = getNearConnectionConfig(namedAddress);
  const nearConnection = await connect(connectionConfig);

  try {
    const response: AccessKeyList =
      await nearConnection.connection.provider.query({
        request_type: 'view_access_key_list',
        finality: 'final',
        account_id: namedAddress,
      });
    return response.keys
      .filter((element) => element.access_key.permission === 'FullAccess')
      ?.map((i) => i.public_key);
  } catch {
    // `Near` failed if namedAddress contains uppercase symbols
    return;
  }
}
