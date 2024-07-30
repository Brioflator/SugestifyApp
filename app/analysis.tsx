import { Stack, useLocalSearchParams } from 'expo-router';

import { View, Text, XStack, ScrollView, useThemeName, Input, Separator } from 'tamagui';
import { Button, YStack, useTheme, Avatar, ZStack } from 'tamagui';
import { getProfiles, getTopTracks, searchTracks } from '~/utils/spotify';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { CloudUpload, Search } from 'lucide-react-native';
import { ActivityIndicator, Image, Pressable } from 'react-native';
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
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: Album;
  preview_url: string;
  external_urls: {
    spotify: string;
  };
};

type TrackInfo = {
  lyrics: string;
  song: string;
  artist: string;
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
  const [searchedLyrics, setSearchedLyrics] = useState('');
  const [inputValueArtist, setInputValueArtist] = useState('');
  const [inputValueSong, setInputValueSong] = useState('');
  const [searchedTracks, setSearchedTracks] = useState<Track[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChangeArtist = (text: any) => {
    setInputValueArtist(text);
  };

  const handleInputChangeSong = (text: any) => {
    setInputValueSong(text);
  };

  const getTrackInfoLyrist = async (artist: any, song?: any) => {
    let url: string;
    if (!song) {
      url = `https://lyrist.vercel.app/api/`;
    } else if (!artist) {
      url = `https://lyrist.vercel.app/api/${song}`;
    } else {
      url = `https://lyrist.vercel.app/api/${song}/${artist}`;
    }
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const lyrics = data.lyrics;
    const songName = data.title;
    const artistName = data.artist;
    const trackInfo: TrackInfo = { lyrics: lyrics, song: songName, artist: artistName };
    console.log(trackInfo);
    return trackInfo;
  };

  const handleGoPress = async () => {
    setLoading(true);
    try {
      const track = await getTrackInfoLyrist(inputValueArtist, inputValueSong);
      const query = `track:${track.song} artist:${track.artist}`;
      const searchResult = await searchTracks(query);
      setSearchedLyrics(track.lyrics);
      setSearchedTracks(searchResult);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  let trackArtistArray: {
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
    id: string;
    link: string;
  }[] = [];

  searchedTracks?.forEach(({ name, artists, album, preview_url, id, external_urls }) => {
    trackArtistArray.push({
      id: id,
      name: name,
      artists: artists.map((artist) => artist.name),
      albumImage: album.images[0].url,
      music: preview_url,
      link: external_urls.spotify,
    });
  });

  const theme = useTheme();

  const themeName = useThemeName();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Home',
          headerBackground() {
            return <LinearGradient fullscreen colors={['$color3', '$color3']} />;
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
            <View paddingHorizontal={'$4'}>
              <YStack justifyContent="space-between" alignContent="space-between">
                <XStack alignSelf="center" padding={'$4'}>
                  <Text fontSize={'$9'} fontWeight={'600'} color={'$color9'}>
                    Contibute to Sugestify
                  </Text>
                </XStack>
                <XStack alignItems="center" space="$2">
                  <Input
                    onChangeText={handleInputChangeSong}
                    value={inputValueSong}
                    flex={1}
                    size={'$3'}
                    placeholder={`Enter Song`}
                  />
                  <Input
                    onChangeText={handleInputChangeArtist}
                    value={inputValueArtist}
                    flex={1}
                    size={'$3'}
                    placeholder={`Enter Artist(optional)`}
                  />
                  <Button onPress={handleGoPress} size={'$3'}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Search width={'20'} color={'white'} />
                    )}
                  </Button>
                </XStack>
                <Separator marginVertical={5} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                <View alignSelf="center">
                  {trackArtistArray.length === 0 ? (
                    <UnavailableService />
                  ) : (
                    trackArtistArray.map((track, index) => (
                      <XStack
                        width="100%"
                        key={index}
                        padding={'$2'}
                        alignItems="center"
                        justifyContent="space-between">
                        <MusicCard
                          saveable
                          key={index}
                          title={track.name}
                          music={track.music}
                          trackId={track.id}
                          artists={track.artists.join(', ')}
                          image={track.albumImage}
                          link={track.link}
                          animation="quick"
                          size="$4"
                          width={200}
                          height={200}
                          scale={2}
                          //hoverStyle={{ scale: 0.5 }}
                          pressStyle={{ scale: 0.75 }}
                        />
                        <Button height={'$5'} icon={<CloudUpload />} onPress={() => {}} size={'$4'}>
                          Add song
                        </Button>
                      </XStack>
                    ))
                  )}
                </View>

                <View>
                  <YStack alignSelf="center">
                    <View>
                      {searchedLyrics === '' ? (
                        <View />
                      ) : (
                        <ScrollView
                          borderColor={'$color5'}
                          borderWidth={1}
                          maxHeight={250}
                          width="100%"
                          padding={'$4'}
                          backgroundColor="$color5"
                          borderRadius="$4">
                          <Text fontSize={'$2'} color={'$color12'}>
                            {searchedLyrics}
                          </Text>
                          <Separator
                            marginVertical={25}
                            alignSelf="auto"
                            borderColor={'rgba(0, 0, 0, 0)'}
                          />
                        </ScrollView>
                      )}
                    </View>
                  </YStack>
                </View>
              </YStack>
              <Separator marginVertical={75} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
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

const UnavailableService = () => {
  return (
    <View height={'200px'} backgroundColor={'$color1'} margin={'$4'}>
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
            <Text fontSize={'$6'} fontWeight={'600'} color={'$color.gray12Dark'}>
              No Track to display
            </Text>
          </YStack>
        </View>
      </View>
    </View>
  );
};
