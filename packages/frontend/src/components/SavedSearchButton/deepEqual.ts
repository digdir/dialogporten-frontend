type IndexedObject<T = unknown> = { [key: string]: T };

export const deepEqual = (obj1: unknown, obj2: unknown): boolean => {
  if (obj1 === obj2) return true;

  if (!obj1 || !obj2 || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  const obj1Typed = obj1 as IndexedObject;
  const obj2Typed = obj2 as IndexedObject;

  for (const [key, value1] of Object.entries(obj1Typed)) {
    const value2 = obj2Typed[key];

    if (value2 === undefined) return false;

    if (value1 instanceof Date && value2 instanceof Date) {
      if (value1.getTime() !== value2.getTime()) return false;
      continue;
    }

    if (value1 instanceof RegExp && value2 instanceof RegExp) {
      if (value1.toString() !== value2.toString()) return false;
      continue;
    }

    if (!deepEqual(value1, value2)) return false;
  }

  return true;
};
