import { Search } from './Search';
import { TracksModel } from '../../model/TracksModel';
import { PlayListModel } from '../../model/PlayListModel';
import { trackList } from '../../..';
import { playlistList } from '../../..';

export class SearchPresenter {
  constructor(
    private view: Search,
    private model?: TracksModel | PlayListModel,
  ) {}

  render(): void {
    document.querySelector('.header__search').append(this.view.getElement());
    this.view.inputEvent();
  }

  async searchFilter(str: string): Promise<void> {
    if (this.model instanceof PlayListModel)
      playlistList.renderPlaylist(this.model.getModel(str));

    if (this.model instanceof TracksModel) {
      const activeBtn = document.querySelector('.aside__btn-active');
      if (activeBtn.getAttribute('data-path') === 'tracks') {
        trackList.renderSongs(this.model.getModel(str));
      } else if (parseInt(activeBtn.textContent.slice(-1))) {
        const index = parseInt(activeBtn.textContent.slice(-1));
        const playlistId = await new PlayListModel().getIdPlaylist(index);
        trackList.renderSongs(
          new TracksModel().getTracksPlaylist(playlistId, str),
        );
      } else {
        trackList.renderSongs(new TracksModel().getModelLike(str));
      }
    }
  }
}
