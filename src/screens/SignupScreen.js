import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../config';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const signup = async () => {
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    try {
      const response = await axios.post(`${BASE_URL}/mobilesignup`, {
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (response.data.status === 'success') {
        Alert.alert('Signup Successful', 'Please login');
        navigation.navigate('Login');
      } else {
        Alert.alert('Signup Failed', response.data.message || 'Try again');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Signup Failed', 'Try different username or email');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Create Account 📝</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.signupBtn} onPress={signup}>
          <Text style={styles.signupBtnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignupScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A7E6FF',
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
  signupBtn: {
    backgroundColor: '#3572EF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    color: '#3572EF',
    fontSize: 14,
    textAlign: 'center',
  },
});
