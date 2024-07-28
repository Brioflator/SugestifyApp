import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';
import SpotifyWebAPI from 'spotify-web-api-node';
import { makeRedirectUri } from 'expo-auth-session';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export const spotifyCredentials = {
  clientId: '757d66235c3242659d28f727bf3a3a6d',
  clientSecret: 'e5604468d39744ec86cd104a93849e5c',
  redirectUri: makeRedirectUri({
    scheme: 'Sugestify://',
    path: '/home',
  }),
};

export const scopesArr = [
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-library-modify',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-read-recently-played',
  'user-top-read',
];

const getTokens = async () => {
  try {
    const credsB64 = btoa(`${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`);
    const accessCode = await AsyncStorage.getItem('code');
    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&code=${accessCode}&redirect_uri=${spotifyCredentials.redirectUri}`,
    });
    const responseJson = await response.json();
    // destructure the response and rename the properties to be in camelCase to satisfy my linter ;)
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = responseJson;

    const expirationTime = new Date().getTime() + expiresIn * 1000;
    const expirationTimeStr = expirationTime.toString();

    AsyncStorage.setItem('accessToken', accessToken);
    AsyncStorage.setItem('refreshToken', refreshToken);
    AsyncStorage.setItem('expirationTime', expirationTimeStr);
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('expirationTime', expirationTimeStr);
  } catch (err) {
    console.error(err);
  }
};

export const refreshTokens = async () => {
  try {
    const credsB64 = btoa(`${spotifyCredentials.clientId}:${spotifyCredentials.clientSecret}`);
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credsB64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const responseJson = await response.json();
    if (responseJson.error) {
      await getTokens();
    } else {
      const {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        expires_in: expiresIn,
      } = responseJson;

      const expirationTime = new Date().getTime() + expiresIn * 1000;
      const expirationTimeStr = expirationTime.toString();
      await AsyncStorage.setItem('accessToken', newAccessToken);
      if (newRefreshToken) {
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
      }
      await AsyncStorage.setItem('expirationTime', expirationTimeStr);
    }
  } catch (err) {
    console.error(err);
  }
};

export const getProfile = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    console.log("accesssssed token", accessToken);
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error my friend");
    }
  };

  export const getProfiles = async () => {
    return await fetchWebApi("v1/me", "GET", null);
  };

  async function fetchWebApi(endpoint: any, method: any, body: any) {
    // const tokenExpirationTime = Number(await AsyncStorage.getItem('expirationTime'));
    
    // if (new Date().getTime() > tokenExpirationTime) {
    //   // access token has expired, so we need to use the refresh token
    //   await refreshTokens();
    // }
    await refreshTokens();
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken === null) {
        // Handle the case where accessToken is null
        throw new Error('Access token is null');
      }
    //console.log("accesssssed token", accessToken);
    let options: { headers: { Authorization: string }, method: any, body: string | null } = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
      body: null
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    
    const res = await fetch(`https://api.spotify.com/${endpoint}`, options);
    if (res.status === 204 || res.headers.get("Content-Length") === "0") {
      return null;
    }
    const responseData = await res.json();
    return responseData || null;
  };

  export const getTopTracks = async (time_range: string, limit: number, offset: number = 0) => {
    return (await fetchWebApi(`v1/me/top/tracks?time_range=${time_range}&limit=${limit}&offset=${offset}`, "GET", null)).items;
  };

  export const getCurrentSong = async () => {
    const response = await fetchWebApi("v1/me/player/currently-playing", "GET", null);
    if (response === null) {
      return null;
    }
    return (await fetchWebApi("v1/me/player/currently-playing", "GET", null)).item;
  }

  export const isLiked = async (trackId: string) => {
    return (await fetchWebApi(`v1/me/tracks/contains?ids=${trackId}`, "GET", null))[0];
  }

  export const likeTrack = async (trackId: string) => {
    return await fetchWebApi(`v1/me/tracks?ids=${trackId}`, "PUT", null);
  }

  export const unlikeTrack = async (trackId: string) => {
    return await fetchWebApi(`v1/me/tracks?ids=${trackId}`, "DELETE", null);
  }

  export const getHistory = async (limit: string) => {
    return (await fetchWebApi(`v1/me/player/recently-played?limit=${limit}`, "GET", null)).items;
  }

  export const getPlaylists = async () => {
    return (await fetchWebApi("v1/me/playlists", "GET", null)).items;
  }

  export const getTrackRecommendations = async (limit: number, seed_tracks?: string) => {
    return (await fetchWebApi(`v1/recommendations?limit=${limit}&seed_tracks=${seed_tracks}`, "GET", null)).tracks;
  }

  export const getArtistRecommendations = async (limit: number, seed_artists?: string) => {
    return (await fetchWebApi(`v1/recommendations?limit=${limit}&seed_artists=${seed_artists}`, "GET", null)).tracks;
  }

  export const searchTracks = async (query: string) => {
    return (await fetchWebApi(`v1/search?q=${query}&type=track&limit=1&offset=0&include_external=audio`, "GET", null)).tracks.items;
  }