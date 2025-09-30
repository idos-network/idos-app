import axiosInstance from './axios';

export const createDWG = async (
  identifier: string,
  grantee_wallet_identifier: string,
  issuer_public_key: string
) => {
  const response = await axiosInstance.post('/idos-credential-dwg', {
    identifier,
    grantee_wallet_identifier,
    issuer_public_key
  });



  return response.data;
};


