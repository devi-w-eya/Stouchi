import { SafeAreaView, StyleSheet, ScrollView, View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Card } from "../../src/components/Card";
import { useTheme } from "../../src/context/ThemeContext";
import { RootState } from "../../src/store";
import { router } from "expo-router";

export default function AnalysisScreen() {
  const { colors } = useTheme();
  const transactions = useSelector((state: RootState) => state.transactions.items);
  const categories = useSelector((state: RootState) => state.categories.items);

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);

  const categoryBreakdown = categories
    .filter((c) => c.type === "EXPENSE")
    .map((c) => {
      const spent = transactions
        .filter((t) => t.categoryId === c.id && t.type === "EXPENSE")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const percentOfTotal = totalExpense > 0 ? (spent / totalExpense) * 100 : 0;
      const percentOfBudget = c.budgetAmount > 0 ? (spent / c.budgetAmount) * 100 : 0;
      return { ...c, spent, percentOfTotal, percentOfBudget };
    })
    .filter((c) => c.spent > 0)
    .sort((a, b) => b.spent - a.spent);

  const incomeBreakdown = categories
  .map((c) => {
    const received = transactions
      .filter((t) => t.categoryId === c.id && t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...c, received };
  })
  .filter((c) => c.received > 0)
  .sort((a, b) => b.received - a.received);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Analysis</Text>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Total Income</Text>
            <Text style={{ color: colors.income, fontWeight: "700", fontSize: 20 }}>+{totalIncome}</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Total Expense</Text>
            <Text style={{ color: colors.expense, fontWeight: "700", fontSize: 20 }}>-{totalExpense}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Category Breakdown</Text>
        {categoryBreakdown.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 20 }}>
            No expenses logged yet
          </Text>
        ) : (
          categoryBreakdown.map((c) => (
            <Card
              key={c.id}
              icon={c.icon}
              title={c.name}
              subtitle={`${c.percentOfTotal.toFixed(0)}% of total spend`}
              amountLabel={`${c.spent} TND`}
              amountColorKey="expense"
              badgeLabel={`${c.percentOfBudget.toFixed(0)}% of budget`}
              progressPercent={c.percentOfBudget}
              progressState={c.percentOfBudget > 100 ? "over" : c.percentOfBudget > 80 ? "warning" : "normal"}
              onPress={() => router.push(`/category-detail/${c.id}` as any)}
            />
          ))
        )}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Income Breakdown</Text>
        {incomeBreakdown.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 20 }}>
            No income logged yet
          </Text>
        ) : (
          incomeBreakdown.map((c) => (
            <Card
              key={c.id}
              icon={c.icon}
              title={c.name}
              amountLabel={`+${c.received} TND`}
              amountColorKey="income"
              onPress={() => router.push(`/category-detail/${c.id}` as any)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 50, paddingBottom: 40 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  summaryCard: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 12, alignItems: "center" },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginBottom: 8, marginTop: 8 },
});