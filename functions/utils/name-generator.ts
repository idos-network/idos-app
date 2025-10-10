import { userNameExists } from '@/db/user';
import { faker } from '@faker-js/faker';

export const generateName = (): string => {
  const adjective = faker.word.words(1);
  const color = faker.color.human();
  const animal = faker.animal.type();

  const capitalize = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  return `${capitalize(adjective)}${capitalize(color)}${capitalize(animal)}`;
};

export const generateUniqueName = async (): Promise<string> => {
  let name = generateName();

  let attempts = 0;
  const maxAttempts = 10;

  while ((await userNameExists(name)) && attempts < maxAttempts) {
    name = generateName();
    attempts++;
  }

  if (attempts >= maxAttempts) {
    const timestamp = Date.now().toString(36);
    name = `${name}${timestamp}`;
  }

  return name;
};
