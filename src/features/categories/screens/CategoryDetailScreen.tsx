import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { deleteTransaction } from "../../transactions/transactionSlice";
import { deleteCategory } from "../categorySlice";

type Tab = "EXPENSES" | "BUDGET" | "SAVINGS" | "WISHLIST";

export default function CategoryDetailScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>("EXPENSES");
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteChoice, setDeleteChoice] = useState<"keep" | "delete">("keep");

  const category = useSelector((state: RootState) =>
    state.categories.items.find((c) => c.id === id),
  );
  const transactions = useSelector(
    (state: RootState) => state.transactions.items,
  );
  const dispatch = useDispatch();
  const handleDelete = () => {
    if (!category) return;

    if (deleteChoice === "delete") {
      categoryTransactions.forEach((t) => dispatch(deleteTransaction(t.id)));
    }
    dispatch(deleteCategory(category.id));
    setShowDeleteConfirm(false);
    router.back();
  };

  if (!category) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={{ color: colors.textPrimary }}>Category not found</Text>
      </SafeAreaView>
    );
  }

  const categoryTransactions = transactions
    .filter((t) => t.categoryId === category.id && t.type === "EXPENSE")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const spent = categoryTransactions.reduce(
    (sum, t) => sum + Math.abs(t.amount),
    0,
  );
  const remaining = category.budgetAmount - spent;
  const percent =
    category.budgetAmount > 0 ? (spent / category.budgetAmount) * 100 : 0;

  const savingsPercent =
    category.savingsGoal > 0
      ? (category.currentSaved / category.savingsGoal) * 100
      : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {category.icon} {category.name}
        </Text>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Text style={{ color: colors.textPrimary, fontSize: 22 }}>⋮</Text>
        </TouchableOpacity>
      </View>
      {showMenu ? (
        <View
          style={[
            styles.menuDropdown,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              router.push(`/create-category?editId=${category.id}`);
            }}
            style={styles.menuItem}
          >
            <Text style={{ color: colors.textPrimary }}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              setShowDeleteConfirm(true);
            }}
            style={styles.menuItem}
          >
            <Text style={{ color: colors.expense }}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {showMenu ? (
        <View
          style={[
            styles.menuDropdown,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              router.push(`/create-category?editId=${category.id}`);
            }}
            style={styles.menuItem}
          >
            <Text style={{ color: colors.textPrimary }}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              setShowDeleteConfirm(true);
            }}
            style={styles.menuItem}
          >
            <Text style={{ color: colors.expense }}>🗑️ Delete</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.tabRow}>
        {(["EXPENSES", "BUDGET", "SAVINGS", "WISHLIST"] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tabButton,
              { borderColor: tab === t ? colors.primary : "transparent" },
            ]}
          >
            <Text
              style={{
                color: tab === t ? colors.primary : colors.textSecondary,
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {tab === "EXPENSES" ? (
          categoryTransactions.length === 0 ? (
            <Text
              style={{
                color: colors.textSecondary,
                textAlign: "center",
                marginTop: 40,
              }}
            >
              No expenses yet in this category
            </Text>
          ) : (
            categoryTransactions.map((t) => (
              <Card
                key={t.id}
                icon={category.icon}
                title={t.note || category.name}
                date={new Date(t.date).toLocaleDateString()}
                badgeLabel={t.paidFrom === "SAVINGS" ? "🏦 Savings" : undefined}
                amountLabel={`${t.amount} TND`}
                amountColorKey="expense"
              />
            ))
          )
        ) : null}

        {tab === "BUDGET" ? (
          <View>
            <View style={[styles.statBox, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Monthly Limit
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {category.budgetAmount} TND
              </Text>
            </View>
            <View style={[styles.statBox, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Spent
              </Text>
              <Text
                style={{
                  color: colors.expense,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {spent} TND
              </Text>
            </View>
            <View style={[styles.statBox, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Remaining
              </Text>
              <Text
                style={{
                  color: colors.income,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {remaining} TND
              </Text>
            </View>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(percent, 100)}%`,
                    backgroundColor:
                      percent > 100
                        ? colors.expense
                        : percent > 80
                          ? colors.warning
                          : colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        ) : null}

        {tab === "SAVINGS" ? (
          <View>
            <View style={[styles.statBox, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Goal
              </Text>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {category.savingsGoal} TND
              </Text>
            </View>
            <View style={[styles.statBox, { borderColor: colors.border }]}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                Saved so far
              </Text>
              <Text
                style={{
                  color: colors.savings,
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {category.currentSaved} TND
              </Text>
            </View>
            <View
              style={[
                styles.progressTrack,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(savingsPercent, 100)}%`,
                    backgroundColor: colors.savings,
                  },
                ]}
              />
            </View>
          </View>
        ) : null}

        {tab === "WISHLIST" ? (
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginTop: 40,
            }}
          >
            Wishlist — Coming soon
          </Text>
        ) : null}
      </ScrollView>
      {showDeleteConfirm ? (
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
              Delete "{category.name}"?
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              This category has {categoryTransactions.length} transaction(s).
            </Text>

            {categoryTransactions.length > 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => setDeleteChoice("keep")}
                  style={styles.radioRow}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {deleteChoice === "keep" ? "◉" : "○"} Keep transactions
                    (uncategorized)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeleteChoice("delete")}
                  style={styles.radioRow}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {deleteChoice === "delete" ? "◉" : "○"} Delete all
                    transactions too
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(false)}
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
      {showDeleteConfirm ? (
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
              Delete "{category.name}"?
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              This category has {categoryTransactions.length} transaction(s).
            </Text>

            {categoryTransactions.length > 0 ? (
              <>
                <TouchableOpacity
                  onPress={() => setDeleteChoice("keep")}
                  style={styles.radioRow}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {deleteChoice === "keep" ? "◉" : "○"} Keep transactions
                    (uncategorized)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDeleteChoice("delete")}
                  style={styles.radioRow}
                >
                  <Text style={{ color: colors.textPrimary }}>
                    {deleteChoice === "delete" ? "◉" : "○"} Delete all
                    transactions too
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(false)}
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
    paddingTop: 100,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  tabRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12 },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 2,
    alignItems: "center",
  },
  scrollContent: { padding: 16 },
  statBox: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 8 },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%" },
  menuDropdown: {
    position: "absolute",
    top: 60,
    right: 16,
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 10,
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 16 },
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
  radioRow: { paddingVertical: 6 },
  confirmButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  confirmCancelButton: { padding: 10 },
  confirmDeleteButton: { padding: 10, borderRadius: 8, paddingHorizontal: 16 },
});
