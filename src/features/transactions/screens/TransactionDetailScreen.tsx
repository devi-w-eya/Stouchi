import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { editCategory } from "../../categories/categorySlice";
import { deleteTransaction } from "../transactionSlice";

export default function TransactionDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showConfirm, setShowConfirm] = useState(false);

  const transaction = useSelector((state: RootState) =>
    state.transactions.items.find((t) => t.id === id),
  );
  const category = useSelector((state: RootState) =>
    state.categories.items.find((c) => c.id === transaction?.categoryId),
  );

  if (!transaction) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.textPrimary }}>Transaction not found</Text>
      </SafeAreaView>
    );
  }

  const amountColor =
    transaction.type === "INCOME" ? colors.income : colors.expense;

  const handleDelete = () => {
    if (transaction.paidFrom === "SAVINGS" && category) {
      dispatch(
        editCategory({
          ...category,
          currentSaved: category.currentSaved + Math.abs(transaction.amount),
        }),
      );
    }
    dispatch(deleteTransaction(transaction.id));
    setShowConfirm(false);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Transaction Detail
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.categoryIcon}>{category?.icon ?? "💰"}</Text>
        <Text style={[styles.categoryName, { color: colors.textPrimary }]}>
          {category?.name ?? "Unknown"}
        </Text>
        <Text
          style={{
            color: amountColor,
            fontSize: 36,
            fontWeight: "700",
            marginTop: 8,
          }}
        >
          {transaction.amount > 0 ? "+" : ""}
          {transaction.amount} TND
        </Text>

        <View style={[styles.detailBox, { borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Date</Text>
            <Text style={{ color: colors.textPrimary }}>
              {new Date(transaction.date).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Category</Text>
            <Text style={{ color: colors.textPrimary }}>
              {category?.name ?? "Unknown"}
            </Text>
          </View>
          {transaction.paidFrom ? (
            <View style={styles.detailRow}>
              <Text style={{ color: colors.textSecondary }}>Paid from</Text>
              <Text style={{ color: colors.textPrimary }}>
                {transaction.paidFrom === "SAVINGS" ? "🏦 Savings" : "Budget"}
              </Text>
            </View>
          ) : null}
          {transaction.note ? (
            <View style={styles.detailRow}>
              <Text style={{ color: colors.textSecondary }}>Note</Text>
              <Text style={{ color: colors.textPrimary }}>
                {transaction.note}
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.deleteButton, { borderColor: colors.expense }]}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={{ color: colors.expense, fontWeight: "600" }}>
            🗑️ Delete
          </Text>
        </TouchableOpacity>
      </View>

      {showConfirm ? (
        <View style={styles.confirmOverlay}>
          <View
            style={[
              styles.confirmBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontWeight: "700",
                fontSize: 16,
                marginBottom: 8,
              }}
            >
              Delete this transaction?
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              This cannot be undone.
            </Text>
            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                onPress={() => setShowConfirm(false)}
                style={styles.confirmCancelButton}
              >
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={[
                  styles.confirmDeleteButton,
                  { backgroundColor: colors.expense },
                ]}
              >
                <Text style={{ color: "#000000", fontWeight: "600" }}>
                  Delete
                </Text>
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 20, alignItems: "center" },
  categoryIcon: { fontSize: 40 },
  categoryName: { fontSize: 18, fontWeight: "600", marginTop: 4 },
  detailBox: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 16,
    marginTop: 24,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  deleteButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
  },
  confirmOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBox: { width: "85%", borderWidth: 1, borderRadius: 12, padding: 20 },
  confirmButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 8,
  },
  confirmCancelButton: { padding: 10 },
  confirmDeleteButton: { padding: 10, borderRadius: 8, paddingHorizontal: 16 },
});
