import { Song } from '../../model/TracksModel';
import { Track } from '../Track/Track';
import { TrackPresenter } from '../Track/TrackPresenter';
import { TracksModel } from '../../model/TracksModel';
import { TrackList } from './TrackList';

export class TrackListPresenter {
  constructor(
    private view: TrackList,
    private model?: TracksModel,
  ) {
    this.render();
  }

  render(): void {
    document.querySelector('.tracks__header')?.after(this.view.getElement());
  }

  async renderSongs(songs?: Promise<Song[]>): Promise<void> {
    document.querySelector('.tracks__list').innerHTML = '';
    let songsArr;
    if (songs) {
      songsArr = await songs;
    } else songsArr = await new TracksModel().getModel();
    for (let index = 0; index < songsArr.length; index++) {
      const itemNumber = index + 1;
      new TrackPresenter(new Track(songsArr[index], itemNumber));
    }
  }
}
