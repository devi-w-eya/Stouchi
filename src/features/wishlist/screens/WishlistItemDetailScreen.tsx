import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { updateWishlistItem, deleteWishlistItem } from "../wishlistSlice";
import { addTransaction, Transaction } from "../../transactions/transactionSlice";

export default function WishlistItemDetailScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [showResistConfirm, setShowResistConfirm] = useState(false);

  const item = useSelector((state: RootState) =>
    state.wishlist.items.find((i) => i.id === id)
  );
  const category = useSelector((state: RootState) =>
    state.categories.items.find((c) => c.id === item?.categoryId)
  );

  if (!item) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textPrimary }}>Item not found</Text>
      </SafeAreaView>
    );
  }

  const handleBuyIt = () => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id ?? "unknown",
      categoryId: item.categoryId,
      type: "EXPENSE",
      paidFrom: "BUDGET",
      amount: -item.price,
      date: new Date().toISOString(),
      note: item.name,
      receiptImagePath: null,
      createdAt: new Date().toISOString(),
    };
    dispatch(addTransaction(newTransaction));
    dispatch(updateWishlistItem({ ...item, status: "BOUGHT" }));
    router.back();
  };

  const handleNotForMe = () => {
    dispatch(updateWishlistItem({ ...item, status: "RESISTED" }));
    setShowResistConfirm(false);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wishlist Item</Text>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.content}>
        <Text style={{ fontSize: 40 }}>{category?.icon ?? "🛍️"}</Text>
        <Text style={[styles.itemName, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={{ color: colors.savings, fontSize: 32, fontWeight: "700", marginTop: 8 }}>
          {item.price} TND
        </Text>

        <View style={[styles.detailBox, { borderColor: colors.border }]}>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Category</Text>
            <Text style={{ color: colors.textPrimary }}>{category?.name ?? "Unknown"}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={{ color: colors.textSecondary }}>Status</Text>
            <Text style={{ color: colors.textPrimary }}>
              {item.status === "HESITATING" ? "🤔 Hesitating" : item.status === "PLANNED" ? "📌 Planned" : item.status === "BOUGHT" ? "✅ Bought" : "✕ Resisted"}
            </Text>
          </View>
          {item.note ? (
            <View style={styles.detailRow}>
              <Text style={{ color: colors.textSecondary }}>Note</Text>
              <Text style={{ color: colors.textPrimary }}>{item.note}</Text>
            </View>
          ) : null}
        </View>

        {item.status === "PLANNED" || item.status === "HESITATING" ? (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.income }]}
              onPress={handleBuyIt}
            >
              <Text style={{ color: "#000000", fontWeight: "700" }}>🛒 Buy it</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { borderColor: colors.expense, borderWidth: 1 }]}
              onPress={() => setShowResistConfirm(true)}
            >
              <Text style={{ color: colors.expense, fontWeight: "700" }}>✕ Not for me</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {showResistConfirm ? (
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={{ color: colors.textPrimary, fontWeight: "700", fontSize: 16, marginBottom: 8 }}>
              Resist this purchase?
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 16 }}>
              Great discipline! 💪
            </Text>
            <View style={styles.confirmButtonRow}>
              <TouchableOpacity onPress={() => setShowResistConfirm(false)} style={styles.confirmCancelButton}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNotForMe} style={[styles.confirmDeleteButton, { backgroundColor: colors.primary }]}>
                <Text style={{ color: "#000000", fontWeight: "600" }}>Confirm</Text>
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
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  content: { padding: 20, alignItems: "center" },
  itemName: { fontSize: 18, fontWeight: "600", marginTop: 4 },
  detailBox: { width: "100%", borderWidth: 1, borderRadius: 10, padding: 16, marginTop: 24 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 24, width: "100%" },
  actionButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: "center" },
  confirmOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  confirmBox: { width: "85%", borderWidth: 1, borderRadius: 12, padding: 20 },
  confirmButtonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  confirmCancelButton: { padding: 10 },
  confirmDeleteButton: { padding: 10, borderRadius: 8, paddingHorizontal: 16 },
});