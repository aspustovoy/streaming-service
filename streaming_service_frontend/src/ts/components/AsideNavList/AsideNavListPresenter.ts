import { AsideNavList } from './AsideNavList';
import { trackList, playlistList } from '../../..';
import { TracksModel } from '../../model/TracksModel';
import { PlayListModel } from '../../model/PlayListModel';

export const screenState = {
  Status: 'tracks',
};

export class AsideNavListPresenter {
  constructor(private view: AsideNavList) {
    this.render();
    this.navListener();
  }

  render(): void {
    document.querySelector('.search__btn-open')?.after(this.view.getElement());
  }

  navListener(): void {
    const btns = document.querySelectorAll('.aside__tabs-btn');
    const playListsbtn = document.querySelectorAll('.aside__playlist-btn');
    const btnSearchOpen = document.querySelector('.search__btn-open');
    const search = document.querySelector('.header__search');
    const tracksTitle = document.querySelector('.tracks__h2');

    btns.forEach((el) => {
      el.addEventListener('click', (e) => {
        btns.forEach((el) => el.classList.remove('aside__btn-active'));
        playListsbtn.forEach((el) => el.classList.remove('aside__btn-active'));

        el.classList.add('aside__btn-active');
        const path = (e.currentTarget as HTMLButtonElement).getAttribute(
          'data-path',
        );

        if (path === 'tracks') {
          screenState.Status = 'tracks';
          tracksTitle.textContent = 'Треки';
          trackList.renderSongs();
        }

        if (path === 'playlists') {
          screenState.Status = 'playlists';
          playlistList.renderPlaylist();
        }

        document
          .querySelectorAll('.tabs-content')
          .forEach((el) => el.classList.remove('section--active'));
        document
          .querySelector(`[data-target="${path}"]`)
          .classList.add('section--active');
      });
    });

    playListsbtn.forEach((el) => {
      el.addEventListener('click', async () => {
        document
          .querySelectorAll('.aside__tabs-btn')
          .forEach((el) => el.classList.remove('aside__btn-active'));
        playListsbtn.forEach((el) => el.classList.remove('aside__btn-active'));
        el.classList.add('aside__btn-active');

        if (parseInt(el.textContent.slice(-1))) {
          screenState.Status = 'playlist ' + el.textContent.slice(-1);
          tracksTitle.textContent = 'Плейлист #' + el.textContent.slice(-1);

          const index = parseInt(el.textContent.slice(-1));
          const playlistId = await new PlayListModel().getIdPlaylist(index);
          trackList.renderSongs(
            new TracksModel().getTracksPlaylist(playlistId),
          );
        } else {
          screenState.Status = 'favorites';
          tracksTitle.textContent = 'Любимые песни';
          trackList.renderSongs(new TracksModel().getModelLike());
        }
        document
          .querySelectorAll('.tabs-content')
          .forEach((el) => el.classList.remove('section--active'));
        document
          .querySelector(`[data-target="tracks"]`)
          .classList.add('section--active');
      });
    });

    btnSearchOpen.addEventListener('click', () =>
      search.classList.toggle('search--active'),
    );
  }
}
