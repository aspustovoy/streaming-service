import './css/style.css';
import { startApp } from './ts/functions/startApp';
import { renderPage } from './ts/functions/renderPage';
import { User } from './ts/components/User/User';
import { UserPresenter } from './ts/components/User/UserPresenter';
import { AsideNavList } from './ts/components/AsideNavList/AsideNavList';
import { AsideNavListPresenter } from './ts/components/AsideNavList/AsideNavListPresenter';
import { Search } from './ts/components/Search/Search';
import { SearchPresenter } from './ts/components/Search/SearchPresenter';
import { Player } from './ts/components/Player/Player';
import { PlayerPresenter } from './ts/components/Player/PlayerPresenter';
import { TrackList } from './ts/components/TrackList/TrackList';
import { TrackListPresenter } from './ts/components/TrackList/TrackListPresenter';
import { PlaylistList } from './ts/components/PlaylistList/PlaylistList';
import { PlaylistListPresenter } from './ts/components/PlaylistList/PlaylistListPresenter';

renderPage();

export const user = new UserPresenter(new User());
export const asideNavList = new AsideNavListPresenter(new AsideNavList());
export const trackList = new TrackListPresenter(new TrackList());
export const playlistList = new PlaylistListPresenter(new PlaylistList());
export const search = new SearchPresenter(new Search()).render();
export const player = new PlayerPresenter(new Player());

startApp();
