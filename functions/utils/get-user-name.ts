import { getUserById } from '@/db/user';
import { generateUniqueName } from './name-generator';

export async function getUserName(userId: string) {
  let name = '';

  const user = await getUserById(userId);

  if (user[0].name === null || user[0].name === '') {
    name = await generateUniqueName();
  } else {
    name = user[0].name;
  }

  return name;
}
