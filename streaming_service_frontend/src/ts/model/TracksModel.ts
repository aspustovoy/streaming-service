type Album = {
  createdAt: Date;
  id: number;
  image: string;
  name: string;
};

type Artist = Album;

type Likes = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type Song = {
  album: Album;
  artist: Artist;
  createdAt: Date;
  duration: number;
  fileName: string;
  id: number;
  image: string;
  likes: Likes[];
  name: string;
  path: string;
};

export class TracksModel {
  constructor() {}

  async getModel(str?: string): Promise<Song[]> {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    let songs: Promise<Song[]>;
    if (token) {
      songs = await fetch(`${process.env.API_URL}/songs`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        return res.json();
      });
    }

    if (str) {
      str = str.toLowerCase().trim();
      return (await songs).filter(
        (song) =>
          song.name.toLowerCase().includes(str) ||
          song.album.name.toLowerCase().includes(str) ||
          song.artist.name.toLowerCase().includes(str),
      );
    } else return songs;
  }

  async getTracksPlaylist(id: number, str?: string): Promise<Song[]> {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    let songs: Promise<Song[]>;

    if (token) {
      songs = await fetch(`${process.env.API_URL}/playlists/${id}/songs`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        return res.json();
      });
    }

    if (str) {
      str = str.toLowerCase().trim();
      return (await songs).filter(
        (song) =>
          song.name.toLowerCase().includes(str) ||
          song.album.name.toLowerCase().includes(str) ||
          song.artist.name.toLowerCase().includes(str),
      );
    } else return songs;
  }

  async getModelLike(str?: string): Promise<Song[]> {
    const userName = JSON.parse(localStorage.getItem('user_name'));
    const arrSong = await this.getModel(str);
    return arrSong?.filter((el) =>
      el.likes.find((user) => user.username === userName) ? true : false,
    );
  }

  async delTrack(idPlaylist: number, idTrack: number) {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    if (token) {
      await fetch(
        `${process.env.API_URL}/playlists/${idPlaylist}/remove/${idTrack}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  }

  async addTrack(idPlaylist: number, idTrack: number) {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    if (token) {
      await fetch(
        `${process.env.API_URL}/playlists/${idPlaylist}/add/${idTrack}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  }

  async trackLike(idTrack: number) {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    if (token) {
      await fetch(`${process.env.API_URL}/songs/${idTrack}/like`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  async trackUnlike(idTrack: number) {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    if (token) {
      await fetch(`${process.env.API_URL}/songs/${idTrack}/unlike`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
}
