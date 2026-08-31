import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import * as Notifications from "expo-notifications";

export default function RecurringListScreen() {
  const { colors } = useTheme();
  const items = useSelector((state: RootState) => state.recurring.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const transactions = useSelector((state: RootState) => state.transactions.items);

  const today = new Date();

  const getStatus = (item: typeof items[0]) => {
    const dueDate = new Date(item.nextDueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const paidThisMonth = transactions.some((t) => {
      if (t.note !== item.name) return false;
      const txDate = new Date(t.date);
      return txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
    });

    if (paidThisMonth) return "paid";
    if (daysUntilDue < 0) return "overdue";
    if (daysUntilDue <= item.reminderDaysBefore) return "due-soon";
    return "upcoming";
  };

  const upcoming = items.filter((i) => getStatus(i) !== "paid");
  const paid = items.filter((i) => getStatus(i) === "paid");

  const renderItem = (item: typeof items[0]) => {
    const category = categories.find((c) => c.id === item.categoryId);
    const status = getStatus(item);
    const dueDate = new Date(item.nextDueDate);

    let badge: string | undefined;
    let progressState: "normal" | "warning" | "over" = "normal";
    if (status === "overdue") { badge = "⚠️ Overdue"; progressState = "over"; }
    else if (status === "due-soon") { badge = "🟠 Due soon"; progressState = "warning"; }
    else if (status === "paid") { badge = "✅ Paid"; }

    return (
      <Card
        key={item.id}
        icon={category?.icon ?? "🔄"}
        title={item.name}
        subtitle={`${item.frequency} · Due ${dueDate.toLocaleDateString()}`}
        badgeLabel={badge}
        amountLabel={`-${item.amount} TND`}
        amountColorKey="expense"
        progressState={progressState}
        onPress={() => router.push(`/recurring-detail/${item.id}` as any)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Recurring Expenses</Text>
        <TouchableOpacity onPress={() => router.push("/create-recurring" as any)}>
          <Text style={{ color: colors.primary, fontSize: 24 }}>+</Text>
        </TouchableOpacity>
        
 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
            No recurring expenses yet
          </Text>
        ) : (
          <>
            {upcoming.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming</Text>
                {upcoming.map(renderItem)}
              </>
            ) : null}
            {paid.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>This Month</Text>
                {paid.map(renderItem)}
              </>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 12, marginBottom: 8 },
});