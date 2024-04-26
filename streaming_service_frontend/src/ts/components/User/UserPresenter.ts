import { player } from '../../..';
import { startApp } from '../../functions/startApp';
import { User } from './User';

export class UserPresenter {
  constructor(private view: User) {
    this.render();
    this.view.dropdown();
    this.view.exit();
  }

  render(): void {
    document.querySelector('.header__search')?.after(this.view.getElement());
  }

  popUp(el: HTMLElement) {
    if (document.querySelectorAll('.user__dropdown--active').length === 0) {
      el.className += ' user__dropdown--active';
    } else el.classList.remove('user__dropdown--active');
  }

  exitUser(el: HTMLElement) {
    el.classList.remove('user__dropdown--active');
    localStorage.removeItem('access_token');
    player.updateEventListener();
    startApp();
  }

  setUserName() {
    document.querySelector('.header__user__text').textContent = JSON.parse(
      localStorage.getItem('user_name'),
    );
  }
}
