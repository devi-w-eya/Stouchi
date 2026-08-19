import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import { setUser, User } from '../authSlice';

const SplashScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      let savedUser: User | null = null;
      try {
        const json = await AsyncStorage.getItem('@stouchi/user');
        if (json) savedUser = JSON.parse(json);
      } catch (error) {
        savedUser = null;
      }
      setTimeout(() => {
        if (savedUser) {
          dispatch(setUser(savedUser));
          router.replace('/home');
        } else {
          router.replace('/register');
        }
      }, 2000);
    };
    checkUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('../../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Stouchi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 220, height: 220, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700' },
});

export default SplashScreen;