import { useState, useEffect } from 'react';

/**
 * Hook để debounce một value
 * @param {any} value - Value cần debounce
 * @param {number} delay - Delay tính bằng milliseconds (default: 500)
 * @returns {any} Debounced value
 */
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
