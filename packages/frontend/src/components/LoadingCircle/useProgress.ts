import { createRef, useEffect } from 'react';

export const useProgress = (value: number) => {
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty('--progress', value + '%');
    ref.current.setAttribute('data-value', value.toString());
  }, [value, ref]);

  return { ref };
};
