import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { updateRecurring, deleteRecurring } from "../recurringSlice";
import { computeNextDueDate } from "../utils";
import { addTransaction, Transaction } from "../../transactions/transactionSlice";
import * as Notifications from "expo-notifications";
import { useState } from "react";

export default function RecurringDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  const item = useSelector((state: RootState) => state.recurring.items.find((r) => r.id === id));
  const category = useSelector((state: RootState) => state.categories.items.find((c) => c.id === item?.categoryId));
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);

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
  const handleSnooze = async (hours: number) => {
  const snoozeDate = new Date();
  snoozeDate.setHours(snoozeDate.getHours() + hours);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🔄 Reminder: " + item.name,
      body: `${item.amount} TND is due soon`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: snoozeDate },
  });

  setShowSnoozeOptions(false);
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
        <TouchableOpacity
  style={[styles.deleteButton, { borderColor: colors.warning }]}
  onPress={() => setShowSnoozeOptions(true)}
>
  <Text style={{ color: colors.warning, fontWeight: "600" }}>⏰ Snooze Reminder</Text>
</TouchableOpacity>

        <TouchableOpacity style={[styles.deleteButton, { borderColor: colors.expense }]} onPress={handleDelete}>
          <Text style={{ color: colors.expense, fontWeight: "600" }}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
      {showSnoozeOptions ? (
  <View style={styles.confirmOverlay}>
    <View style={[styles.confirmBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 16, marginBottom: 16 }}>
        Snooze for how long?
      </Text>
      <TouchableOpacity onPress={() => handleSnooze(24)} style={styles.menuItem}>
        <Text style={{ color: colors.textPrimary }}>1 day</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleSnooze(72)} style={styles.menuItem}>
        <Text style={{ color: colors.textPrimary }}>3 days</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowSnoozeOptions(false)} style={styles.confirmCancelButton}>
        <Text style={{ color: colors.textSecondary }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
) : null}
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
  menuItem: { paddingVertical: 10 },
  confirmOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  confirmBox: { width: "85%", borderWidth: 1, borderRadius: 12, padding: 20 },
  confirmCancelButton: { padding: 10, alignItems: "center", marginTop: 8 },
});