import { el, setChildren } from 'redom';
import { Element } from '../../functions/AbstractComponent';
import { Song } from '../../model/TracksModel';
import { TrackPresenter } from './TrackPresenter';
import { TracksModel } from '../../model/TracksModel';
import { screenState } from '../AsideNavList/AsideNavListPresenter';

export class Track extends Element {
  constructor(
    private data: Song,
    private itemNumber: number,
  ) {
    super();
  }

  private id = this.data.id;
  private name = this.data.name;
  private image = this.data.image;
  private duration = this.data.duration;
  private album = this.data.album;
  private createdAt = this.data.createdAt;
  private artist = this.data.artist;
  private playlists = this.data.path;
  private likes = this.data.likes;

  public likeBtn: HTMLElement;
  public btnDropdown: HTMLElement;
  public trackDropdown: HTMLElement;
  public trackAddBtn: HTMLElement;
  public trackDeleteBtn: HTMLElement;
  public nameLink: HTMLElement;

  getTemplate(): HTMLElement {
    const item = el('li.tracks__item flex');

    const itemNumber = el('div.tracks__item__number');
    itemNumber.textContent = this.itemNumber.toString();

    const itemName = el('div.tracks__item__name');
    const trackImg = el('img.track__img', {
      src: `${this.image}`,
      alt: `${this.name}`,
    });

    const trackContent = el('div.track__content');
    const trackName = el('h3.track__name');
    this.nameLink = el('a.track__name__link');
    this.nameLink.textContent = this.name;
    setChildren(trackName, [this.nameLink]);
    const trackAuthor = el('span.track__author');
    trackAuthor.textContent = this.artist.name;
    setChildren(trackContent, [trackName, trackAuthor]);
    setChildren(itemName, [trackImg, trackContent]);

    const itemAlbom = el('div.tracks__item__albom');
    itemAlbom.textContent = this.album.name;

    const itemData = el('div.tracks__item__data flex');
    const dataText = el('span.data__text');
    dataText.textContent =
      Math.floor(
        (new Date().getTime() - new Date(this.createdAt).getTime()) /
          (1000 * 3600 * 24),
      ).toString() + ' дней назад';

    this.likeBtn = el('button.track__like-btn');

    const userName = JSON.parse(localStorage.getItem('user_name') ?? '""');
    if (this.likes.find((user) => user.username === userName)) {
      this.likeBtn.className += ' like-btn--active';
    }
    this.likeBtn.insertAdjacentHTML(
      'beforeend',
      `<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M15.5022 8.2786e-06C14.6291 -0.00149138 13.7677 0.200775 12.9865 0.590718C12.2052 0.980661 
                      11.5258 1.54752 11.0022 2.24621C10.293 1.30266 9.30512 0.606001 8.17823 0.254823C7.05134 -0.0963541 
                      5.84256 -0.0842713 4.72291 0.289363C3.60327 0.662997 2.62948 1.37926 1.93932 2.3368C1.24916 3.29434 
                      0.877596 4.44467 0.877197 5.62501C0.877197 12.3621 10.2373 17.6813 10.6357 
                      17.9044C10.7477 17.9671 10.8739 18 11.0022 18C11.1305 18 11.2567 17.9671 11.3687 17.9044C13.0902 
                      16.8961 14.7059 15.7173 16.1914 14.3856C19.4665 11.438 21.1272 8.49047 21.1272 5.62501C21.1255 4.13368 
                      20.5323 2.70393 19.4778 1.6494C18.4233 0.594873 16.9935 0.00169855 15.5022 8.2786e-06V8.2786e-06Z"
                      fill="#FC6D3E" />
                    </svg>`,
    );
    setChildren(itemData, [dataText, this.likeBtn]);

    const itemTime = el('time.tracks__item__time');
    itemTime.textContent = this.millisToMinutesAndSeconds(this.duration);

    const itemDrop = el('div.tracks__item__drop');
    this.btnDropdown = el('button.track__btn-dropdown');
    this.btnDropdown.insertAdjacentHTML(
      'beforeend',
      `<svg width="23" height="4" viewBox="0 0 23 4" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="11.5" cy="2" r="2" fill="#C4C4C4" />
                    <circle cx="21" cy="2" r="2" fill="#C4C4C4" />
                    </svg>`,
    );

    this.trackDropdown = el('div.track__dropdown');
    this.trackAddBtn = el('button.track__add-btn');
    this.trackAddBtn.textContent = 'Добавить в плейлист';

    this.trackDeleteBtn = el('button.track__delete-btn');
    this.trackDeleteBtn.textContent = 'Удалить из плейлиста';

    setChildren(this.trackDropdown, [this.trackAddBtn, this.trackDeleteBtn]);
    setChildren(itemDrop, [this.btnDropdown, this.trackDropdown]);
    setChildren(item, [
      itemNumber,
      itemName,
      itemAlbom,
      itemData,
      itemTime,
      itemDrop,
    ]);
    return item;
  }

  play(): void {
    this.nameLink.addEventListener('click', () => {
      TrackPresenter.playTrack(this.id, screenState.Status);
    });
  }

  like(): void {
    this.likeBtn.addEventListener('click', () => {
      new TrackPresenter(
        new Track(this.data, this.itemNumber),
        new TracksModel(),
      ).updateLike(this.data);
    });
  }

  dropdown(): void {
    this.btnDropdown.addEventListener('click', () => {
      TrackPresenter.popUp(this.trackDropdown);
    });
  }

  trackAdd(): void {
    this.trackAddBtn.addEventListener('click', () => {
      TrackPresenter.playlistsModal(this.trackDropdown, this.data);
    });
  }

  trackDelete(): void {
    this.trackDeleteBtn.addEventListener('click', () => {
      new TrackPresenter(new Track(this.data, this.itemNumber)).deleteTrack(
        this.data,
      );
    });
  }

  millisToMinutesAndSeconds(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = parseInt(((millis % 60000) / 1000).toFixed(0));
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}
