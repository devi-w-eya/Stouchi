import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { addWishlistItem, WishlistItem } from "../../wishlist/wishlistSlice";
import {
  addTransaction,
  Transaction,
  TransactionType,
  PaidFrom,
} from "../transactionSlice";
import { editCategory } from "../../categories/categorySlice";
import { useBadgeCheck } from "../../badges/useBadgeCheck";

type TxMode = "INCOME" | "EXPENSE" | "WISHLIST";

export default function AddTransactionScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const categories = useSelector((state: RootState) => state.categories.items);
  const [wishlistName, setWishlistName] = useState("");
  const [wishlistStatus, setWishlistStatus] = useState<
    "PLANNED" | "HESITATING"
  >("PLANNED");

  const [mode, setMode] = useState<TxMode>("EXPENSE");
  const [amount, setAmount] = useState("0");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [paidFrom, setPaidFrom] = useState<PaidFrom>("BUDGET");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const { checkAndUnlockBadges } = useBadgeCheck();

  const visibleCategories = categories;
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const handleNumpadPress = (key: string) => {
    if (key === "del") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (key === ".") {
      if (!amount.includes(".")) setAmount((prev) => prev + ".");
    } else {
      setAmount((prev) => (prev === "0" ? key : prev + key));
    }
  };

  const handleSave = () => {
    const numAmount = Number(amount) || 0;

    if (mode === "WISHLIST") {
      if (!wishlistName.trim()) {
        setError("Enter an item name");
        return;
      }
      if (numAmount <= 0) {
        setError("Enter a valid price");
        return;
      }
      if (!selectedCategoryId) {
        setError("Pick a category");
        return;
      }
      setError("");

      const newItem: WishlistItem = {
        id: Date.now().toString(),
        userId: user?.id ?? "unknown",
        categoryId: selectedCategoryId,
        name: wishlistName,
        price: numAmount,
        status: wishlistStatus,
        timerDurationMinutes: wishlistStatus === "HESITATING" ? 1440 : null,
        timerStartedAt:
          wishlistStatus === "HESITATING" ? new Date().toISOString() : null,
        note: note || null,
        createdAt: new Date().toISOString(),
      };

      dispatch(addWishlistItem(newItem));
      router.back();
      return;
    }

    if (!numAmount || numAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!selectedCategoryId) {
      setError("Pick a category");
      return;
    }
    if (mode === "EXPENSE" && paidFrom === "SAVINGS") {
      if (!selectedCategory || numAmount > selectedCategory.currentSaved) {
        setError("Not enough savings");
        return;
      }
    }
    setError("");

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      userId: user?.id ?? "unknown",
      categoryId: selectedCategoryId,
      type: mode === "INCOME" ? "INCOME" : "EXPENSE",
      paidFrom: mode === "INCOME" ? null : paidFrom,
      amount: mode === "INCOME" ? numAmount : -numAmount,
      date: new Date().toISOString(),
      note: note || null,
      receiptImagePath: null,
      createdAt: new Date().toISOString(),
    };

    dispatch(addTransaction(newTransaction));

    // if paid from savings, deduct from the category's currentSaved
    if (mode === "EXPENSE" && paidFrom === "SAVINGS" && selectedCategory) {
      dispatch(
        editCategory({
          ...selectedCategory,
          currentSaved: selectedCategory.currentSaved - numAmount,
        }),
      );
    }
    checkAndUnlockBadges();

    router.back();
  };

  const numAmount = Number(amount) || 0;
  const budgetRemaining = selectedCategory ? selectedCategory.budgetAmount : 0;
  const savingsRemaining = selectedCategory ? selectedCategory.currentSaved : 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ color: colors.textPrimary, fontSize: 22 }}>✕</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Add Transaction
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.modeRow}>
          {(["INCOME", "EXPENSE", "WISHLIST"] as TxMode[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => {
                setMode(m);
                setSelectedCategoryId(null);
                setError("");
              }}
              style={[
                styles.modeButton,
                {
                  backgroundColor:
                    mode === m
                      ? m === "INCOME"
                        ? colors.income
                        : m === "EXPENSE"
                          ? colors.expense
                          : colors.savings
                      : colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: mode === m ? "#000000" : colors.textSecondary,
                  fontWeight: "600",
                }}
              >
                {m === "INCOME"
                  ? "Income"
                  : m === "EXPENSE"
                    ? "Expense"
                    : "Wishlist"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {mode === "WISHLIST" ? (
          <>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Item Name
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                { borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="e.g. Dyson Airwrap"
              placeholderTextColor={colors.textSecondary}
              value={wishlistName}
              onChangeText={setWishlistName}
            />

            <View style={styles.amountRow}>
              <Text
                style={{
                  color: colors.savings,
                  fontSize: 40,
                  fontWeight: "700",
                }}
              >
                {amount}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 18,
                  marginLeft: 6,
                }}
              >
                TND
              </Text>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Category
            </Text>
            <View style={styles.chipRow}>
              {categories
                .filter((c) => c.type === "EXPENSE")
                .map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCategoryId(c.id)}
                    style={[
                      styles.chip,
                      {
                        borderColor:
                          selectedCategoryId === c.id
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                      {c.icon} {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              <TouchableOpacity
                onPress={() => router.push("/create-category" as any)}
                style={[
                  styles.chip,
                  { borderColor: colors.primary, borderStyle: "dashed" },
                ]}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>
                  + New
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Status
            </Text>
            <View style={styles.payFromRow}>
              <TouchableOpacity
                onPress={() => setWishlistStatus("PLANNED")}
                style={[
                  styles.payFromCard,
                  {
                    borderColor:
                      wishlistStatus === "PLANNED"
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
                  📌 Planned
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setWishlistStatus("HESITATING")}
                style={[
                  styles.payFromCard,
                  {
                    borderColor:
                      wishlistStatus === "HESITATING"
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontWeight: "600" }}>
                  🤔 Hesitating
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Note (optional)
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                { borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="Add a note..."
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={setNote}
            />

            {error ? (
              <Text
                style={{
                  color: colors.expense,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {error}
              </Text>
            ) : null}

            <View style={styles.numpad}>
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                "0",
                "del",
              ].map((key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleNumpadPress(key)}
                  style={[styles.numpadKey, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 20 }}>
                    {key === "del" ? "⌫" : key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={{ color: "#000000", fontWeight: "700" }}>
                Add to Wishlist
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.amountRow}>
              <Text
                style={{
                  color: mode === "INCOME" ? colors.income : colors.expense,
                  fontSize: 40,
                  fontWeight: "700",
                }}
              >
                {mode === "INCOME" ? "+" : "-"}
                {amount}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 18,
                  marginLeft: 6,
                }}
              >
                TND
              </Text>
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Category
            </Text>
            <View style={styles.chipRow}>
              {visibleCategories.length === 0 ? (
                <TouchableOpacity
                  onPress={() => router.push("/create-category")}
                  style={styles.createCategoryLink}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    No categories yet tap to create one
                  </Text>
                </TouchableOpacity>
              ) : (
                visibleCategories.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCategoryId(c.id)}
                    style={[
                      styles.chip,
                      {
                        borderColor:
                          selectedCategoryId === c.id
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                      {c.icon} {c.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
              <TouchableOpacity
                onPress={() => router.push("/create-category")}
                style={[
                  styles.chip,
                  { borderColor: colors.primary, borderStyle: "dashed" },
                ]}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>
                  + New
                </Text>
              </TouchableOpacity>
            </View>

            {mode === "EXPENSE" ? (
              <>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Pay from
                </Text>
                <View style={styles.payFromRow}>
                  <TouchableOpacity
                    onPress={() => setPaidFrom("BUDGET")}
                    style={[
                      styles.payFromCard,
                      {
                        borderColor:
                          paidFrom === "BUDGET"
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{ color: colors.textPrimary, fontWeight: "600" }}
                    >
                      Budget
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      Remaining: {budgetRemaining} TND
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setPaidFrom("SAVINGS")}
                    style={[
                      styles.payFromCard,
                      {
                        borderColor:
                          paidFrom === "SAVINGS"
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{ color: colors.textPrimary, fontWeight: "600" }}
                    >
                      Savings
                    </Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                      Remaining: {savingsRemaining} TND
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}

            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Note (optional)
            </Text>
            <TextInput
              style={[
                styles.noteInput,
                { borderColor: colors.border, color: colors.textPrimary },
              ]}
              placeholder="Add a note..."
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={setNote}
            />

            {error ? (
              <Text
                style={{
                  color: colors.expense,
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                {error}
              </Text>
            ) : null}

            <View style={styles.numpad}>
              {[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                ".",
                "0",
                "del",
              ].map((key) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => handleNumpadPress(key)}
                  style={[styles.numpadKey, { borderColor: colors.border }]}
                >
                  <Text style={{ color: colors.textPrimary, fontSize: 20 }}>
                    {key === "del" ? "⌫" : key}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleSave}
            >
              <Text style={{ color: "#000000", fontWeight: "700" }}>
                Save Transaction
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 60 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  modeButton: { flex: 1, padding: 10, borderRadius: 20, alignItems: "center" },
  amountRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: 8,
    textTransform: "uppercase",
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  payFromRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  payFromCard: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 12 },
  noteInput: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  numpad: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  numpadKey: {
    width: "30%",
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  createCategoryLink: { paddingVertical: 8 },
});
