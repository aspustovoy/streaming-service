export type PlayList = {
  createdAt: Date;
  name: string;
  id: number;
};

export class PlayListModel {
  constructor() {}

  async getModel(str?: string): Promise<PlayList[]> {
    const token = JSON.parse(localStorage.getItem('access_token') ?? '""');
    let playList: Promise<PlayList[]>;
    if (token) {
      playList = await fetch(`${process.env.API_URL}/users/playlists`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => {
        return res.json();
      });
    }

    (await playList)?.unshift({
      id: 0,
      name: 'Любимые песни',
      createdAt: new Date(),
    });

    if (str) {
      str = str.toLowerCase().trim();
      return (await playList).filter((el) =>
        el.name.toLowerCase().includes(str),
      );
    } else return playList;
  }

  async getIdPlaylist(index: number) {
    return (await this.getModel())[index].id;
  }
}
