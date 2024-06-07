import { Stack, useLocalSearchParams } from 'expo-router';

import { View, Text, XStack, ScrollView, useThemeName, Input, TabsContentProps } from 'tamagui';
import { Button, YStack, useTheme, Avatar, ZStack, H5, Separator, SizableText, Tabs, } from 'tamagui';
import { getProfiles, getTopTracks } from '~/utils/spotify';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'tamagui/linear-gradient';
import { User } from 'lucide-react-native';
import { Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import MusicCard from '~/components/MusicCard';
import NavBar from '~/components/NavBar';
import { UserInfo } from '~/components/UserInfo';
import Endless from '~/components/Endless';

interface UserProfile {
    images?: { url: string }[];
    display_name?: string;
}

type Track = {
    name: string;
    artists: Array<{ name: string }>;
    album: Album;
    preview_url: string;
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

    const handlePress = () => {
    };

    useEffect(() => {
        const fetchData = async () => {
            //const topTracks = await getTopTracks('short_term', 10);
            //setTopTracks(topTracks);
        };
        fetchData();
        return () => {
            // cleanup function
        };
    }, []);

    const theme = useTheme();

    const themeName = useThemeName();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Home',
                    headerTransparent: true,
                    headerBackVisible: false,
                    headerTitle() {
                        return userProfile ? (
                            <UserInfo userProfile={userProfile} />
                        ) : (
                            <Text>Hello</Text>
                        );
                    }
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
                        <View paddingTop={'$12'} paddingHorizontal={'$4'}>
                            <YStack justifyContent="space-between" alignContent='space-between'>
                                <XStack alignSelf="center" padding={"$4"}>
                                    <Text fontSize={'$9'} fontWeight={'600'} color={theme.gray12}>
                                        Discover new music
                                    </Text>
                                </XStack>
                                <YStack>
                                    <XStack alignItems="center" space="$2">
                                        <Input flex={1} size={'$3'} placeholder={`Enter Keywords`} />
                                        <Button size={'$3'}>Go</Button>
                                    </XStack>
                                    <Separator marginVertical={5} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                                    <View height={'200px'} backgroundColor={'$color1'}>
                                        <ScrollView padding={'$2'} horizontal>
                                            <MusicCard
                                                saveable
                                                size="$4"
                                                width={150}
                                                height={150}
                                                title="Title"
                                                image="https://i.scdn.co/image/ab67616d0000b273a786d7c352f3da574f98fa2f"
                                                artists="Artist"
                                                music="https://p.scdn.co/mp3-preview/eec27c30a3936f8cb51f38fccedbc7250a3a259d?cid=cfe923b2d660439caf2b557b21f31221"
                                            />
                                            <MusicCard
                                                size="$4"
                                                width={150}
                                                height={150}
                                                title="Title"
                                                image="https://i.scdn.co/image/ab67616d0000b273a786d7c352f3da574f98fa2f"
                                                artists="Artist"
                                                music="https://p.scdn.co/mp3-preview/eec27c30a3936f8cb51f38fccedbc7250a3a259d?cid=cfe923b2d660439caf2b557b21f31221"
                                            />
                                            <MusicCard
                                                size="$4"
                                                width={150}
                                                height={150}
                                                title="Title"
                                                image="https://i.scdn.co/image/ab67616d0000b273a786d7c352f3da574f98fa2f"
                                                artists="Artist"
                                                music="https://p.scdn.co/mp3-preview/eec27c30a3936f8cb51f38fccedbc7250a3a259d?cid=cfe923b2d660439caf2b557b21f31221"
                                            />
                                        </ScrollView>
                                    </View>
                                </YStack>
                                <Separator marginVertical={10} alignSelf="auto" borderColor={'rgba(0, 0, 0, 0)'} />
                                <YStack>
                                    
                                    <Tabs
                                        defaultValue="tab1"
                                        orientation="horizontal"
                                        flexDirection="column"
                                        width={'100%'}
                                        height={200}
                                        borderRadius="$4"
                                        borderWidth="$0.25"
                                        overflow="hidden"
                                        borderColor="$borderColor"
                                    >
                                        <Tabs.List
                                            separator={<Separator vertical />}
                                            disablePassBorderRadius="bottom"
                                        >
                                            <Tabs.Tab flex={1} value="tab1">
                                                <SizableText fontFamily="$body">Profile</SizableText>
                                            </Tabs.Tab>
                                            <Tabs.Tab flex={1} value="tab2">
                                                <SizableText fontFamily="$body">Connections</SizableText>
                                            </Tabs.Tab>
                                        </Tabs.List>
                                        <Separator />
                                        <TabsContent value="tab1">
                                            <Endless/>
                                        </TabsContent>

                                        <TabsContent value="tab2">
                                            <H5>Connections</H5>
                                        </TabsContent>
                                    </Tabs>
                                </YStack>
                                <Button onPress={handlePress}>Log Playlists</Button>
                            </YStack>
                        </View>
                    </LinearGradient>
                </YStack>
                <View pointerEvents="box-none" flex={1} zIndex={2} justifyContent="flex-end" alignItems="stretch">
                    <NavBar />
                </View>
            </ZStack>
        </>
    );
}


const TabsContent = (props: TabsContentProps) => {
    return (
      <Tabs.Content
        backgroundColor="$background"
        key="tab3"
        padding="$2"
        alignItems="center"
        justifyContent="center"
        flex={1}
        borderColor="$background"
        borderRadius="$2"
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        borderWidth="$2"
        {...props}
      >
        {props.children}
      </Tabs.Content>
    )
}