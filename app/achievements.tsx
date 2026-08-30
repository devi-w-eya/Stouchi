import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { useTheme } from "../src/context/ThemeContext";
import { RootState } from "../src/store";
import { getBadgeProgress, isBadgeUnlocked } from "../src/features/badges/checkBadges";

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const state = useSelector((state: RootState) => state);
  const badges = useSelector((state: RootState) => state.badges.all);
  const unlockedBadges = useSelector((state: RootState) => state.badges.unlocked);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Achievements</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {badges.map((badge) => {
            const unlocked = isBadgeUnlocked(badge, state);
            const unlockedRecord = unlockedBadges.find((u) => u.badgeId === badge.id);
            const progress = getBadgeProgress(badge, state);
            const percent = Math.min((progress / badge.conditionThreshold) * 100, 100);

            return (
              <View
                key={badge.id}
                style={[
                  styles.badgeCard,
                  {
                    borderColor: unlocked ? colors.primary : colors.border,
                    opacity: unlocked ? 1 : 0.6,
                  },
                ]}
              >
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={[styles.badgeName, { color: colors.textPrimary }]}>{badge.name}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 11, textAlign: "center", marginTop: 2 }}>
                  {badge.description}
                </Text>

                {unlocked ? (
                  <Text style={{ color: colors.income, fontSize: 11, marginTop: 6, fontWeight: "600" }}>
                    ✅ Unlocked{unlockedRecord ? ` · ${new Date(unlockedRecord.unlockedAt).toLocaleDateString()}` : ""}
                  </Text>
                ) : (
                  <>
                    <View style={[styles.miniProgressTrack, { backgroundColor: colors.background }]}>
                      <View style={[styles.miniProgressFill, { width: `${percent}%`, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={{ color: colors.textSecondary, fontSize: 10, marginTop: 4 }}>
                      {progress}/{badge.conditionThreshold}
                    </Text>
                  </>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between" },
  badgeCard: { width: "47%", borderWidth: 1, borderRadius: 12, padding: 12, alignItems: "center", marginBottom: 4 },
  badgeIcon: { fontSize: 32 },
  badgeName: { fontWeight: "700", fontSize: 13, marginTop: 6, textAlign: "center" },
  miniProgressTrack: { width: "100%", height: 4, borderRadius: 2, marginTop: 6, overflow: "hidden" },
  miniProgressFill: { height: "100%", borderRadius: 2 },
});