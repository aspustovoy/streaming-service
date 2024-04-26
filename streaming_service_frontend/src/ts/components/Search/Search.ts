import { el } from 'redom';
import { Element } from '../../functions/AbstractComponent';
import { SearchPresenter } from './SearchPresenter';
import { TracksModel } from '../../model/TracksModel';
import { PlayListModel } from '../../model/PlayListModel';
import { debounce } from '../../functions/debounce';

export class Search extends Element {
  constructor() {
    super();
  }

  private input: HTMLElement;

  getTemplate(): HTMLElement {
    this.input = el('input.header__search__field', {
      type: 'search',
      placeholder: 'ЧТО БУДЕМ ИСКАТЬ?',
    });
    return this.input;
  }

  inputEvent() {
    this.input.addEventListener('input', debounce(this.handleInput, 500));
  }

  handleInput(e: Event) {
    if (
      document.querySelector('.tracks.section.tabs-content.section--active')
    ) {
      new SearchPresenter(new Search(), new TracksModel()).searchFilter(
        (e.target as HTMLInputElement).value,
      );
    } else
      new SearchPresenter(new Search(), new PlayListModel()).searchFilter(
        (e.target as HTMLInputElement).value,
      );
  }
}
