import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../src/context/ThemeContext";
import { logout } from "../../src/features/auth/authSlice";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@stouchi/isLoggedIn");
      dispatch(logout());
      router.replace("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.textPrimary, fontSize: 18, marginBottom: 20 }}>
        Profile — Coming soon
      </Text>
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.expense }]}
        onPress={handleLogout}
      >
        <Text style={{ color: colors.expense, fontWeight: "600" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoutButton: { marginTop: 12, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: "center" },
});