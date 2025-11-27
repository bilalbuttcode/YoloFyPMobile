import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    console.log('login')
    try {
      const response = await axios.post(`${BASE_URL}/mobilelogin`, {
        username,
        password,
      });

      if (response.data.status === 'success') {
        const user = response.data.user;
        await AsyncStorage.setItem('username', user.username);
        await AsyncStorage.setItem('email', user.email);
        await AsyncStorage.setItem('role', user.role);

        Alert.alert('Login Successful', `Welcome ${user.username}`);
        navigation.replace('DetectScreen');
      } else {
        Alert.alert('Login failed', response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Could not log in.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Welcome Back 👋</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A7E6FF', // Soft background
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#050C9C',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#3ABEF9',
    padding: 12,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#3572EF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    color: '#3572EF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
});
