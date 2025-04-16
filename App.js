import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';


import HomePage from './src/pages/HomePage';
import ProductDetails from './src/pages/productDetails';
import FavoritePage from './src/pages/FavoritePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = ({ refreshKey }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        options={{ headerShown: false }}
      >
        {() => <HomePage refreshKey={refreshKey}/>}
      </Stack.Screen>
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details', headerShown: false }} />
    </Stack.Navigator>
  );
};

const FavoritesScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="FavoritePage" component={FavoritePage} />
  </Stack.Navigator>
);

const TabNavigator = () => {
  const [homeKey, setHomeKey] = useState(0);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favorites') iconName = 'favorite';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF5722',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" options={{ headerShown: false }} listeners={{
        tabPress: () => {
          // Prevent default action
          // console.log("pressed");
          setHomeKey(prev => prev + 1);
          // e.preventDefault();
        },
      }}>
          {() => <HomeStack refreshKey={homeKey} />}
      </Tab.Screen>
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const App = () => (
  <NavigationContainer>
    <Drawer.Navigator screenOptions={{ drawerActiveTintColor: 'black', drawerType: 'slide', swipeEdgeWidth: 80 }} >
      <Drawer.Screen name="tab" component={TabNavigator} options={{
        title: 'Foodie',
        drawerLabel: 'Home',
        headerShown: false
      }} />
    </Drawer.Navigator>
  </NavigationContainer>
);

export default App;
