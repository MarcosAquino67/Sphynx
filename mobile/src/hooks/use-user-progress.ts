import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STREAK_KEY = '@sphynx/streak';
const LAST_DAY_KEY = '@sphynx/last_day';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isYesterday(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return date.toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10);
}

async function readNumber(key: string, fallback: number) {
  const raw = await AsyncStorage.getItem(key);
  const value = raw ? parseInt(raw, 10) : NaN;
  return Number.isNaN(value) ? fallback : value;
}

export function useUserProgress() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const s = await readNumber(STREAK_KEY, 0);
      const last = await AsyncStorage.getItem(LAST_DAY_KEY);

      let finalStreak = s;
      const today = todayKey();

      if (last === today) {
        finalStreak = s;
      } else if (last && isYesterday(last)) {
        finalStreak = s;
      } else {
        finalStreak = 0;
      }

      if (!mounted) return;
      setStreak(finalStreak);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const registrarRacha = useCallback(async () => {
    const today = todayKey();
    const last = await AsyncStorage.getItem(LAST_DAY_KEY);

    if (last === today) return; // Ya contó hoy

    let newStreak = 1;
    if (last && isYesterday(last)) {
      const prevStreak = await readNumber(STREAK_KEY, 0);
      newStreak = prevStreak + 1;
    }

    await AsyncStorage.setItem(STREAK_KEY, String(newStreak));
    await AsyncStorage.setItem(LAST_DAY_KEY, today);
    setStreak(newStreak);
  }, []);

  return { streak, registrarRacha };
}