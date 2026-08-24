import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { logout } from "../../auth/authSlice";
import { RootState } from "../../../store";

export default function HomeScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  // PLACEHOLDER — these numbers are hardcoded until the
  // transactions slice exists and we can calculate them for real
  const placeholderExpense = 96;
  const placeholderIncome = 2400;
  const placeholderBalance = placeholderIncome - placeholderExpense;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@stouchi/isLoggedIn");
      dispatch(logout());
      router.replace("/login");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  const xpProgress = user ? (user.totalXP / 500) * 100 : 0;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Stouchi
          </Text>
          <Ionicons name="search" size={22} color={colors.textPrimary} />
          
        </View>

        <View style={styles.xpRow}>
          <View style={[styles.levelBadge, { borderColor: colors.primary }]}>
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              L{user?.level ?? 1}
            </Text>
          </View>
          <View style={[styles.xpBarTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.xpBarFill,
                { width: `${xpProgress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {user?.totalXP ?? 0} / 500 XP
          </Text>
        </View>
        <View style={styles.monthRow}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          <Text style={[styles.monthText, { color: colors.textPrimary }]}>
            October 2025
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textPrimary}
          />
        </View>

        

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Expense
            </Text>
            <Text
              style={{ color: colors.expense, fontWeight: "700", fontSize: 16 }}
            >
              -{placeholderExpense}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              TND
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Income
            </Text>
            <Text
              style={{ color: colors.income, fontWeight: "700", fontSize: 16 }}
            >
              +{placeholderIncome}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              TND
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: colors.border }]}>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
              Balance
            </Text>
            <Text
              style={{ color: colors.income, fontWeight: "700", fontSize: 16 }}
            >
              +{placeholderBalance}
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: 11 }}>
              TND
            </Text>
          </View>
        </View>

        <Text style={[styles.greeting, { color: colors.textPrimary }]}>
          Good evening, {user?.name ?? "there"} 👋
        </Text>

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Recent Transactions (placeholder data)
        </Text>
        <Card
          icon="🧴"
          iconColorKey="savings"
          title="Shampoo"
          subtitle="Self Care"
          date="6 Oct"
          amountLabel="-15 TND"
          amountColorKey="expense"
        />
        <Card
          icon="🍕"
          iconColorKey="expense"
          title="Supermarket"
          subtitle="Food"
          badgeLabel="🏦 Savings"
          date="4 Oct"
          amountLabel="-45 TND"
          amountColorKey="expense"
        />

        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Top Categories (placeholder data)
        </Text>

        <Card
          icon="🍕"
          title="Food"
          progressPercent={60}
          progressState="normal"
          showPercentLabel
        />
        <Card
          icon="🧴"
          title="Self Care"
          progressPercent={63}
          progressState="normal"
          showPercentLabel
        />
        <Card
          icon="🎮"
          title="Entertainment"
          progressPercent={110}
          progressState="over"
          showPercentLabel
        />
        <TouchableOpacity
          style={[styles.testButton, { borderColor: colors.primary }]}
          onPress={() => router.push("/category")}
        >
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Test: Go to Categories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.expense }]}
          onPress={handleLogout}
        >
          <Text style={{ color: colors.expense, fontWeight: "600" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLogo: { width: 32, height: 32 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  xpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  levelBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  xpBarTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 3 },
  summaryRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  greeting: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  testButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  monthRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  monthText: { fontSize: 16, fontWeight: "600" },
});
