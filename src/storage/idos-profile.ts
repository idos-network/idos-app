import type { IdosUserProfile } from '@/interfaces/idos-profile';

export const saveNewUserToLocalStorage = (idosUser: IdosUserProfile) => {
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

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('idosUser');
};

export const updateUserStateInLocalStorage = (
  mainAddress: string,
  fields: Partial<IdosUserProfile>,
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

export const getCurrentUserFromLocalStorage = (): IdosUserProfile | null => {
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

export const clearUserDataFromLocalStorage = () => {
  localStorage.removeItem('idosUser');
};
