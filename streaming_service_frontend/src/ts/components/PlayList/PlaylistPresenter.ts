import { Playlist } from './Playlist';
import { PlayListModel } from '../../model/PlayListModel';

export class PlaylistPresenter {
  constructor(
    private view: Playlist,
    private model?: PlayListModel,
  ) {
    this.render();
  }

  render(): void {
    document.querySelector('.playlist__list').append(this.view.getElement());
  }
}
