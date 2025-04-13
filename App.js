import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ShiftProvider } from './src/context/ShiftContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import EmployeesScreen from './src/screens/EmployeesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddShiftScreen from './src/screens/AddShiftScreen';
import EditShiftScreen from './src/screens/EditShiftScreen';
import AddEmployeeScreen from './src/screens/AddEmployeeScreen';
import EditEmployeeScreen from './src/screens/EditEmployeeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Employees" component={EmployeesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ShiftProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={HomeTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen name="AddShift" component={AddShiftScreen} options={{ title: 'Add Shift' }} />
          <Stack.Screen name="EditShift" component={EditShiftScreen} options={{ title: 'Edit Shift' }} />
          <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} options={{ title: 'Add Employee' }} />
          <Stack.Screen name="EditEmployee" component={EditEmployeeScreen} options={{ title: 'Edit Employee' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ShiftProvider>
  );
}