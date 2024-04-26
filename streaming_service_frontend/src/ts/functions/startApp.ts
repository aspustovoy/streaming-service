import { AuthPresenter } from '../components/Auth/AuthPresenter';
import { Auth } from '../components/Auth/Auth';
import { user, trackList, player } from '../..';
import { Player } from '../components/Player/Player';
import { PlayerModel } from '../model/PlayerModel';
import { screenState } from '../components/AsideNavList/AsideNavListPresenter';

export async function startApp() {
  const token = JSON.parse(localStorage.getItem('access_token') ?? '""');

  if (token) {
    const btns = document.querySelectorAll('.aside__tabs-btn');
    const playListsbtn = document.querySelectorAll('.aside__playlist-btn');
    btns.forEach((el) => el.classList.remove('aside__btn-active'));
    playListsbtn.forEach((el) => el.classList.remove('aside__btn-active'));
    document
      .querySelector(`[data-target="tracks"]`)
      .classList.add('section--active');
    document
      .querySelector(`[data-path="tracks"]`)
      .classList.add('aside__btn-active');

    document
      .querySelector('.auth__container')
      ?.classList.remove('auth__container--active');
    screenState.Status = 'tracks';
    const tracksTitle = document.querySelector('.tracks__h2');
    tracksTitle.textContent = 'Треки';
    user.setUserName();
    trackList.renderSongs();
    player.view = new Player(await new PlayerModel().getTrack(1));
    player.updateEventListener();
  } else {
    new AuthPresenter(new Auth());
    document
      .querySelector('.auth__container')
      ?.classList.add('auth__container--active');
  }
}
