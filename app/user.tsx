import { Stack, useLocalSearchParams } from 'expo-router';

import {
  View,
  Text,
  XStack,
  Avatar,
  Nav,
  Theme,
  useThemeName,
  addTheme,
  updateTheme,
  ZStack,
  Anchor,
} from 'tamagui';
import { Button, YStack, useTheme, Separator } from 'tamagui';
import { getProfile } from '~/utils/spotify';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { CircleUserRound, PiggyBank, Crown, LocateOff, ExternalLink } from 'lucide-react-native';
import NavBar from '~/components/NavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

interface ExternalUrls {
  spotify: string;
}

interface Followers {
  href: null;
  total: number;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface UserProfile {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
}

export default function UserPage() {
  const theme = useTheme();
  const { name } = useLocalSearchParams();
  const [localTheme, setLocalTheme] = useState<any>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfile();
      setUserProfile(profile);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('localTheme');
      setLocalTheme(storedTheme);
    };
  
    fetchTheme();
  }, []);

  const handlePress = async (localTheme: string) => {
    setLocalTheme(localTheme);
    AsyncStorage.setItem('localTheme', localTheme);
  };

  const setThemes = async (theme: string) => {
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (e) {
      // saving error
      console.log(e);
    }
  };


  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTintColor: 'gray',
          headerTitle() {
            return (
              <Text fontSize={'$6'} fontWeight={'600'} color={'$gray10'}>
                Profile
              </Text>
            );
          },
        }}
      />
      <ZStack theme={localTheme} flex={1} justifyContent="space-evenly" alignItems="center">
        <View zIndex={1} flex={1} justifyContent="center" alignItems="center">
          <LinearGradient
            fullscreen
            colors={['$gray1', '$color3']}
            start={[0, 1]}
            end={[0, 0]}
            locations={[0.5, 0.8]}>
            <View paddingTop={'$12'}>
              <YStack>
                <YStack alignItems="center">
                  <View>
                    {userProfile?.images && userProfile?.images.length > 0 ? (
                      <Avatar circular size="$11">
                        <Avatar.Image src={userProfile.images[1].url} />
                        <Avatar.Fallback backgroundColor="$color2" />
                      </Avatar>
                    ) : (
                      <CircleUserRound size={'140px'} color={'white'} strokeWidth={'0.75 px'} />
                    )}
                  </View>
                  <Separator marginVertical={3} />
                  <XStack alignItems="center">
                    <Anchor href={userProfile?.external_urls.spotify} fontSize={'$8'} fontWeight={'700'} color={'$color8'}>
                      {userProfile?.display_name}
                    </Anchor>
                  </XStack>
                  <Separator marginVertical={10} />
                  <XStack>
                    <YStack alignItems="center">
                      <Text color={theme.gray12}>Country</Text>
                      <Text padding={'$3'} fontSize={'$9'} fontWeight={'700'} color={'$color8'}>
                        {userProfile?.country ? (
                          userProfile.country
                        ) : (
                          <LocateOff color={'red'} size={'30px'} />
                        )}
                      </Text>
                    </YStack>
                    <Separator alignSelf="center" vertical marginHorizontal={30} height={'$4'} />
                    <YStack alignItems="center">
                      <View>
                        {userProfile?.product === 'premium' ? (
                          <Text color={theme.gray12}> Premium </Text>
                        ) : (
                          <Text color={theme.gray12}> Free </Text>
                        )}
                      </View>
                      <View padding={'$3'}>
                        {userProfile?.product === 'premium' ? (
                          <Crown size={'30px'} color={'yellow'} />
                        ) : (
                          <PiggyBank size={'30px'} color={'pink'} />
                        )}
                      </View>
                    </YStack>
                    <Separator alignSelf="center" vertical marginHorizontal={30} height={'$4'} />
                    <YStack alignItems="center">
                      <Text color={theme.gray12}>Followers</Text>
                      <Text padding={'$3'} fontSize={'$9'} fontWeight={'700'} color={'$color8'}>
                        {userProfile?.followers.total}
                      </Text>
                    </YStack>
                  </XStack>
                </YStack>
                <Separator marginVertical={15} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                  <Text alignSelf="center" color={theme.gray12} fontSize={'$9'} fontWeight={'700'}>
                    {' '}
                    Choose Theme
                  </Text>
                  <Separator marginVertical={15} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                <XStack justifyContent='center' space>
                  <YStack alignSelf="center" space>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$red10'}}
                      borderColor={'$red8'}
                      color={'$red8'}
                      backgroundColor={'$red1'}
                      onPress={() => {setThemes('red'), handlePress('red')}}
                      size="$5"
                      >
                      Red
                    </Button>
                    <Button
                      variant="outlined"
                      size="$5"
                      pressStyle={{borderColor: '$blue10'}}
                      borderColor={'$blue8'}
                      color={'$blue8'}
                      backgroundColor={'$blue1'}
                      onPress={() => {setThemes('blue'), handlePress('blue')}}>
                      Blue
                    </Button>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$green10'}}
                      borderColor={'$green8'}
                      color={'$green8'}
                      backgroundColor={'$green1'}
                      onPress={() => {setThemes('green'), handlePress('green')}}
                      size="$5">
                      Green
                    </Button>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$gray10'}}
                      borderColor={'$gray8'}
                      backgroundColor={'$gray1'}
                      color={'$gray4'}
                      onPress={() => {setThemes('dark'), handlePress('dark')}}
                      size="$5">
                      Dark
                    </Button>
                  </YStack>
                  <YStack alignSelf="center" space>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$orange10'}}
                      borderColor={'$orange8'}
                      color={'$orange8'}
                      backgroundColor={'$orange1'}
                      onPress={() => {setThemes('orange'), handlePress('orange')}}
                      size="$5">
                      Orange
                    </Button>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$yellow10'}}
                      borderColor={'$yellow8'}
                      color={'$yellow8'}
                      backgroundColor={'$yellow1'}
                      onPress={() => {setThemes('yellow'), handlePress('yellow')}}
                      size="$5">
                      Yellow
                    </Button>
                    <Button
                      variant="outlined"
                      pressStyle={{borderColor: '$pink10'}}
                      borderColor={'$pink8'}
                      color={'$pink8'}
                      backgroundColor={'$pink1'}
                      onPress={() => {setThemes('pink'), handlePress('pink')}}
                      size="$5">
                      Pink
                    </Button>
                    <Button
                      variant="outlined"
                      borderColor={'$purple8'}
                      pressStyle={{borderColor: '$purple10'}}
                      color={'$purple8'}
                      backgroundColor={'$purple1'}
                      onPress={() => {setThemes('purple'), handlePress('purple')}}
                      size="$5">
                      Purple
                    </Button>
                  </YStack>
                  
                </XStack>
              </YStack>
            </View>
          </LinearGradient>
        </View>
        <View
          pointerEvents="box-none"
          flex={1}
          zIndex={2}
          justifyContent="flex-end"
          alignItems="stretch">
          <NavBar />
        </View>
      </ZStack>
    </>
  );
}
