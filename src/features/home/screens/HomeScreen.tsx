import { SafeAreaView, StyleSheet, View, Text, Switch, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { logout } from "../../auth/authSlice";

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@stouchi/user');
      dispatch(logout());
      router.replace('/login');
    } catch (error) {
      console.log('Logout failed', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.switchRow}>
        <Text style={{ color: colors.textPrimary }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <Card title="Food" subtitle="180/300 TND" />
      <Card title="Shampoo" subtitle="-15 TND" />

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.expense }]}
        onPress={handleLogout}
      >
        <Text style={{ color: colors.expense, fontWeight: '600' }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  logoutButton: {
    marginTop: 24, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: 'center',
  },
});