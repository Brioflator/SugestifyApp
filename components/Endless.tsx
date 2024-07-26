import { X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { View, Button, Text, YStack, XStack, ScrollView } from 'tamagui';
import { getHistory, getTrackRecommendations, getProfiles, getTopTracks } from '../utils/spotify';
import MusicCard from './MusicCard';

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

let trackHistory: {
  id: string;
}[] = [];


export default Endless;
