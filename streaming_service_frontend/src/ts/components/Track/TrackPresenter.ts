import { Song } from '../../model/TracksModel';
import { Track } from './Track';
import { player, trackList } from '../../../index';
import { TracksModel } from '../../model/TracksModel';
import { getNoun } from '../../functions/getNoun';
import { PlayListModel } from '../../model/PlayListModel';

export class TrackPresenter {
  constructor(
    private view: Track,
    private model?: TracksModel,
  ) {
    this.render();
    this.view.play();
    this.view.like();
    this.view.dropdown();
    this.view.trackAdd();
    this.view.trackDelete();
  }

  render(): void {
    document.querySelector('.tracks__list').append(this.view.getElement());
  }

  async updateLike(track: Song) {
    const userName = JSON.parse(localStorage.getItem('user_name') ?? '""');
    if (track.likes.find((user) => user.username === userName)) {
      await new TracksModel().trackUnlike(track.id);
    } else {
      await new TracksModel().trackLike(track.id);
    }

    const btnActive = document.querySelector('.aside__btn-active');

    if (parseInt(btnActive.textContent.slice(-1))) {
      const index = parseInt(btnActive.textContent.slice(-1));
      const playlistId = await new PlayListModel().getIdPlaylist(index);
      trackList.renderSongs(new TracksModel().getTracksPlaylist(playlistId));
    } else if (btnActive.getAttribute('data-path')) {
      trackList.renderSongs(this.model.getModel());
    } else {
      trackList.renderSongs(new TracksModel().getModelLike());
    }

    player.updateBuff();
    player.updatePlayerLike();
  }

  async deleteTrack(track: Song) {
    const index = parseInt(
      document.querySelector('.aside__btn-active').textContent.slice(-1),
    );
    const playlistId = await new PlayListModel().getIdPlaylist(index);
    await new TracksModel().delTrack(playlistId, track.id);

    trackList.renderSongs(new TracksModel().getTracksPlaylist(playlistId));
    player.updateBuff();
  }

  static async playlistsModal(element: HTMLElement, track: Song) {
    let stop = false;

    element.classList.remove('dropdown--active');
    document
      .querySelector('.modal-overlay')
      .classList.add('modal-overlay--visible');
    document.querySelector('.playlists-modal').classList.add('show');
    document.body.classList.add('stop-scroll');

    document
      .querySelector('.playlists-modal__close-btn')
      .addEventListener('click', () => {
        document
          .querySelector('.modal-overlay')
          .classList.remove('modal-overlay--visible');
        document.querySelector('.playlists-modal').classList.remove('show');
        document.body.classList.remove('stop-scroll');
      });

    let index = 0;
    const playlistCollection = document.querySelectorAll(
      '.playlists-modal__playlist__info',
    );
    for (const el of playlistCollection) {
      index += 1;
      const playlistId = await new PlayListModel().getIdPlaylist(index);
      const count = (await new TracksModel().getTracksPlaylist(playlistId))
        .length;
      el.textContent = count + getNoun(count, ' трек', ' трека', ' треков');
    }

    const playlistBtn = document.querySelectorAll('.playlists-modal__playlist');

    playlistBtn.forEach((button) => {
      button.addEventListener('click', async () => {
        if (!stop) {
          const index = parseInt(button.childNodes[3].textContent.slice(-1));
          const playlistId = await new PlayListModel().getIdPlaylist(index);
          await new TracksModel().addTrack(playlistId, track.id);
          document
            .querySelector('.modal-overlay')
            .classList.remove('modal-overlay--visible');
          document.querySelector('.playlists-modal').classList.remove('show');
          document.body.classList.remove('stop-scroll');
          await player.updateBuff();
          stop = true;
        }
      });
    });
  }

  static popUp(el: HTMLElement) {
    const activeBtn = document.querySelector('.aside__btn-active');
    if (document.querySelectorAll('.dropdown--active').length === 0) {
      el.className += ' dropdown--active';

      if (activeBtn.getAttribute('data-path') === 'tracks') {
        (el.childNodes[1] as HTMLButtonElement).disabled = true;
      } else if (parseInt(activeBtn.textContent.slice(-1))) {
        (el.childNodes[0] as HTMLButtonElement).disabled = true;
      } else {
        (el.childNodes[1] as HTMLButtonElement).disabled = true;
      }
    } else if (document.querySelector('.dropdown--active') !== el) {
      document
        .querySelector('.dropdown--active')
        .classList.remove('dropdown--active');
      el.className += ' dropdown--active';

      if (activeBtn.getAttribute('data-path') === 'tracks') {
        (el.childNodes[1] as HTMLButtonElement).disabled = true;
      } else if (parseInt(activeBtn.textContent.slice(-1))) {
        (el.childNodes[0] as HTMLButtonElement).disabled = true;
      } else {
        (el.childNodes[1] as HTMLButtonElement).disabled = true;
      }
    } else el.classList.remove('dropdown--active');
  }

  static playTrack(id: number, status: string) {
    player.updateСomponent(id, status);
  }
}
