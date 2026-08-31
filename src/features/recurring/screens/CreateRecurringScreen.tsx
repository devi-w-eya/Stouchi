import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { addRecurring, RecurringExpense, Frequency } from "../recurringSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleRecurringReminder } from "../../../services/notifications";

export default function CreateRecurringScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const categories = useSelector((state: RootState) => state.categories.items);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryId ?? "",
  );
  const [frequency, setFrequency] = useState<Frequency>("MONTHLY");
  const [reminderDaysBefore, setReminderDaysBefore] = useState("3");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Enter a name");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (!selectedCategoryId) {
      setError("Pick a category");
      return;
    }
    setError("");

    const newRecurring: RecurringExpense = {
      id: Date.now().toString(),
      userId: user?.id ?? "unknown",
      categoryId: selectedCategoryId,
      name,
      amount: numAmount,
      frequency,
      customDays: null,
      nextDueDate: dueDate.toISOString(),
      lastPaidAt: null,
      reminderDaysBefore: Number(reminderDaysBefore) || 3,
      createdAt: new Date().toISOString(),
    };
    const notificationId = await scheduleRecurringReminder(
      newRecurring.id,
      "🔄 Recurring Expense Due Soon",
      `${name} — ${numAmount} TND is due soon`,
      dueDate,
      Number(reminderDaysBefore) || 3,
    );

    dispatch(addRecurring(newRecurring));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            New Recurring Expense
          </Text>

          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.textPrimary },
            ]}
            placeholder="Name (e.g. Rent)"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.textPrimary },
            ]}
            placeholder="Amount"
            placeholderTextColor={colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

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
          </View>
         

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Frequency
          </Text>
          <View style={styles.chipRow}>
            {(["DAILY", "WEEKLY", "MONTHLY"] as Frequency[]).map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFrequency(f)}
                style={[
                  styles.chip,
                  {
                    borderColor:
                      frequency === f ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 13 }}>
                  {f.charAt(0) + f.slice(1).toLowerCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Next Due Date
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={[styles.input, { borderColor: colors.border }]}
          >
            <Text style={{ color: colors.textPrimary }}>
              {dueDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker ? (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          ) : null}

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Remind me (days before)
          </Text>
          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.textPrimary },
            ]}
            placeholder="3"
            placeholderTextColor={colors.textSecondary}
            value={reminderDaysBefore}
            onChangeText={setReminderDaysBefore}
            keyboardType="numeric"
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

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={{ color: "#000000", fontWeight: "600" }}>Create</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingTop: 50, paddingBottom: 60 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontSize: 13, marginBottom: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  button: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
});
