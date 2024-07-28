import { Stack, useLocalSearchParams } from 'expo-router';
import { getHistory, getTrackRecommendations, getProfiles, searchTracks } from '../utils/spotify';
import { View, Text, XStack, ScrollView, useThemeName, Input } from 'tamagui';
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
import { fetchResources, processTracks, fetchSongRecommendations } from '~/utils/nlp';

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
  const [error, setError] = useState<Error | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [nlpSuge, setNlpSuge] = useState<TrackNLP[][] | null>(null);

  const handleInputChange = (text: any) => {
    setInputValue(text);
  };

  const handleGoPress = async () => {
    try {
      console.log('began');
      const data = await fetchSongRecommendations(inputValue);
      console.log('ended'); // Handle the response as needed
      const processedData = await processTracks(data);
      console.log('processedData:', processedData);
      setNlpSuge(processedData);
    } catch (error) {
      console.error(error); // Handle the error as needed
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('Unknown error'));
      }
    }
  };

  useEffect(() => {
    const fetchResourcesData = async () => {
      try {
        const data = await fetchResources();
        console.log(data);
        setApiData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('Unknown error'));
        }
        setIsLoading(false);
      }
    };

    fetchResourcesData();
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

  const theme = useTheme();

  const themeName = useThemeName();


  type TrackNLP = {
    id: string;
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
  };

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
          headerBackground() {
            return <LinearGradient
          fullscreen
          colors={['$color3', '$color3']}
          />
        },
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
            <ScrollView paddingHorizontal={'$0'}>
              <View padding={'$3'}>
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
                      <UnavailableService />
                    ) : error ? (
                      <UnavailableService />
                    ) : apiData ? (
                      <View height={'200px'} backgroundColor={'$color1'}>
                        <ScrollView horizontal>
                          {nlpSuge?.map((trackGroup, groupIndex) => (
                            trackGroup.map((track, trackIndex) => (
                              <View key={`${groupIndex}-${trackIndex}`} padding={'$2'}>
                                <MusicCard
                                  saveable
                                  key={track.id}
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
                            ))
                          ))}
                        </ScrollView>
                      </View>
                    ) : (
                      <UnavailableService />
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
                  <View height={'$11'}>
                  <Separator marginVertical={15} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                    </View>
                </YStack>
              </View>
            </ScrollView>
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
