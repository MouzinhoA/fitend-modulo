import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/AuthContext';

import LoginScreen from './screens/Login';
import Profile from './screens/Profile';
import Challenge from './screens/Challenge';
import Checkin from './screens/Checkin';
import Settings from './screens/Settings';
import Invitation from './screens/Invitation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Challenge" component={Challenge} />
          <Stack.Screen name="Checkin" component={Checkin} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Invitation" component={Invitation} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
