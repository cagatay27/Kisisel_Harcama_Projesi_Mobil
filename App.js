import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native';

import LoginScreen from './src/screens/Login';
import RegisterScreen from './src/screens/Register';
import DashboardScreen from './src/screens/Dashboard';
import AddExpenseScreen from './src/screens/AddExpense';
import ExpenseListScreen from './src/screens/ExpenseList';
import AdviceScreen from './src/screens/Advice';
import CategoriesScreen from './src/screens/Categories';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconText;

          if (route.name === 'Dashboard') {
            iconText = '🏠';
          } else if (route.name === 'AddExpense') {
            iconText = '➕';
          } else if (route.name === 'ExpenseList') {
            iconText = '📋';
          } else if (route.name === 'Advice') {
            iconText = '💡';
          } else if (route.name === 'Categories') {
            iconText = '🏷️';
          }

          return <Text style={{fontSize: size, color}}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: 'Ana Sayfa'}}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{title: 'Harcama Ekle'}}
      />
      <Tab.Screen
        name="ExpenseList"
        component={ExpenseListScreen}
        options={{title: 'Liste'}}
      />
      <Tab.Screen
        name="Advice"
        component={AdviceScreen}
        options={{title: 'Tavsiye'}}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{title: 'Kategoriler'}}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
