import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { TamaguiProvider, Theme, ThemeName, useThemeName } from 'tamagui';

import config from '../tamagui.config';

import { LogBox } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

LogBox.ignoreLogs(['new NativeEventEmitter()']);

export default function Layout() {
  const [theme, setTheme] = useState<any>('dark');
  
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {

    AsyncStorage.getItem('theme').then(storedTheme => {
      if (storedTheme) setTheme(storedTheme);
    });

    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    async function fetchTheme() {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) setTheme(storedTheme);
    }

    fetchTheme();

    const intervalId = setInterval(fetchTheme, 1000); // checks every second

    // cleanup function
    return () => clearInterval(intervalId);
  }, []);

  if (!loaded) return null;


  return (
    <TamaguiProvider defaultTheme="dark" config={config}>
      <Theme name={theme ?? 'dark'}>
        <Stack />
      </Theme>
    </TamaguiProvider>
  );
}

