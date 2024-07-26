import React from 'react';
import { Button, Card, Text, Image, XStack, YStack, View } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Home, LucideWandSparkles, AudioLines } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function NavBar() {
  return (
      <XStack justifyContent="space-around" backgroundColor={"rgba(0.0, 0.0, 0.0, 0.0)"} padding={'$3'} alignItems="center" >
        <LinearGradient
          colors={['rgba(0.0, 0.0, 0.0, 0.0)', 'rgba(0.0, 0.0, 0.0, 1.0) ' ]}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <YStack alignItems="center">
        <Link href={{ pathname: '/home' }} asChild>
          <Home onPress={() => {}} color="white" />
        </Link>
          <Text color={'$gray12'} fontSize={'$2'}>Home</Text>
        </YStack>
        <YStack alignItems="center">
        <Link href={{ pathname: '/discover' }} asChild>
          <LucideWandSparkles onPress={() => {}} color="white" />
        </Link>
          <Text color={'$gray12'} fontSize={'$2'}>Discover</Text>
        </YStack>
        <YStack alignItems="center">
        <Link href={{ pathname: '/analysis' }} asChild>
          <AudioLines onPress={() => {}} color="white" />
        </Link>
          <Text color={'$gray12'} fontSize={'$2'}>Analysis</Text>
        </YStack>
        
      </XStack>
  );
}
