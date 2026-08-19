import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { setUser, User } from '../authSlice';

const RegisterScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState('');

  // one error slot per field — empty string means "no error"
  const [errors, setErrors] = useState({
    name: '', email: '', password: '', monthlyIncome: '', workHoursPerWeek: '',
  });

  // each function checks ONE field and returns an error message,
  // or an empty string if the value is valid
  const validateName = (value: string) => (!value.trim() ? 'Name is required' : '');
  const validateEmail = (value: string) => (!value.includes('@') || !value.includes('.') ? 'Enter a valid email' : '');
  const validatePassword = (value: string) => (value.length < 6 ? 'Minimum 6 characters' : '');
  const validateIncome = (value: string) => {
    const num = Number(value);
    return !num || num <= 0 ? 'Enter a valid amount' : '';
  };
  const validateHours = (value: string) => {
    const num = Number(value);
    return !num || num < 1 || num > 80 ? 'Between 1 and 80' : '';
  };

  const handleRegister = async () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      monthlyIncome: validateIncome(monthlyIncome),
      workHoursPerWeek: validateHours(workHoursPerWeek),
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((msg) => msg !== '');
    if (hasError) return;

    const newUser: User = {
      id: Date.now().toString(),
      name, email, password,
      monthlyIncome: Number(monthlyIncome),
      workHoursPerWeek: Number(workHoursPerWeek),
      currency: 'TND',
      totalXP: 0,
      level: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('@stouchi/user', JSON.stringify(newUser));
      dispatch(setUser(newUser));
      router.replace('/home');
    } catch (error) {
      setErrors((prev) => ({ ...prev, name: 'Something went wrong, try again' }));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Create your account</Text>

      <TextInput
        style={[styles.input, { borderColor: errors.name ? colors.expense : colors.border, color: colors.textPrimary }]}
        placeholder="Name" placeholderTextColor={colors.textSecondary}
        value={name} onChangeText={setName}
        onBlur={() => setErrors((prev) => ({ ...prev, name: validateName(name) }))}
      />
      {errors.name ? <Text style={[styles.errorText, { color: colors.expense }]}>{errors.name}</Text> : null}

      <TextInput
        style={[styles.input, { borderColor: errors.email ? colors.expense : colors.border, color: colors.textPrimary }]}
        placeholder="Email" placeholderTextColor={colors.textSecondary}
        value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address"
        onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
      />
      {errors.email ? <Text style={[styles.errorText, { color: colors.expense }]}>{errors.email}</Text> : null}

      <TextInput
        style={[styles.input, { borderColor: errors.password ? colors.expense : colors.border, color: colors.textPrimary }]}
        placeholder="Password" placeholderTextColor={colors.textSecondary}
        value={password} onChangeText={setPassword} secureTextEntry
        onBlur={() => setErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
      />
      {errors.password ? <Text style={[styles.errorText, { color: colors.expense }]}>{errors.password}</Text> : null}

      <TextInput
        style={[styles.input, { borderColor: errors.monthlyIncome ? colors.expense : colors.border, color: colors.textPrimary }]}
        placeholder="Monthly Income" placeholderTextColor={colors.textSecondary}
        value={monthlyIncome} onChangeText={setMonthlyIncome} keyboardType="numeric"
        onBlur={() => setErrors((prev) => ({ ...prev, monthlyIncome: validateIncome(monthlyIncome) }))}
      />
      {errors.monthlyIncome ? <Text style={[styles.errorText, { color: colors.expense }]}>{errors.monthlyIncome}</Text> : null}

      <TextInput
        style={[styles.input, { borderColor: errors.workHoursPerWeek ? colors.expense : colors.border, color: colors.textPrimary }]}
        placeholder="Work Hours Per Week" placeholderTextColor={colors.textSecondary}
        value={workHoursPerWeek} onChangeText={setWorkHoursPerWeek} keyboardType="numeric"
        onBlur={() => setErrors((prev) => ({ ...prev, workHoursPerWeek: validateHours(workHoursPerWeek) }))}
      />
      {errors.workHoursPerWeek ? <Text style={[styles.errorText, { color: colors.expense }]}>{errors.workHoursPerWeek}</Text> : null}

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')} style={styles.linkButton}>
        <Text style={[styles.linkText, { color: colors.textSecondary }]}>
          Already have an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 4 },
  errorText: { fontSize: 12, marginBottom: 8 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14 },
});

export default RegisterScreen;