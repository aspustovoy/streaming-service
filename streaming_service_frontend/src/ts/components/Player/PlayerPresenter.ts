import * as noUiSlider from 'nouislider';
import { Player } from './Player';
import { PlayerModel } from '../../model/PlayerModel';
import { trackStatus } from './Player';
import { screenState } from '../AsideNavList/AsideNavListPresenter';

type StatusRepeatShuffle = {
  Repeat: boolean;
  Shuffle: boolean;
};

export class PlayerPresenter {
  constructor(
    public view: Player,
    public model?: PlayerModel,
  ) {
    this.render();
    this.addVolume();
    this.view.play();
    this.view.next();
    this.view.back();
    this.view.repeat();
    this.view.shuffle();
    this.audioElement.crossOrigin = 'anonymous';
  }

  public oldStatus = screenState.Status;
  public audioElement = this.view.path
    ? new Audio(`http://localhost:3000${this.view.path}`)
    : new Audio();
  public buffSongs = new PlayerModel().getModel();
  public buffSongIndex = this.view.id - 1;
  public audioVolume = 0.5;

  render(): void {
    this.audioElement.crossOrigin = 'anonymous';
    document.querySelector('.footer').innerHTML = '';
    document.querySelector('.footer').append(this.view.getElement());
  }

  startTrack() {
    const rangePlay = document.getElementById(
      'range-play',
    ) as noUiSlider.target;

    if (!trackStatus.Name) {
      trackStatus.Name = this.view.name;
      noUiSlider.create(rangePlay, {
        start: 0,
        connect: [true, false],
        range: {
          min: 0,
          max: parseFloat((this.view.duration / 1000).toFixed(3)),
        },
      });
    }

    const currentTime = document.querySelector('.player__time-start');
    const timer = setInterval(async () => {
      currentTime.textContent = this.secondsToMinutesAndSeconds(
        this.audioElement.currentTime,
      );
      rangePlay.noUiSlider.set(this.audioElement.currentTime);
      if (this.audioElement.currentTime === this.audioElement.duration) {
        clearInterval(timer);

        if (this.buffSongIndex + 1 < (await this.buffSongs).length) {
          if (PlayerPresenter.getStatusRepeatShuffle().Repeat) {
            this.updateСomponent(this.buffSongIndex);
          } else if (PlayerPresenter.getStatusRepeatShuffle().Shuffle) {
            this.updateСomponent(
              Math.floor(
                Math.random() *
                  ((await this.buffSongs).length - (this.buffSongIndex + 1)) +
                  (this.buffSongIndex + 1),
              ),
            );
          } else {
            this.updateСomponent(this.buffSongIndex + 1);
          }
        } else if (PlayerPresenter.getStatusRepeatShuffle().Repeat) {
          this.updateСomponent(this.buffSongIndex);
        }
      }
    }, 1000);

    if (trackStatus.Status !== 'play') {
      trackStatus.Status = 'play';
      this.audioElement.play();
    } else {
      trackStatus.Status = 'not play';
      this.audioElement.pause();
    }

    rangePlay.noUiSlider.on(
      'change',
      (e) => (this.audioElement.currentTime = parseFloat(e[0].toString())),
    );

    const btnIcons = document.querySelectorAll('.player__play-btn-icon');
    btnIcons.forEach((svg) => {
      if (svg.classList.contains('icon-visible')) {
        svg.classList.remove('icon-visible');
      } else svg.classList.add('icon-visible');
    });
  }

