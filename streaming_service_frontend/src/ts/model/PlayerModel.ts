import { trackStatus } from '../components/Player/Player';
import { PlayListModel } from './PlayListModel';
import { Song, TracksModel } from './TracksModel';

export class PlayerModel {
  constructor() {}

  async getTrack(id: number): Promise<Song | null> {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');

    if (token) {
      return fetch(`${process.env.API_URL}/songs/${id}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        return res.json();
      });
    } else return null;
  }

  async getModel() {
    if (trackStatus.Buffer === 'tracks') {
      return new TracksModel().getModel();
    }
    if (trackStatus.Buffer === 'favorites') {
      return new TracksModel().getModelLike();
    }
    if (parseInt(trackStatus.Buffer.slice(-1))) {
      const index = parseInt(trackStatus.Buffer.slice(-1));
      const playlistId = await new PlayListModel().getIdPlaylist(index);
      return new TracksModel().getTracksPlaylist(playlistId);
    }
  }
}
