import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../context/ThemeContext";
import { setUser, User } from "../authSlice";

const LoginScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (value: string) =>
    !value.includes("@") || !value.includes(".") ? "Enter a valid email" : "";
  const validatePassword = (value: string) =>
    !value ? "Password is required" : "";

  const handleLogin = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    try {
      const savedUserJson = await AsyncStorage.getItem("@stouchi/user");
      if (!savedUserJson) {
        setErrors((prev) => ({
          ...prev,
          email: "No account found, please register",
        }));
        return;
      }
      const savedUser: User = JSON.parse(savedUserJson);
      if (savedUser.email !== email || savedUser.password !== password) {
        setErrors((prev) => ({
          ...prev,
          password: "Incorrect email or password",
        }));
        return;
      }
      await AsyncStorage.setItem("@stouchi/isLoggedIn", "true");
      dispatch(setUser(savedUser));
      router.replace("/home");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        email: "Something went wrong, try again",
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Welcome back
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors.email ? colors.expense : colors.border,
              color: colors.textPrimary,
            },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          onBlur={() =>
            setErrors((prev) => ({ ...prev, email: validateEmail(email) }))
          }
        />
        {errors.email ? (
          <Text style={[styles.errorText, { color: colors.expense }]}>
            {errors.email}
          </Text>
        ) : null}

        <View
          style={[
            styles.passwordRow,
            { borderColor: errors.password ? colors.expense : colors.border },
          ]}
        >
          <TextInput
            style={[styles.passwordInput, { color: colors.textPrimary }]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(password),
              }))
            }
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
        {errors.password ? (
          <Text style={[styles.errorText, { color: colors.expense }]}>
            {errors.password}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <Text style={[styles.buttonText, { color: "#000000" }]}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/register")}
          style={styles.linkButton}
        >
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Don't have an account?{" "}
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Register
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, justifyContent: "center", flexGrow: 1 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 4 },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  errorText: { fontSize: 12, marginBottom: 8, marginLeft: 4 },
  button: { padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { fontWeight: "600" },
  linkButton: { marginTop: 16, alignItems: "center" },
  linkText: { fontSize: 14 },
});

export default LoginScreen;
