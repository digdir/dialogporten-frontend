import crypto from 'crypto';
import '../config/env';

export function hashString(stringToBeHashed: string) {
  let pepper = process.env.HASH_PEPPER || 'superhemmeligstreng'; // denne hentes fra konfig

  const hash = crypto.createHash('blake2b512');
  hash.update(pepper + stringToBeHashed + pepper);

  return hash.digest('hex').substring(0, 20);
}
