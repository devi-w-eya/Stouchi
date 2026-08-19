// src/features/auth/screens/RegisterScreen.tsx
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../context/ThemeContext";
import { setUser, User } from "../authSlice";

const RegisterScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState("");

  const handleRegister = async () => {
    if (!name.trim())
      return Alert.alert("Missing name", "Please enter your name.");
    if (!email.includes("@"))
      return Alert.alert("Invalid email", "Please enter a valid email.");
    if (password.length < 6)
      return Alert.alert("Weak password", "Minimum 6 characters.");

    const income = Number(monthlyIncome);
    if (!income || income <= 0)
      return Alert.alert("Invalid income", "Enter your monthly income.");

    const hours = Number(workHoursPerWeek);
    if (!hours || hours < 1 || hours > 80)
      return Alert.alert("Invalid hours", "Between 1 and 80.");

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
      monthlyIncome: income,
      workHoursPerWeek: hours,
      currency: "TND",
      totalXP: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      // save to AsyncStorage (persistence) AND Redux (in-memory, for
      // the rest of the app to read immediately without reloading)
      await AsyncStorage.setItem("@stouchi/user", JSON.stringify(newUser));
      dispatch(setUser(newUser));
      navigation.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Create your account
      </Text>

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Name"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Monthly Income"
        placeholderTextColor={colors.textSecondary}
        value={monthlyIncome}
        onChangeText={setMonthlyIncome}
        keyboardType="numeric"
      />
      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Work Hours Per Week"
        placeholderTextColor={colors.textSecondary}
        value={workHoursPerWeek}
        onChangeText={setWorkHoursPerWeek}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={styles.linkButton}
      >
        <Text style={[styles.linkText, { color: colors.textSecondary }]}>
          Already have an account?{" "}
          <Text style={{ color: colors.primary, fontWeight: "600" }}>
            Login
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "600", color: "#3A3A32" },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { fontSize: 14 },
});

export default RegisterScreen;
