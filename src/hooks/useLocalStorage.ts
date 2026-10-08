"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored) as T);
      else window.localStorage.setItem(key, JSON.stringify(initialValue));
    } catch {
      setValue(initialValue);
    }
    setHydrated(true);
  }, [initialValue, key]);

  const update = (nextValue: T | ((current: T) => T)) => {
    setValue((current) => {
      const next = typeof nextValue === "function"
        ? (nextValue as (current: T) => T)(current)
        : nextValue;
      window.localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };

  return { value, setValue: update, hydrated };
}
