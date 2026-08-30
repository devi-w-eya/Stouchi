import { useDispatch, useSelector } from "react-redux";
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
          dispatch(setUser({ ...user, totalXP: user.totalXP + badge.xpReward }));
        }
      }
    });
  };

  return { checkAndUnlockBadges };
}