import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAppDispatch } from "../redux/store";
import { updateStudyTime } from "../redux/user/operations";

const MIN_SAVE_TIME = 30;
const AUTO_SAVE_INTERVAL = 60000;

export function useStudyTimeTracker() {
  const dispatch = useAppDispatch();
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const autoSaveIntervalRef = useRef<number | null>(null);

  const saveStudyTime = useCallback(() => {
    if (startTimeRef.current) {
      const sessionTime = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      accumulatedTimeRef.current += sessionTime;
      startTimeRef.current = Date.now();
    }

    if (accumulatedTimeRef.current >= MIN_SAVE_TIME) {
      dispatch(updateStudyTime(accumulatedTimeRef.current));
      accumulatedTimeRef.current = 0;
    }
  }, [dispatch]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        startTimeRef.current = Date.now();

        autoSaveIntervalRef.current = setInterval(
          saveStudyTime,
          AUTO_SAVE_INTERVAL
        ) as unknown as number;
      } else if (nextAppState.match(/inactive|background/)) {
        saveStudyTime();

        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
          autoSaveIntervalRef.current = null;
        }

        startTimeRef.current = null;
      }
    },
    [saveStudyTime]
  );

  useEffect(() => {
    startTimeRef.current = Date.now();

    autoSaveIntervalRef.current = setInterval(
      saveStudyTime,
      AUTO_SAVE_INTERVAL
    ) as unknown as number;

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      saveStudyTime();

      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }

      subscription.remove();
    };
  }, [handleAppStateChange, saveStudyTime]);
}
