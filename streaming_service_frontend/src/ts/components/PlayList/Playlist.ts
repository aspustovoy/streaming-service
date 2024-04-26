import { el, setChildren } from 'redom';
import { Element } from '../../functions/AbstractComponent';
import { PlayList } from '../../model/PlayListModel';
import { getNoun } from '../../functions/getNoun';

export class Playlist extends Element {
  constructor(
    private data: PlayList,
    private count: number,
    private itemNumber: number,
  ) {
    super();
  }

  getTemplate(): HTMLElement {
    const item = el('li.playlist__item');

    const itemPicture = el('picture');
    const source1 = el('source', {
      srcset: `img/playlists__360%20(${this.itemNumber}).jpg`,
      media: '(max-width: 576px)',
    });
    const source2 = el('source', {
      srcset: `img/playlists__1440%20(${this.itemNumber}).jpg`,
      media: '(max-width: 1440px)',
    });
    const playlistImg = el('img.playlist__img', {
      src: `img/playlists%20(${this.itemNumber}).jpg`,
      alt: this.data.name,
    });
    setChildren(itemPicture, [source1, source2, playlistImg]);

    const itemContent = el('div.playlist__content');
    const playlistTitle = el('h3.playlist__h3');
    const playlistTitleLink = el('button.playlist__h3__link');
    playlistTitleLink.textContent = this.data.name;
    setChildren(playlistTitle, [playlistTitleLink]);

    const playlistCount = el('span.playlist__count');
    playlistCount.textContent =
      this.count + getNoun(this.count, ' трек', ' трека', ' треков');
    setChildren(itemContent, [playlistTitle, playlistCount]);

    setChildren(item, [itemPicture, itemContent]);
    return item;
  }
}
