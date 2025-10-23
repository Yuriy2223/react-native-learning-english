import { useEffect } from "react";
import {
  fetchAchievements,
  fetchUserStats,
} from "../redux/achievements/operations";
import {
  selectAchievements,
  selectUserStats,
} from "../redux/achievements/selectors";
import { useAppDispatch, useAppSelector } from "../redux/store";

export const useAchievements = () => {
  const dispatch = useAppDispatch();
  const achievements = useAppSelector(selectAchievements);
  const userStats = useAppSelector(selectUserStats);

  useEffect(() => {
    dispatch(fetchAchievements());
    dispatch(fetchUserStats());
  }, [dispatch]);

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);

  return {
    achievements,
    unlockedAchievements,
    lockedAchievements,
    userProgress: userStats,
  };
};
