import { el } from 'redom';
import { Element } from '../../functions/AbstractComponent';

export class TrackList extends Element {
  constructor() {
    super();
  }

  getTemplate(): HTMLElement {
    const trackList = el('ul.tracks__list');
    return trackList;
  }
}
