// AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/pages/HomePage';
import ProductDetails from './src/pages/productDetails';

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ title: 'Product Details' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
