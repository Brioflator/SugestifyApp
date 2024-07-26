import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getHistory, getTrackRecommendations, getProfiles, getTopTracks } from '../utils/spotify';
import { View, Text, XStack, ScrollView, useThemeName, Input, TabsContentProps } from 'tamagui';
import {
  Button,
  YStack,
  useTheme,
  Avatar,
  ZStack,
  H5,
  Separator,
  SizableText,
  Tabs,
} from 'tamagui';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { User } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import MusicCard from '~/components/MusicCard';
import NavBar from '~/components/NavBar';
import { UserInfo } from '~/components/UserInfo';
import { color } from '@tamagui/themes';
import React from 'react';

interface UserProfile {
  images?: { url: string }[];
  display_name?: string;
}

type Track = {
  name: string;
  artists: Array<{ name: string }>;
  album: Album;
  preview_url: string;
  id: string;
};

type Album = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
};

export default function Details() {
  const { name } = useLocalSearchParams();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text: any) => {
    setInputValue(text);
  };

  const handleGoPress = async () => {
    try {
      // Replace 'your-api-endpoint' with the actual endpoint you wish to call
      //const response = await axios.post('your-api-endpoint', { data: inputValue });
      console.log(inputValue); // Handle the response as needed
    } catch (error) {
      console.error(error); // Handle the error as needed
    }
  };

  useEffect(() => {
    fetch('stunning-loyal-gull.ngrok-free.app')
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const profile = await getProfiles();
      setUserProfile(profile);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      //const topTracks = await getTopTracks('short_term', 10);
      //setTopTracks(topTracks);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  const theme = useTheme();

  const themeName = useThemeName();

  const [suggestions, setSuggestions] = useState<Track[] | null>(null);

  useEffect(() => {
    type History = {
      track: Track;
    };
    const fetchData = async () => {
      const history: History[] = await getHistory("5");
      const trackHistoryString = history?.map(({ track }) => track.id).join(',');
      const suggestions = await getTrackRecommendations(10, trackHistoryString);
      setSuggestions(suggestions);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);


  let trackArtistArray: {
    id: string;
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
  }[] = [];

  suggestions?.map((track) => {
    trackArtistArray.push({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      albumImage: track.album.images[0].url,
      music: track.preview_url,
    });
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle() {
            return userProfile ? <UserInfo userProfile={userProfile} /> : <Text>Hello</Text>;
          },
        }}
      />
      <ZStack flex={1} justifyContent="space-evenly" alignItems="center">
        <YStack zIndex={1} flex={1} justifyContent="space-evenly" alignItems="center">
          <LinearGradient
            fullscreen
            colors={['$gray1', '$color3']}
            start={[0, 1]}
            end={[0, 0]}
            locations={[0.5, 0.8]}>
            <View paddingTop={'$12'} paddingHorizontal={'$4'}>
              <YStack justifyContent="space-between" alignContent="space-between">
                <XStack alignSelf="center" padding={'$4'}>
                  <Text fontSize={'$9'} fontWeight={'600'} color={theme.gray12}>
                    Discover new music
                  </Text>
                </XStack>
                <YStack>
                  <XStack alignItems="center" space="$2">
                    <Input
                      onChangeText={handleInputChange}
                      value={inputValue}
                      flex={1}
                      size={'$3'}
                      placeholder={`Enter Keywords`}
                    />
                    <Button onPress={handleGoPress} size={'$3'}>
                      Go
                    </Button>
                  </XStack>
                  <Separator marginVertical={5} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />

                  {isLoading ? (
                    <Text>Loading...</Text>
                  ) : error ? (
                    <UnavailableService />
                  ) : apiData ? (
                    <View height={'200px'} backgroundColor={'$color1'}>
                      <ScrollView padding={'$2'} horizontal>
                        <Text>Succes</Text>
                      </ScrollView>
                    </View>
                  ) : (
                    <Text>Loading...</Text>
                  )}
                </YStack>
                <Separator marginVertical={10} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />

                <View>
                  <XStack alignSelf="flex-start" padding={'$1'} paddingLeft={'$3'}>
                    <Text fontSize={'$6'} fontWeight={'500'} color={theme.gray12}>
                      Today's suggestions
                    </Text>
                  </XStack>
                  <XStack alignSelf="center">
                    <ScrollView horizontal>
                      {trackArtistArray.map((track, index) => (
                        <View key={index} padding={'$2'}>
                          <MusicCard
                            saveable
                            key={index}
                            title={track.name}
                            music={track.music}
                            trackId={track.id}
                            artists={track.artists.join(', ')}
                            image={track.albumImage}
                            animation="quick"
                            size="$4"
                            width={200}
                            height={200}
                            scale={2}
                            //hoverStyle={{ scale: 0.5 }}
                            pressStyle={{ scale: 0.75 }}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  </XStack>
                </View>
              </YStack>
            </View>
          </LinearGradient>
        </YStack>
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

const TabsContent = (props: TabsContentProps) => {
  return (
    <Tabs.Content
      backgroundColor="$background"
      key="tab3"
      padding="$2"
      alignItems="center"
      justifyContent="center"
      flex={1}
      borderColor="$background"
      borderRadius="$2"
      borderTopLeftRadius={0}
      borderTopRightRadius={0}
      borderWidth="$2"
      {...props}>
      {props.children}
    </Tabs.Content>
  );
};

const UnavailableService = () => {
  return (
    <View height={'200px'} backgroundColor={'$color1'}>
      <View style={{ height: 200, alignItems: 'center', backgroundColor: '$color1' }}>
        <View
          style={{
            height: 100,
            width: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <YStack alignItems="center" margin={30}>
            <Image
              resizeMode="contain"
              source={require('../assets/CatLoader.png')}
              style={{ height: 75, width: 75 }}
            />
            <Text fontSize={'$6'} fontWeight={'600'} color={color.gray12Dark}>
              Service not available
            </Text>
          </YStack>
        </View>
      </View>
    </View>
  );
};
