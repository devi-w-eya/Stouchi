import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";

export default function CategoriesListScreen() {
  const { colors } = useTheme();
  const categories = useSelector((state: RootState) => state.categories.items);
  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");
  const transactions = useSelector((state: RootState) => state.transactions.items);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Categories
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/create-category")}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
        >
          <Text style={{ color: "#000000", fontSize: 20, fontWeight: "700" }}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {expenseCategories.length === 0 ? (
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            No categories yet. Tap + to add one.
          </Text>
        ) : (
          expenseCategories.map((category) => {
            const spent = transactions
              .filter(
                (t) => t.categoryId === category.id && t.type === "EXPENSE",
              )
              .reduce((sum, t) => sum + Math.abs(t.amount), 0);
            const percent =
              category.budgetAmount > 0
                ? (spent / category.budgetAmount) * 100
                : 0;

            return (
              <Card
                key={category.id}
                icon={category.icon}
                title={category.name}
                subtitle={`${spent}/${category.budgetAmount} TND`}
                progressPercent={percent}
                progressState={
                  percent > 100 ? "over" : percent > 80 ? "warning" : "normal"
                }
                showPercentLabel
                 onPress={() => router.push(`/category-detail/${category.id}`)}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 90,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  scrollContent: { padding: 16 },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
