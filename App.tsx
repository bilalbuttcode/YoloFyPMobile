import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import DetectScreen from './src/screens/DetectScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ShowImageScreen from './src/screens/ShowImageScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    const checkLogin = async () => {
      const username = await AsyncStorage.getItem('username');
      const password = await AsyncStorage.getItem('password');
      if (username && password) {
        setInitialRoute('DetectScreen');
      }
    };
    checkLogin();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: 'Login', // (you had a typo: "Track Sense")
          headerStyle: { backgroundColor: '#3ABEF9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{
          title: 'SignUp', // (you had a typo: "Track Sense")
          headerStyle: { backgroundColor: '#3ABEF9' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} />
        <Stack.Screen name="DetectScreen" component={DetectScreen} options={{ title: 'Track Sense', headerShown: false }} />
        <Stack.Screen name="ShowImage" component={ShowImageScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
