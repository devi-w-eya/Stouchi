import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity, Switch, TextInput } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../src/context/ThemeContext";
import { logout, setUser } from "../../src/features/auth/authSlice";
import { RootState } from "../../src/store";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editIncome, setEditIncome] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editError, setEditError] = useState("");

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@stouchi/isLoggedIn");
      dispatch(logout());
      router.replace("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const openEditSheet = () => {
    setEditIncome(String(user?.monthlyIncome ?? ""));
    setEditHours(String(user?.workHoursPerWeek ?? ""));
    setEditError("");
    setShowEditSheet(true);
  };

  const handleEditProfile = async () => {
    const income = Number(editIncome);
    const hours = Number(editHours);
    if (!income || income <= 0) { setEditError("Enter a valid income"); return; }
    if (!hours || hours < 1 || hours > 80) { setEditError("Hours must be between 1 and 80"); return; }
    if (!user) return;

    const updatedUser = { ...user, monthlyIncome: income, workHoursPerWeek: hours };

    try {
      await AsyncStorage.setItem("@stouchi/user", JSON.stringify(updatedUser));
      dispatch(setUser(updatedUser));
      setEditError("");
      setShowEditSheet(false);
    } catch (error) {
      setEditError("Something went wrong, try again");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={{ color: "#000000", fontSize: 28, fontWeight: "700" }}>
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{user?.name ?? "Unknown"}</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13 }}>{user?.email ?? ""}</Text>

          <View style={[styles.levelBadge, { borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              Level {user?.level ?? 1} · {user?.totalXP ?? 0} XP
            </Text>
          </View>
        </View>

        <View style={[styles.section, { borderColor: colors.border }]}>
          <View style={styles.row}>
            <Text style={{ color: colors.textPrimary }}>Dark Mode</Text>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.linkRow, { borderColor: colors.border }]}
          onPress={() => router.push("/achievements" as any)}
        >
          <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>🏆 Achievements</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 18 }}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.section, { borderColor: colors.border }]} onPress={openEditSheet}>
          <View style={styles.row}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Monthly Income</Text>
            <Text style={{ color: colors.textPrimary }}>{user?.monthlyIncome ?? 0} {user?.currency ?? "TND"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Work Hours / Week</Text>
            <Text style={{ color: colors.textPrimary }}>{user?.workHoursPerWeek ?? 0}h</Text>
          </View>
          <Text style={{ color: colors.primary, fontSize: 11, marginTop: 4 }}>✏️ Tap to edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.expense }]}
          onPress={handleLogout}
        >
          <Text style={{ color: colors.expense, fontWeight: "600" }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {showEditSheet ? (
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 16, marginBottom: 16 }}>
              Edit Income & Hours
            </Text>
            <TextInput
              style={[styles.editInput, { borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Monthly Income" placeholderTextColor={colors.textSecondary}
              value={editIncome} onChangeText={setEditIncome} keyboardType="numeric"
            />
            <TextInput
              style={[styles.editInput, { borderColor: colors.border, color: colors.textPrimary }]}
              placeholder="Work Hours / Week" placeholderTextColor={colors.textSecondary}
              value={editHours} onChangeText={setEditHours} keyboardType="numeric"
            />
            {editError ? <Text style={{ color: colors.expense, fontSize: 12, marginTop: 4 }}>{editError}</Text> : null}
            <View style={styles.confirmButtonRow}>
              <TouchableOpacity onPress={() => setShowEditSheet(false)} style={styles.confirmCancelButton}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleEditProfile} style={[styles.confirmDeleteButton, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#000000", fontWeight: "600" }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 50 },
  header: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "700" },
  levelBadge: { borderWidth: 1, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, marginTop: 12 },
  section: { borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  linkRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 12 },
  logoutButton: { marginTop: 12, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: "center" },
  editInput: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  confirmOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  confirmBox: { width: "85%", borderWidth: 1, borderRadius: 12, padding: 20 },
  confirmButtonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  confirmCancelButton: { padding: 10 },
  confirmDeleteButton: { padding: 10, borderRadius: 8, paddingHorizontal: 16 },
});