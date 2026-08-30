import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { updateRecurring, deleteRecurring } from "../recurringSlice";
import { computeNextDueDate } from "../utils";
import { addTransaction, Transaction } from "../../transactions/transactionSlice";

export default function RecurringDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  const item = useSelector((state: RootState) => state.recurring.items.find((r) => r.id === id));
  const category = useSelector((state: RootState) => state.categories.items.find((c) => c.id === item?.categoryId));

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Recurring expense not found</Text>
      </SafeAreaView>
    );
  }

  const handleLogPayment = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id ?? "unknown",
      categoryId: item.categoryId,
      type: "EXPENSE",
      paidFrom: "BUDGET",
      amount: -item.amount,
      date: new Date().toISOString(),
      note: item.name,
      receiptImagePath: null,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTransaction(newTransaction));

    const nextDue = computeNextDueDate(item.nextDueDate, item.frequency, item.customDays);
    dispatch(updateRecurring({ ...item, nextDueDate: nextDue, lastPaidAt: new Date().toISOString() }));

    router.back();
  };

  const handleDelete = () => {
    dispatch(deleteRecurring(item.id));
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>{item.name}</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <Text style={{ fontSize: 40 }}>{category?.icon ?? "🔄"}</Text>
        <Text style={{ color: colors.expense, fontSize: 32, fontWeight: "700", marginTop: 8 }}>
          -{item.amount} TND
        </Text>

        <View style={[styles.detailBox, { borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Frequency</Text>
            <Text style={{ color: colors.textPrimary }}>{item.frequency}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Next Due</Text>
            <Text style={{ color: colors.textPrimary }}>{new Date(item.nextDueDate).toLocaleDateString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Category</Text>
            <Text style={{ color: colors.textPrimary }}>{category?.name ?? "Unknown"}</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.payButton, { backgroundColor: colors.income }]} onPress={handleLogPayment}>
          <Text style={{ color: "#000000", fontWeight: "700" }}>✅ Log Payment</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.deleteButton, { borderColor: colors.expense }]} onPress={handleDelete}>
          <Text style={{ color: colors.expense, fontWeight: "600" }}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 20, alignItems: "center" },
  detailBox: { width: "100%", borderWidth: 1, borderRadius: 10, padding: 16, marginTop: 24 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  payButton: { marginTop: 24, padding: 14, borderRadius: 8, alignItems: "center", width: "100%" },
  deleteButton: { marginTop: 12, padding: 12, borderRadius: 8, borderWidth: 1, alignItems: "center", width: "100%" },
});