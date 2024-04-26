import { el, setChildren } from 'redom';
import { Element } from '../../functions/AbstractComponent';
import { user } from '../../../index';

export class User extends Element {
  constructor() {
    super();
  }

  public userName: string;
  public userBtn: HTMLElement;
  public userDropdown: HTMLElement;
  public userDropdownBtn: HTMLElement;

  getTemplate(): HTMLElement {
    const userContainer = el('div.header__user-container');

    this.userBtn = el('button.header__user');

    const userImg = el('img.header__user__img', {
      src: 'img/user.jpg',
      alt: 'Изображение пользователя',
    });

    const userText = el('span.header__user__text');

    userText.textContent = JSON.parse(localStorage.getItem('user_name'));

    setChildren(this.userBtn, [userImg, userText]);

    this.userBtn.insertAdjacentHTML(
      'beforeend',
      `<svg
        class="header__user__svg" width="6" height="11" viewBox="0 0 6 11" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M0.528636 1.02859C0.788986 0.768245 1.2111 0.768245 1.47145 1.02859L5.47145 5.02859C5.73179 5.28894 5.73179 5.71105 5.47145 5.9714L1.47145 9.9714C1.2111 10.2318 0.788986 10.2318 0.528636 9.9714C0.268287 9.71105 0.268287 9.28894 0.528636 9.02859L4.05723 5.5L0.528636 1.9714C0.268287 1.71105 0.268287 1.28894 0.528636 1.02859Z"
          fill="#FC6D3E" />
      </svg>`,
    );

    this.userDropdown = el('div.user__dropdown');

    this.userDropdownBtn = el('button.track__add-btn');
    this.userDropdownBtn.textContent = 'Выйти';

    setChildren(this.userDropdown, [this.userDropdownBtn]);

    setChildren(userContainer, [this.userBtn, this.userDropdown]);

    return userContainer;
  }

  dropdown(): void {
    this.userBtn.addEventListener('click', () => {
      user.popUp(this.userDropdown);
    });
  }

  exit(): void {
    this.userDropdownBtn.addEventListener('click', () => {
      user.exitUser(this.userDropdown);
    });
  }
}
