import { Stack, useLocalSearchParams } from 'expo-router';

import { View, Text, XStack, ScrollView, useThemeName } from 'tamagui';
import { Button, YStack, useTheme, Avatar, ZStack } from 'tamagui';
import { getProfiles, getTopTracks } from '~/utils/spotify';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { User } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import MusicCard from '~/components/MusicCard';
import NavBar from '~/components/NavBar';
import NowPlaying from '~/components/NowPlaying';
import { UserInfo } from '~/components/UserInfo';

interface UserProfile {
  images?: { url: string }[];
  display_name?: string;
}

type Track = {
  name: string;
  artists: Array<{ name: string }>;
  album: Album;
  preview_url: string;
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
  const [topTracks, setTopTracks] = useState<Track[] | null>(null);
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

  let trackArtistArray: { name: string; artists: string[]; albumImage: string, music:string }[] = [];

  topTracks?.forEach(({ name, artists, album, preview_url }) => {
    trackArtistArray.push({
      name: name,
      artists: artists.map((artist) => artist.name),
      albumImage: album.images[0].url,
      music: preview_url
    });
  });

  const handlePress = () => {
    console.log(trackArtistArray);
  };

  useEffect(() => {
    const fetchData = async () => {
      const topTracks = await getTopTracks('short_term', 10);
      setTopTracks(topTracks);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  const theme = useTheme();

  const themeName = useThemeName();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerTransparent: true,
          headerBackVisible: false,
          headerTitle() {
            return userProfile ? (
                <UserInfo userProfile={userProfile} />
            ) : (
              <Text>Hello</Text>
            );
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
              <YStack justifyContent="space-between" alignContent='space-between'>
                <XStack alignSelf="center" padding={"$4"}>
                  <Text fontSize={'$9'} fontWeight={'600'} color={theme.gray12}>
                    Analyze your music
                  </Text>
                </XStack>
                
                <Button onPress={handlePress}>Log Playlists</Button>
              </YStack>
            </View>
          </LinearGradient>
        </YStack>
        <View pointerEvents="box-none" flex={1} zIndex={2} justifyContent="flex-end" alignItems="stretch">
        <NavBar />
        </View>
      </ZStack>
    </>
  );
}
