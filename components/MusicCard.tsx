import type { CardProps } from 'tamagui';
import { Button, Card, Text, Image, XStack, View, YStack, Progress } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Play, Pause, Plus, Check } from 'lucide-react-native';

interface MusicCardProps extends CardProps {
  title: string;
  artists: string;
  image: string;
  music: string;
  saveable?: boolean;
}

export default function MusicCard({
  title,
  artists,
  image,
  music,
  saveable = false,
  ...props
}: MusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [progress, setProgress] = useState(0);

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
    return title.length > 18 ? title.substring(0, 18) + "..." : title;
  };

  const formatArtists = (artists: string) => {
    const artistArray = artists.split(', ');
  
    let result = '';
    if (artistArray.length > 2) {
      result = `${artistArray[0]}, ${artistArray[1]}, ...`;
    } else {
      result = artists;
    }
  
    return result.length > 16 ? result.substring(0, 16) + "..." : result;
  };

  return (
    <View backgroundColor={'$color3'} borderRadius={'$2'}>
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
        <XStack flex={1} justifyContent="space-between" alignItems='center'>
          <Button circular backgroundColor={'rgba(0, 0, 0, 0)'} onPress={playSound} pressStyle={{borderWidth: '$-0.25', backgroundColor: '$color2'}}>
            {' '}
            {isPlaying ? <Pause color={'white'} /> : <Play color={'white'} />}{' '}
          </Button>
          <YStack alignItems='center'>
            <Text fontSize={'$4'} fontWeight={'600'} color={'$gray12'}>{truncateTitle(title)}</Text>
            <Text fontWeight={'400'} color={'$gray11'}>{formatArtists(artists)}</Text>
          </YStack>
          {saveable ? (
            <Button circular backgroundColor={'rgba(0, 0, 0, 0)'} pressStyle={{borderWidth: '$-0.25', backgroundColor: '$color2'}}>
              
              {isPlaying ? <Check color={'white'} /> : <Plus color={'white'} />}
            </Button>
          ): (
            <Button circular backgroundColor={'rgba(0, 0, 0, 0)'} pressStyle={{borderWidth: '$-0.25', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            </Button>
          )}
        </XStack>
        <Progress size={'$0.75'} value={progress}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
      </View>
    </View>
  );
}
