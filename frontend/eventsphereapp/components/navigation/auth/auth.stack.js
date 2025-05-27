// App.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../auth/login';
import SignUpScreen from '../../auth/signup';
import AppNavigator from '../app/app.navigator';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="AppNavigator" component={AppNavigator} />

        </Stack.Navigator>
    );
}