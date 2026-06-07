import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Drop-in replacement for useState that persists across app restarts / logout.
//   const [inputs, setInputs, hydrated] = usePersistedState('rental:buyOrInvest', DEFAULTS);
// `hydrated` is false until the stored value has loaded (use it to avoid a flash if you like).
export function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (active && raw != null) setValue(JSON.parse(raw));
      } catch (e) { /* fall back to default */ }
      if (active) setHydrated(true);
    })();
    return () => { active = false; };
    // key is treated as stable per screen
  }, []);

  // Save on change, but only after hydration so we never overwrite stored data with the default
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }, [value, hydrated]);

  return [value, setValue, hydrated];
}
