import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const transactions = useSelector((state: RootState) => state.transactions.items);
  const categories = useSelector((state: RootState) => state.categories.items);

  const realExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const realIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const realBalance = realIncome - realExpense;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const categoriesWithSpend = categories
    .filter((c) => c.type === "EXPENSE")
    .map((c) => {
      const spent = transactions
        .filter((t) => t.categoryId === c.id && t.type === "EXPENSE")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const percent = c.budgetAmount > 0 ? (spent / c.budgetAmount) * 100 : 0;
      return { ...c, spent, percent };
    })
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3);

  const xpProgress = user ? (user.totalXP / 500) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image source={require("@/assets/images/logo.png")} style={styles.headerLogo} resizeMode="contain" />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Stouchi</Text>
          <Ionicons name="search" size={22} color={colors.textPrimary} />
        </View>

        <View style={styles.xpRow}>
          <View style={[styles.levelBadge, { borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>L{user?.level ?? 1}</Text>
          </View>
          <View style={[styles.xpBarTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.xpBarFill, { width: `${xpProgress}%`, backgroundColor: colors.primary }]} />
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{user?.totalXP ?? 0} / 500 XP</Text>
        </View>

        <View style={styles.monthRow}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={[styles.monthText, { color: colors.textPrimary }]}>October 2025</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Expense</Text>
            <Text style={{ color: colors.expense, fontWeight: "700", fontSize: 16 }}>-{realExpense}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>TND</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Income</Text>
            <Text style={{ color: colors.income, fontWeight: "700", fontSize: 16 }}>+{realIncome}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>TND</Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Balance</Text>
            <Text style={{ color: colors.income, fontWeight: "700", fontSize: 16 }}>+{realBalance}</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>TND</Text>
          </View>
        </View>

        <Text style={[styles.greeting, { color: colors.textPrimary }]}>
          Good evening, {user?.name ?? "there"} 👋
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent Transactions</Text>
        {recentTransactions.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No transactions yet</Text>
        ) : (
          recentTransactions.map((t) => {
            const cat = categories.find((c) => c.id === t.categoryId);
            return (
              <Card
                key={t.id}
                icon={cat?.icon ?? "💰"}
                title={cat?.name ?? "Unknown"}
                subtitle={t.note ?? ""}
                amountLabel={`${t.amount > 0 ? "+" : ""}${t.amount} TND`}
                amountColorKey={t.type === "INCOME" ? "income" : "expense"}
                onPress={() => router.push(`/transaction-detail/${t.id}` as any)}   
              />
            );
          })
        )}

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Top Categories</Text>
        {categoriesWithSpend.length === 0 ? (
          <Text style={{ color: colors.textSecondary }}>No categories yet</Text>
        ) : (
          categoriesWithSpend.map((c) => (
            <Card
              key={c.id}
              icon={c.icon}
              title={c.name}
              progressPercent={c.percent}
              progressState={c.percent > 100 ? "over" : c.percent > 80 ? "warning" : "normal"}
              showPercentLabel
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
  scrollContent: { padding: 16, paddingTop: 24 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  headerLogo: { width: 32, height: 32 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  xpRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 20 },
  levelBadge: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  xpBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 3 },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  summaryCard: { flex: 1, borderWidth: 1, borderRadius: 10, padding: 10, alignItems: "center" },
  greeting: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 12, marginBottom: 8 },
  monthRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12, marginBottom: 20 },
  monthText: { fontSize: 16, fontWeight: "600" },
});