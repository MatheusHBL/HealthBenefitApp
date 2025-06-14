import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import FormScreen from './src/screens/FormScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#2563eb" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2563eb',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Plano de Saúde' }}
          />
          <Stack.Screen 
            name="Form" 
            component={FormScreen}
            options={{ title: 'Verificar Benefício' }}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen}
            options={{ title: 'Resultado' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}