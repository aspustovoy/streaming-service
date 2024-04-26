import { el } from 'redom';
import { Element } from '../../functions/AbstractComponent';

export class PlaylistList extends Element {
  constructor() {
    super();
  }

  getTemplate(): HTMLElement {
    const playlistList = el('ul.playlist__list');
    return playlistList;
  }
}
