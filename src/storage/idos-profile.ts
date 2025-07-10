import type { IdosUser } from '../interfaces/idos-profile';

export const saveNewUser = async (idosUser: IdosUser) => {
  const newIdOSUser = {
    ...idosUser,
    idosKey: true,
    humanVerified: false,
    idosStakingCredential: false,
    createdAt: new Date().toUTCString(),
    updatedAt: new Date().toUTCString(),
  };

  localStorage.setItem('idosUser', JSON.stringify(newIdOSUser));

  return newIdOSUser;
};

export const updateUserState = async (
  mainAddress: string,
  fields: Partial<IdosUser>,
) => {
  const userData = localStorage.getItem('idosUser');
  if (!userData) {
    throw new Error('No user data found');
  }

  const user = JSON.parse(userData);
  if (user.mainAddress !== mainAddress) {
    throw new Error('Address mismatch');
  }

  const updatedUser = {
    ...user,
    ...fields,
    updatedAt: new Date().toUTCString(),
  };

  localStorage.setItem('idosUser', JSON.stringify(updatedUser));
  return updatedUser;
};

export const getCurrentUser = (): IdosUser | null => {
  const userData = localStorage.getItem('idosUser');
  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

export const clearUserData = () => {
  localStorage.removeItem('idosUser');
};
