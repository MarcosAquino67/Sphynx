import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const HEARTS_KEY = '@sphynx/hearts';
const STREAK_KEY = '@sphynx/streak';
const LAST_DAY_KEY = '@sphynx/last_day';
const DEFAULT_HEARTS = 5;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function readNumber(key: string, fallback: number) {
  const raw = await AsyncStorage.getItem(key);
  const value = raw ? parseInt(raw, 10) : NaN;
  return Number.isNaN(value) ? fallback : value;
}

export function useUserProgress() {
  const [hearts, setHearts] = useState(DEFAULT_HEARTS);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const h = await readNumber(HEARTS_KEY, DEFAULT_HEARTS);
      const s = await readNumber(STREAK_KEY, 1);
      const last = await AsyncStorage.getItem(LAST_DAY_KEY);
      if (!mounted) return;
      setHearts(h);
      setStreak(last === todayKey() ? s : 1);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const perderCorazon = useCallback(async () => {
    setHearts((prev) => {
      const next = Math.max(0, prev - 1);
      AsyncStorage.setItem(HEARTS_KEY, String(next));
      return next;
    });
  }, []);

  const ganarCorazon = useCallback(async () => {
    setHearts((prev) => {
      const next = Math.min(DEFAULT_HEARTS, prev + 1);
      AsyncStorage.setItem(HEARTS_KEY, String(next));
      return next;
    });
  }, []);

  const registrarRacha = useCallback(async () => {
    setStreak((prev) => {
      const next = todayKey();
      AsyncStorage.setItem(STREAK_KEY, String(prev + 1));
      AsyncStorage.setItem(LAST_DAY_KEY, next);
      return prev + 1;
    });
  }, []);

  return { hearts, streak, perderCorazon, ganarCorazon, registrarRacha };
}