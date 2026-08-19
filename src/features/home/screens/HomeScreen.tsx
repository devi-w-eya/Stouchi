import { SafeAreaView, StyleSheet, View, Text, Switch } from "react-native";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.switchRow}>
        <Text style={{ color: colors.textPrimary }}>Dark Mode</Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>
      <Card title="Food" subtitle="180/300 TND" />
      <Card title="Shampoo" subtitle="-15 TND" />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
});