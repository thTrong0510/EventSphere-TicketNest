import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { OPENSANS_REGULAR } from "./utils/const";
import { NavigationContainer } from "@react-navigation/native";
import AuthStack from './components/navigation/auth/auth.stack';
import { UserProvider } from './components/context/user.context';


SplashScreen.preventAutoHideAsync();


export default function App() {

	const [loaded, error] = useFonts({
		[OPENSANS_REGULAR]: require('./assets/fonts/Open_Sans/OpenSans-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<UserProvider>
			<NavigationContainer>
				<AuthStack />
			</NavigationContainer>
		</UserProvider>
	);
}