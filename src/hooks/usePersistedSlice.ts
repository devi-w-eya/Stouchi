import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function usePersistedSlice<T>(
  storageKey: string,
  selector: (state: any) => T[],
  setAction: (items: T[]) => { type: string; payload: T[] }
) {
  const dispatch = useDispatch();
  const items = useSelector(selector);
  const hasLoaded = useRef(false);

  // LOAD once, when the app starts
  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (saved) {
          dispatch(setAction(JSON.parse(saved)));
        }
      } catch (error) {
        console.log(`Failed to load ${storageKey}`, error);
      } finally {
        hasLoaded.current = true;
      }
    };
    load();
  }, []);

  // SAVE every time items change — but only AFTER the initial load
  // finished, otherwise we'd immediately overwrite saved data with
  // an empty array before the load has a chance to run
  useEffect(() => {
    if (!hasLoaded.current) return;
    AsyncStorage.setItem(storageKey, JSON.stringify(items)).catch((error) => {
      console.log(`Failed to save ${storageKey}`, error);
    });
  }, [items]);
}