import { useEffect, useState } from "react";

/**
 * Debounce hook
 * - 입력이 "멈춘 뒤" delay(ms) 후에만 값이 반영됨
 * - 검색/자동완성에 throttle보다 더 적합
 */
export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debouncedValue;
};
