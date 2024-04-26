import { PlaylistList } from '../PlaylistList/PlaylistList';
import { PlayList, PlayListModel } from '../../model/PlayListModel';
import { TracksModel } from '../../model/TracksModel';
import { PlaylistPresenter } from '../PlayList/PlaylistPresenter';
import { Playlist } from '../PlayList/Playlist';
import { trackList } from '../../..';
import { screenState } from '../AsideNavList/AsideNavListPresenter';

export class PlaylistListPresenter {
  constructor(
    private view: PlaylistList,
    private model?: PlayListModel,
  ) {
    this.render();
  }

  render(): void {
    document.querySelector('.playlist__h2')?.after(this.view.getElement());
  }

  async renderPlaylist(playList?: Promise<PlayList[]>): Promise<void> {
    let playlistArr;

    document.querySelector('.playlist__list').innerHTML = '';

    if (playList) {
      playlistArr = await playList;
    } else playlistArr = await new PlayListModel().getModel();

    for (let index = 0; index < playlistArr.length; index++) {
      if (playlistArr[index].name === 'Любимые песни') {
        const songs = new TracksModel().getModelLike();
        new PlaylistPresenter(
          new Playlist(playlistArr[index], (await songs).length, index + 1),
        );
      } else {
        const songs = new TracksModel().getTracksPlaylist(
          playlistArr[index].id,
        );
        new PlaylistPresenter(
          new Playlist(playlistArr[index], (await songs).length, index + 1),
        );
      }
    }

    const links = document.querySelectorAll('.playlist__h3__link');

    links.forEach((el) => {
      el.addEventListener('click', async () => {
        if (parseInt(el.textContent.slice(-1))) {
          screenState.Status = 'playlist ' + el.textContent.slice(-1);
          const index = parseInt(el.textContent.slice(-1));
          const playlistId = await new PlayListModel().getIdPlaylist(index);
          trackList.renderSongs(
            new TracksModel().getTracksPlaylist(playlistId),
          );
        } else {
          screenState.Status = 'favorites';
          trackList.renderSongs(new TracksModel().getModelLike());
        }

        document
          .querySelectorAll('.aside__tabs-btn')
          .forEach((el) => el.classList.remove('aside__btn-active'));

        document
          .querySelectorAll('.tabs-content')
          .forEach((el) => el.classList.remove('section--active'));
        document
          .querySelector(`[data-target="tracks"]`)
          .classList.add('section--active');

        const playListsbtn = document.querySelectorAll('.aside__playlist-btn');
        playListsbtn.forEach((e) => {
          if (e.textContent === el.textContent)
            e.classList.add('aside__btn-active');
        });
      });
    });
  }
}
