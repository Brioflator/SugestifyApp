import { Stack, useLocalSearchParams } from 'expo-router';

import { View, Text, XStack, ScrollView, useThemeName, Separator, } from 'tamagui';
import { Button, YStack, useTheme, Avatar, ZStack } from 'tamagui';
import { getHistory, getPlaylists, getProfiles, getTopTracks, refreshTokens } from '~/utils/spotify';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { User } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import MusicCard from '~/components/MusicCard';
import NavBar from '~/components/NavBar';
import NowPlaying from '~/components/NowPlaying';
import { UserInfo } from '~/components/UserInfo';
import PlaylistCard from '~/components/PlaylistCard';

interface UserProfile {
  images?: { url: string }[];
  display_name?: string;
}

type History = {
  track: Track;
};

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

type Playlist = {
  name: string;
  owner: {
    display_name: string;
  }
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
  const [history, setHistory] = useState<History[] | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

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

  refreshTokens();

  let trackArtistArray: {
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
    id: string;
  }[] = [];
  let trackHistory: {
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
    id: string;
  }[] = [];

  let playlistArray: {
    name: string;
    owner: string;
    image: string;
  }[] = [];


  useEffect(() => {
    const fetchData = async () => {
      const topTracks = await getTopTracks('short_term', 10);
      const playlists = await getPlaylists();
      setTopTracks(topTracks);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const history = await getHistory("10");
      setHistory(history);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const playlists = await getPlaylists();
      setPlaylists(playlists);
    };
    fetchData();
    return () => {
      // cleanup function
    };
  }, []);

  topTracks?.forEach(({ name, artists, album, preview_url, id }) => {
      trackArtistArray.push({
        id: id,
        name: name,
        artists: artists.map((artist) => artist.name),
        albumImage: album.images[0].url,
        music: preview_url,
      });
    });

  history?.forEach(({ track }) => {
    trackHistory.push({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((artist) => artist.name) || [],
      albumImage: track.album.images[0].url,
      music: track.preview_url,
    });
  });

  

  playlists?.forEach(({ name, owner, images }) => {
    playlistArray.push({
      name: name,
      owner: owner.display_name,
      image: images[0].url,
    });
  });

  const theme = useTheme();

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
          headerRight() {
            return <NowPlaying />;
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
            <ScrollView paddingHorizontal={'$4'}>
              <YStack justifyContent="space-between" alignContent="space-between">
                <XStack alignSelf="center" padding={'$4'}>
                  <Text fontSize={'$9'} fontWeight={'600'} color={theme.gray12}>
                    Explore your music
                  </Text>
                </XStack>
                <View>
                  <XStack alignSelf="flex-start" padding={'$1'} paddingLeft={'$3'}>
                    <Text fontSize={'$6'} fontWeight={'500'} color={theme.gray12}>
                      Recent top tracks
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
                <View>
                <XStack alignSelf="flex-start" padding={'$1'} paddingLeft={'$3'}>
                    <Text fontSize={'$6'} fontWeight={'500'} color={theme.gray12}>
                      Streaming history
                    </Text>
                  </XStack>
                  <XStack alignSelf="center">
                    <ScrollView horizontal>
                      {trackHistory.map((track, index) => (
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
                <View>
                  <XStack alignSelf="flex-start" padding={'$1'} paddingLeft={'$3'}>
                    <Text fontSize={'$6'} fontWeight={'500'} color={theme.gray12}>
                      Created playlists
                    </Text>
                  </XStack>
                  <XStack alignSelf="center">
                    <ScrollView horizontal>
                      {playlistArray.map((track, index) => (
                        <View key={index} padding={'$2'}>
                          <PlaylistCard
                            key={index}
                            title={track.name}
                            author={track.owner}
                            image={track.image}
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
                  <View height={'$11'}>
                  <Separator marginVertical={15} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                    </View>
                </View>
              </YStack>
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
