import { userNameExists } from '@/db/user';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

function capitalize(str: string): string {
  const words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join('');
}

export function generateName(): string {
  const adjective = faker.word.words(1);
  const color = faker.color.human();
  const animal = faker.animal.type();

  return capitalize(adjective) + capitalize(color) + capitalize(animal);
}

function shortId(): string {
  return randomUUID().split('-')[0];
}

export async function generateUniqueName(): Promise<string> {
  let name = generateName();

  while (await userNameExists(name)) {
    name = generateName() + '-' + shortId();
  }

  return name;
}
