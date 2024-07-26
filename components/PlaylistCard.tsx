import type { CardProps } from 'tamagui';
import { Button, Card, Text, Image, XStack, View, YStack, Progress } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Play, Pause, Heart, Check } from 'lucide-react-native';
import { isLiked, likeTrack, unlikeTrack } from '~/utils/spotify';

interface PlaylistCardProps extends CardProps {
  title: string;
  author: string;
  image: string;
}

export default function MusicCard({
  title,
  image,
  author,
  ...props
}: PlaylistCardProps) {
  
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
        <XStack flex={1} justifyContent="center" alignItems="center">
          <YStack alignItems="center">
            <Text textAlign='center' fontSize={'$4'} fontWeight={'600'} color={'$gray12'}>
              {truncateTitle(title)}
            </Text>
            <Text fontWeight={'400'} color={'$gray11'}>
              {formatArtists(author)}
            </Text>
          </YStack>
        </XStack>
      </View>
    </View>
  );
}
