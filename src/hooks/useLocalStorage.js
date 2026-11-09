import { useEffect, useState } from 'react';

function readValue(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? defaultValue : JSON.parse(raw);
  } catch {
    // Missing access or broken JSON: fall back to the default.
    return defaultValue;
  }
}

// Same call shape as useState, but the value is kept in localStorage.
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readValue(key, defaultValue));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked; the app still works without saving.
    }
  }, [key, value]);

  return [value, setValue];
}
