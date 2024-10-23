type IndexedObject = { [key: string]: unknown };

export const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 == null || obj2 == null) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  const obj1Typed = obj1 as IndexedObject;
  const obj2Typed = obj2 as IndexedObject;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1Typed[key], obj2Typed[key])) {
      return false;
    }
  }

  return true;
};