  secondsToMinutesAndSeconds(seconds: number): string {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    seconds > 59 ? (seconds = seconds % 60) : seconds;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  async updateСomponent(id: number, status?: string) {
    if (status && status !== this.oldStatus) {
      this.oldStatus = status;
      trackStatus.Buffer = status;
      this.buffSongs = new PlayerModel().getModel();
      this.buffSongIndex = await this.getIndexBuffer(id);
    }

    if (status) {
      this.buffSongIndex = await this.getIndexBuffer(id);
    } else this.buffSongIndex = id;

    trackStatus.Status = 'not play';
    trackStatus.Name = '';
    this.audioElement.src = '';
    this.view = new Player((await this.buffSongs)[this.buffSongIndex]);
    this.audioElement = new Audio(`http://localhost:3000${this.view.path}`);
    this.render();
    this.addVolume();
    this.view.play();
    this.view.next();
    this.view.back();
    this.view.repeat();
    this.view.shuffle();
    this.audioElement.volume = this.audioVolume;
    this.startTrack();
  }

  async nextTrack() {
    const statusRepeatShuffle = JSON.parse(
      localStorage.getItem('statusRepeatShuffle') ?? '""',
    );
    if (statusRepeatShuffle.Shuffle) {
      let nextTrack = Math.floor(
        Math.random() * ((await this.buffSongs).length - 0) + 0,
      );
      while (nextTrack === this.buffSongIndex) {
        nextTrack = Math.floor(
          Math.random() * ((await this.buffSongs).length - 0) + 0,
        );
      }
      this.updateСomponent(nextTrack);
    } else if (
      (await this.buffSongs).length &&
      this.buffSongIndex + 1 < (await this.buffSongs).length
    ) {
      this.updateСomponent(this.buffSongIndex + 1);
    }
  }

  previousTrack() {
    if (this.buffSongIndex > 0) {
      this.updateСomponent(this.buffSongIndex - 1);
    }
  }

  repeatTrack(repeatBtn: HTMLElement) {
    const statusRepeatShuffle = JSON.parse(
      localStorage.getItem('statusRepeatShuffle') ?? '""',
    );

    if (!statusRepeatShuffle.Repeat) {
      statusRepeatShuffle.Repeat = true;
      localStorage.setItem(
        'statusRepeatShuffle',
        JSON.stringify(statusRepeatShuffle),
      );
      repeatBtn.classList.add('player__repeat-btn--active');
    } else {
      statusRepeatShuffle.Repeat = false;
      localStorage.setItem(
        'statusRepeatShuffle',
        JSON.stringify(statusRepeatShuffle),
      );
      repeatBtn.classList.remove('player__repeat-btn--active');
    }
  }

  async shuffleTrack(shuffleBtn: HTMLElement) {
    const statusRepeatShuffle = JSON.parse(
      localStorage.getItem('statusRepeatShuffle') ?? '""',
    );

    if (!statusRepeatShuffle.Shuffle) {
      statusRepeatShuffle.Shuffle = true;
      localStorage.setItem(
        'statusRepeatShuffle',
        JSON.stringify(statusRepeatShuffle),
      );
      shuffleBtn.classList.add('player__shuffle-btn--active');
    } else {
      statusRepeatShuffle.Shuffle = false;
      localStorage.setItem(
        'statusRepeatShuffle',
        JSON.stringify(statusRepeatShuffle),
      );
      shuffleBtn.classList.remove('player__shuffle-btn--active');
    }
  }

  addVolume() {
    const rangeValue = document.getElementById(
      'range-value',
    ) as noUiSlider.target;
    noUiSlider.create(rangeValue, {
      start: this.audioVolume,
      connect: [true, false],
      range: {
        min: 0,
        max: 1,
      },
    });
    rangeValue.noUiSlider.on('change', (e) => {
      this.audioElement.volume = parseFloat(e[0].toString());
      this.audioVolume = parseFloat(e[0].toString());
    });
  }

  async updateBuff() {
    if (this.oldStatus !== 'tracks') {
      this.buffSongs = new PlayerModel().getModel();
      this.buffSongIndex = await this.getIndexBuffer(this.view.id);
    }
  }

  async getIndexBuffer(id: number): Promise<number> {
    let index = (await this.buffSongs).findIndex((el) => el.id === id);
    if (index < 0) {
      index = (await this.buffSongs).findIndex((el) => el.id > id) - 1;
    }
    return index;
  }

  updatePlayerLike() {
    if (this.view.trackLike.classList.contains('like-btn--active')) {
      this.view.trackLike.classList.remove('like-btn--active');
    } else this.view.trackLike.classList.add('like-btn--active');
  }

  static getStatusRepeatShuffle(): StatusRepeatShuffle {
    let statusRepeatShuffle = JSON.parse(
      localStorage.getItem('statusRepeatShuffle') ?? '""',
    );
    if (statusRepeatShuffle) return statusRepeatShuffle;
    else {
      statusRepeatShuffle = {
        Repeat: false,
        Shuffle: false,
      };
      localStorage.setItem(
        'statusRepeatShuffle',
        JSON.stringify(statusRepeatShuffle),
      );
      return statusRepeatShuffle;
    }
  }

  updateEventListener() {
    this.audioElement.crossOrigin = 'anonymous';
    trackStatus.Status = 'not play';
    trackStatus.Name = '';
    this.audioElement.src = '';
    this.audioElement = new Audio(`http://localhost:3000${this.view.path}`);
    this.render();
    this.addVolume();
    this.view.play();
    this.view.next();
    this.view.back();
    this.view.repeat();
    this.view.shuffle();
    this.audioElement.volume = this.audioVolume;
    this.buffSongs = new PlayerModel().getModel();
  }
}
