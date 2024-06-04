import type { CardProps } from 'tamagui';
import { Button, Card, Text, Image, XStack, View } from 'tamagui';
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

  const playSound = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
      setIsPlaying(false);
    } else {
      if (sound) {
        await sound.playAsync();
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: music });
        setSound(newSound);
        await newSound.playAsync();
      }
      setIsPlaying(true);
    }
  };

  return (
    <View backgroundColor={'$color3'} borderRadius={'$2'}>
      <Card elevate size="$4" {...props}>
        <Card.Header padded>
          <Text fontSize={'$5'} fontWeight={'600'} color={'$gray12'}>
            {title}
          </Text>
          <Text fontWeight={'400'} color={'$gray12'}>
            {artists}
          </Text>
        </Card.Header>
        <Card.Background borderRadius={'$2'}>
          <Image
            resizeMode="cover"
            alignSelf="center"
            source={{
              uri: image,
            }}
            style={{ width: '100%', height: '100%' }}
          />
          <LinearGradient
            colors={['rgba(0.0, 0.0, 0.0, 0.9) ', 'rgba(0, 0, 0, 0)']}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
        </Card.Background>
      </Card>
      <View height={'$4'}>
        <XStack flex={1} justifyContent="space-between">
          <Button circular backgroundColor={'rgba(0, 0, 0, 0)'} onPress={playSound}>
            {' '}
            {isPlaying ? <Pause color={'white'} /> : <Play color={'white'} />}{' '}
          </Button>
          {saveable && (
            <Button circular backgroundColor={'rgba(0, 0, 0, 0)'}>
              {isPlaying ? <Check color={'white'} /> : <Plus color={'white'} />}
            </Button>
          )}
        </XStack>
      </View>
    </View>
  );
}
