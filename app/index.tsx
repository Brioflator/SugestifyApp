import { Stack, Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { spotifyCredentials, scopesArr } from '~/utils/spotify';
import { H1, YStack, Theme, View, styled, Button } from 'tamagui';
import { useTheme } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function LogIn() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: spotifyCredentials.clientId,
      scopes: scopesArr,
      // To follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: makeRedirectUri({
        path: 'home',
      }),
    },
    discovery
  );

  console.log(
    makeRedirectUri({
      scheme: 'sugestify',
      path: '/home',
    })
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      AsyncStorage.setItem('code', code);
      console.log(code);
    }
  }, [response]);

  const theme = useTheme();
  const backgroundColor = theme.background;

  return (
    <>
      <Stack.Screen options={{ title: '', headerTransparent: true }} />
      <View flex={1} justifyContent="center" alignItems="center" backgroundColor={backgroundColor}>
        <LinearGradient
          fullscreen
          borderRadius="$4"
          colors={['$color7', '$color3', '$color1']}
          start={[1, 1]}
          end={[0, 0]}
          locations={[0.1, 0.5, 0.8]}>
            <YStack flex={1} justifyContent="center" padding={'$6'}>
              <H1 fontSize={'$12'} fontWeight={'bold'} textAlign="center">Welcome to Sugestify</H1>
              <View height={150}></View>

              <Link href={{ pathname: '/home' }} asChild>
                <Button backgroundColor={'$color7'} size="$6" onPress={() => promptAsync()} > Log In with Spotify </Button>
              </Link>
            </YStack>
        </LinearGradient>
      </View>
    </>
  );
}
