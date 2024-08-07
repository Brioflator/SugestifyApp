import type { CardProps } from 'tamagui';
import { Button, Card, Text, Image, XStack, View, YStack, Progress } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Play, Pause, Heart, Check, X, SquareArrowOutUpRight } from 'lucide-react-native';
import { isLiked, likeTrack, unlikeTrack } from '~/utils/spotify';
import { Linking } from 'react-native';

interface MusicCardProps extends CardProps {
  trackId: string;
  title: string;
  artists: string;
  image: string;
  music: string;
  saveable?: boolean;
  link: string;
}

export default function MusicCard({
  trackId,
  title,
  artists,
  image,
  music,
  link,
  saveable = false,
  ...props
}: MusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkIfLiked = async () => {
      const likedStatus = await isLiked(trackId);
      setLiked(likedStatus);
    };

    checkIfLiked();
  }, [trackId]);

  const handlePress = async () => {
    if (!liked) {
      const response = await likeTrack(trackId);
    } else {
      const response = await unlikeTrack(trackId);
    }
    setLiked(!liked);
    // Optionally, handle unlike functionality here if needed
  };

  const playSound = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: music });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 99) {
            return prevProgress + 3;
          } else {
            if (sound) {
              sound.stopAsync();
              setIsPlaying(false);
            }
            return 0;
          }
        });
      }, 500);
    } else if (!isPlaying) {
      clearInterval(interval!);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, progress, sound]);

  const truncateTitle = (title: string) => {
    return title.length > 18 ? title.substring(0, 18) + '...' : title;
  };

  const formatArtists = (artists: string) => {
    const artistArray = artists.split(', ');

    let result = '';
    if (artistArray.length > 2) {
      result = `${artistArray[0]}, ${artistArray[1]}, ...`;
    } else {
      result = artists;
    }

    return result.length > 16 ? result.substring(0, 16) + '...' : result;
  };

  const openLink = () => {
    Linking.openURL(link).catch((err) => console.error('Error opening link:', err));
  };

  return (
    <View backgroundColor={'$color6'} borderRadius={'$2'}>
      <View height={'$4'}>
        <XStack justifyContent="space-between">
          <View paddingHorizontal={'$3'} justifyContent='center' >
              <Image
                resizeMode="contain"
                source={require('../assets/Spotify_Icon_RGB_White.png')}
                style={{ height: 30, width: 30 }}
                alignSelf='center'
              />
          </View>
          <Button
            circular
            onPress={openLink}
            backgroundColor={'rgba(0, 0, 0, 0)'}
            pressStyle={{ borderWidth: '$-0.25', backgroundColor: '$color2' }}>
            <SquareArrowOutUpRight color={'white'} />
          </Button>
        </XStack>
      </View>
      <Card elevate size="$4" {...props}>
        <Card.Background borderRadius={'$2'}>
          <Image
            resizeMode="cover"
            alignSelf="center"
            source={{
              uri: image,
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </Card.Background>
      </Card>
      <View height={'$5'}>
        <XStack flex={1} justifyContent="space-between" alignItems="center">
          <Button
            circular
            backgroundColor={'rgba(0, 0, 0, 0)'}
            onPress={music ? playSound : undefined}
            pressStyle={{ borderWidth: '$-0.25', backgroundColor: '$color2' }}>
            {''}
            {music ? (
              isPlaying ? (
                <Pause color={'white'} />
              ) : (
                <Play color={'white'} />
              )
            ) : (
              <X color={'white'} />
            )}
          </Button>
          <YStack alignItems="center">
            <Text fontSize={'$4'} fontWeight={'600'} color={'$gray12'}>
              {truncateTitle(title)}
            </Text>
            <Text fontWeight={'400'} color={'$gray11'}>
              {formatArtists(artists)}
            </Text>
          </YStack>
          {saveable ? (
            <Button
              circular
              onPress={handlePress}
              backgroundColor={'rgba(0, 0, 0, 0)'}
              pressStyle={{ borderWidth: '$-0.25', backgroundColor: '$color2' }}>
              {liked ? <Heart fill={'lime'} /> : <Heart color={'white'} />}
            </Button>
          ) : (
            <Button
              circular
              backgroundColor={'rgba(0, 0, 0, 0)'}
              pressStyle={{ borderWidth: '$-0.25', backgroundColor: 'rgba(0, 0, 0, 0)' }}></Button>
          )}
        </XStack>
        <Progress size={'$0.75'} value={progress}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
      </View>
    </View>
  );
}
