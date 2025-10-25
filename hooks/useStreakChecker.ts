import { useEffect } from "react";
import { useAppDispatch } from "../redux/store";
import { checkAndUpdateStreak } from "../redux/user/operations";

export function useStreakChecker() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAndUpdateStreak());

    const interval = setInterval(() => {
      dispatch(checkAndUpdateStreak());
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);
}
