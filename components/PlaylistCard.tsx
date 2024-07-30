import type { CardProps } from 'tamagui';
import { Button, Card, Text, Image, XStack, View, YStack, Progress } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
import { Play, Pause, SquareArrowOutUpRight, Share2 } from 'lucide-react-native';
import { isLiked, likeTrack, unlikeTrack } from '~/utils/spotify';
import { Alert, Share, Linking } from 'react-native';

interface PlaylistCardProps extends CardProps {
  title: string;
  author: string;
  image: string;
  link: string;
}

export default function MusicCard({
  title,
  image,
  author,
  link,
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

  const openLink = () => {
    Linking.openURL(link).catch(err => console.error('Error opening link:', err));
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          `Wanted to share with you this playlist:\n ${link}`
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View backgroundColor={'$color6'} borderRadius={'$2'}>
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
              onPress={onShare}
              backgroundColor={'rgba(0, 0, 0, 0)'}
              pressStyle={{ borderWidth: '$-0.25', backgroundColor: '$color2' }}>
              <Share2 color={'white'} />
            </Button>
          <YStack alignItems="center">
            <Text textAlign='center' fontSize={'$4'} fontWeight={'600'} color={'$gray12'}>
              {truncateTitle(title)}
            </Text>
            <Text fontWeight={'400'} color={'$gray11'}>
              {formatArtists(author)}
            </Text>
          </YStack>
          <Button
              circular
              onPress={openLink}
              backgroundColor={'rgba(0, 0, 0, 0)'}
              pressStyle={{ borderWidth: '$-0.25', backgroundColor: '$color2' }}>
              <SquareArrowOutUpRight color={'white'}/>
            </Button>
        </XStack>
      </View>
    </View>
  );
}
