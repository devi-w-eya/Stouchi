import { SafeAreaView, StyleSheet, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Card } from "../../../components/Card";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";

export default function WishlistListScreen() {
  const { colors } = useTheme();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const categories = useSelector((state: RootState) => state.categories.items);

  const hesitating = items.filter((i) => i.status === "HESITATING");
  const planned = items.filter((i) => i.status === "PLANNED");
  const bought = items.filter((i) => i.status === "BOUGHT");

  const renderItem = (item: typeof items[0]) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return (
      <Card
        key={item.id}
        icon={category?.icon ?? "🛍️"}
        title={item.name}
        subtitle={category?.name}
        amountLabel={`${item.price} TND`}
        amountColorKey="textPrimary"
        onPress={() => router.push(`/wishlist-detail/${item.id}` as any)}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wishlist</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {items.length === 0 ? (
          <Text style={{ color: colors.textSecondary, textAlign: "center", marginTop: 40 }}>
            Nothing on your wishlist yet
          </Text>
        ) : (
          <>
            {hesitating.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Hesitating 🤔</Text>
                {hesitating.map(renderItem)}
              </>
            ) : null}

            {planned.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Planned 📌</Text>
                {planned.map(renderItem)}
              </>
            ) : null}

            {bought.length > 0 ? (
              <>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bought ✅</Text>
                {bought.map(renderItem)}
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
  headerRow: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "700", marginTop: 12, marginBottom: 8 },
});