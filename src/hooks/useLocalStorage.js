
import { useState, useEffect } from 'react';

const getStorageValue = (key, defaultValue) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    try {
      return saved !== null ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      console.error(`Error parsing localStorage key “${key}”:`, e);
      return defaultValue;
    }
  }
  return defaultValue;
};

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
       console.error(`Error setting localStorage key “${key}”:`, e);
    }
  }, [key, value]);

  return [value, setValue];
};
  