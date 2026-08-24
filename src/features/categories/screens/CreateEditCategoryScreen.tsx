import { SafeAreaView, StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { useTheme } from "../../../context/ThemeContext";
import { RootState } from "../../../store";
import { addCategory, Category, CategoryType } from "../categorySlice";


const COLOR_PRESETS = ['expense', 'income', 'savings', 'warning', 'primary'] as const;

export default function CreateEditCategoryScreen() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const [type] = useState<CategoryType>('EXPENSE');
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState<typeof COLOR_PRESETS[number]>('primary');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  const [errors, setErrors] = useState({ name: '', icon: '', budgetAmount: '' });

  const validateName = (value: string) => (!value.trim() ? 'Name is required' : '');
  const validateIcon = (value: string) => (!value.trim() ? 'Pick an emoji icon' : '');
  const validateBudget = (value: string) => {
    if (type !== 'EXPENSE') return '';
    const num = Number(value);
    return value !== '' && (!num || num <= 0) ? 'Enter a valid amount, or leave empty' : '';
  };

  const handleSave = () => {
    const newErrors = {
      name: validateName(name),
      icon: validateIcon(icon),
      budgetAmount: validateBudget(budgetAmount),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((msg) => msg !== '')) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      userId: user?.id ?? 'unknown',
      name,
      icon,
      color: selectedColor,
      type,
      budgetAmount: Number(budgetAmount) || 0,
      savingsGoal: Number(savingsGoal) || 0,
      currentSaved: 0,
      monthlyContribution: 0,
      createdAt: new Date().toISOString(),
    };

    dispatch(addCategory(newCategory));
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
     >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            New Category
          </Text>

          

          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.name ? colors.expense : colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Name (e.g. Food)"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            onBlur={() =>
              setErrors((prev) => ({ ...prev, name: validateName(name) }))
            }
          />
          {errors.name ? (
            <Text style={[styles.errorText, { color: colors.expense }]}>
              {errors.name}
            </Text>
          ) : null}

          <TextInput
            style={[
              styles.input,
              {
                borderColor: errors.icon ? colors.expense : colors.border,
                color: colors.textPrimary,
              },
            ]}
            placeholder="Icon emoji (e.g. 🍕)"
            placeholderTextColor={colors.textSecondary}
            value={icon}
            onChangeText={setIcon}
            onBlur={() =>
              setErrors((prev) => ({ ...prev, icon: validateIcon(icon) }))
            }
          />
          {errors.icon ? (
            <Text style={[styles.errorText, { color: colors.expense }]}>
              {errors.icon}
            </Text>
          ) : null}

          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Color
          </Text>
          <View style={styles.colorRow}>
            {COLOR_PRESETS.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setSelectedColor(c)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: colors[c],
                    borderColor:
                      selectedColor === c ? colors.textPrimary : "transparent",
                  },
                ]}
              />
            ))}
          </View>

          {type === "EXPENSE" ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.budgetAmount
                      ? colors.expense
                      : colors.border,
                    color: colors.textPrimary,
                  },
                ]}
                placeholder="Monthly Budget (optional)"
                placeholderTextColor={colors.textSecondary}
                value={budgetAmount}
                onChangeText={setBudgetAmount}
                keyboardType="numeric"
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    budgetAmount: validateBudget(budgetAmount),
                  }))
                }
              />
              {errors.budgetAmount ? (
                <Text style={[styles.errorText, { color: colors.expense }]}>
                  {errors.budgetAmount}
                </Text>
              ) : null}

              <TextInput
                style={[
                  styles.input,
                  { borderColor: colors.border, color: colors.textPrimary },
                ]}
                placeholder="Savings Goal (optional)"
                placeholderTextColor={colors.textSecondary}
                value={savingsGoal}
                onChangeText={setSavingsGoal}
                keyboardType="numeric"
              />

              
            </>
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
  scrollContent: { padding: 24, paddingTop: 100, paddingBottom: 60 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeButton: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, alignItems: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 4 },
  errorText: { fontSize: 12, marginBottom: 8, marginLeft: 4 },
  label: { fontSize: 13, marginTop: 8, marginBottom: 8 },
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  colorSwatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 3 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
});