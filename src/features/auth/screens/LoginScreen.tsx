import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { setUser, User } from '../authSlice';

const LoginScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.includes('@')) return Alert.alert('Invalid email', 'Please enter a valid email.');
    if (!password) return Alert.alert('Missing password', 'Please enter your password.');

    try {
      const savedUserJson = await AsyncStorage.getItem('@stouchi/user');
      if (!savedUserJson) {
        return Alert.alert('No account found', 'Please register first.');
      }

      const savedUser: User = JSON.parse(savedUserJson);

      if (savedUser.email !== email || savedUser.password !== password) {
        return Alert.alert('Invalid credentials', 'Email or password is incorrect.');
      }

      dispatch(setUser(savedUser));
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>

      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
        placeholder="Password"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')} style={styles.linkButton}>
        <Text style={[styles.linkText, { color: colors.textSecondary }]}>
          Don't have an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '600', color: '#3A3A32' },
  linkButton: { marginTop: 16, alignItems: 'center' },
  linkText: { fontSize: 14 },
});

export default LoginScreen;