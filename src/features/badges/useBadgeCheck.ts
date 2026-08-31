import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../../store";
import { unlockBadge } from "./badgeSlice";
import { isBadgeUnlocked } from "./checkBadges";
import { setUser } from "../auth/authSlice";

export function useBadgeCheck() {
  const dispatch = useDispatch();
  const state = useSelector((s: RootState) => s);
  const badges = useSelector((s: RootState) => s.badges.all);
  const unlockedBadges = useSelector((s: RootState) => s.badges.unlocked);
  const user = useSelector((s: RootState) => s.auth.user);

  const checkAndUnlockBadges = () => {
    badges.forEach((badge) => {
      const alreadyUnlocked = unlockedBadges.some((u) => u.badgeId === badge.id);
      if (!alreadyUnlocked && isBadgeUnlocked(badge, state)) {
        dispatch(unlockBadge({
          id: Date.now().toString() + badge.id,
          userId: user?.id ?? "unknown",
          badgeId: badge.id,
          unlockedAt: new Date().toISOString(),
        }));

        if (user) {
          const updatedUser = { ...user, totalXP: user.totalXP + badge.xpReward };
          dispatch(setUser(updatedUser));
          AsyncStorage.setItem("@stouchi/user", JSON.stringify(updatedUser)).catch((error) => {
            console.log("Failed to persist XP update", error);
          });
        }
      }
    });
  };

  return { checkAndUnlockBadges };
}