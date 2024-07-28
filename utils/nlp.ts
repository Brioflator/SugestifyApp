import { searchTracks } from '../utils/spotify';

const API_BASE_URL = 'https://stunning-loyal-gull.ngrok-free.app';

export const fetchResources = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/check_availability`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to fetch resources:', error);
    }
}

export const fetchData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/song_data_for_recommendation`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch resources:', error);
    }
}


export const fetchSongRecommendations = async (sentence: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/get_recommendation/sentence?sentence=${encodeURIComponent(sentence)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch recommendations for sentence "${sentence}":`, error);
    }
}

type TrackInfo = {
    lyrics: string;
    song: string;
    artist: string;
  };

  type TrackNLP = {
    id: string;
    name: string;
    artists: string[];
    albumImage: string;
    music: string;
  };


  export const processTracks = async (data: TrackInfo[]) => {
    const trackSearchResults = await Promise.all(
      data.map(async (track) => {
        const query = `track:${track.song} artist:${track.artist}`;
        const searchResult = await searchTracks(query);
        let trackArtistArray: TrackNLP[] = [];
        console.log(searchResult);
        searchResult?.forEach((track: { id: any; name: any; artists: any[]; album: { images: { url: any; }[]; }; preview_url: any; }) => {
            trackArtistArray.push({
              id: track.id,
              name: track.name,
              artists: track.artists.map((artist: any) => artist.name),
              albumImage: track.album.images[0].url,
              music: track.preview_url,
            });
          });
        return trackArtistArray;
      })
    );
    return trackSearchResults;
  }
