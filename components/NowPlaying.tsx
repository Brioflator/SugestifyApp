import { useState, useEffect } from "react";
import { View, Text, Image, XStack, YStack } from "tamagui";
import {getCurrentSong} from "~/utils/spotify";

interface ExternalUrls {
    spotify: string;
  }
  
  interface Image {
    height: number;
    url: string;
    width: number;
  }
  
  interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }
  
  interface Album {
    album_type: string;
    artists: Artist[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
  }
  
  interface ExternalIds {
    isrc: string;
  }
  
  interface Track {
    album: Album;
    artists: Artist[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  }

export default function NowPlaying() {
    const [track, setTrack] = useState<Track | null>(null);
    useEffect(() => {
        const fetchData = async () => {
        const track = await getCurrentSong();
        setTrack(track);
        };
        fetchData();
        const intervalId = setInterval(fetchData, 1000); // checks every second

    // cleanup function
    return () => clearInterval(intervalId);
    }, []);



    return (
        <View backgroundColor={'$color2'} paddingRight={'$2'} borderRadius={'$3'}>
        {track ? (
            <XStack space={'$2'} alignItems="center">
                <Image
                    source={{ uri: track?.album.images[0].url }}
                    style={{ width: 48, height: 48 }}
                />
                <YStack alignContent="flex-start">
                <Text fontSize={'$4'} fontWeight={'500'} color={'$gray12'}> {track?.name.length > 20 ? `${track?.name.substring(0, 20)}...` : track?.name}</Text>
                <Text fontSize={'$4'} fontWeight={'300'} color={'$gray11'}>{track.artists.slice(0, 2).map((artist) => artist.name).join(', ') + (track.artists.length > 2 ? ', ...' : '')}</Text>
                </YStack>
            </XStack>
        ) : (
            <View/>
        )}
        </View>
    );
    }