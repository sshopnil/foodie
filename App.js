import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



import HomePage from './src/pages/HomePage';
import ProductDetails from './src/pages/productDetails';
import FavoritePage from './src/pages/FavoritePage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="HomeMain" component={HomePage} options={{ headerShown: false }} />
    <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details', headerShown:false}} />
  </Stack.Navigator>
);

const FavoritesScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="FavoritePage" component={FavoritePage} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Favorites') iconName = 'favorite';
        return <MaterialIcons name={iconName} size={size} color={color}/>;
      },
      tabBarActiveTintColor: '#FF5722',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }} />
  </Tab.Navigator>
);

const App = () => (
  <NavigationContainer>
    <Drawer.Navigator screenOptions={{ drawerActiveTintColor: 'black', drawerType:'slide' }} >
      <Drawer.Screen name="Foodie" component={TabNavigator} options={{
        title: 'Foodie',
        drawerLabel: 'Home',
        }}/>
    </Drawer.Navigator>
  </NavigationContainer>
);

export default App;
