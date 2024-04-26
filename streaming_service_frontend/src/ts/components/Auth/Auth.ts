import { el, setChildren } from 'redom';
import { Element } from '../../functions/AbstractComponent';
import { AuthPresenter } from './AuthPresenter';

export class Auth extends Element {
  constructor() {
    super();
  }

  public userInput: HTMLElement;
  public passwordInput: HTMLElement;
  public signInBtn: HTMLElement;
  public signUpBtn: HTMLElement;
  public errorString: HTMLElement;

  getTemplate(): HTMLElement {
    const authContainer = el('div.auth__container');

    const authForm = el('form.auth__form');

    const authTitle = el('span.auth__title');
    authTitle.textContent = 'Welcom';

    this.userInput = el('input.auth__input', {
      type: 'text',
      name: 'username',
      placeholder: 'Username',
      autocomplete: 'off',
    });

    this.passwordInput = el('input.auth__input', {
      type: 'password',
      name: 'password',
      placeholder: 'Password',
      autocomplete: 'new-password',
    });

    const authContainerBtns = el('div.auth__btns-container');

    this.signInBtn = el('button.auth__btn');
    this.signInBtn.textContent = 'Sign in';

    this.signUpBtn = el('button.auth__btn');
    this.signUpBtn.textContent = 'Sign up';

    setChildren(authContainerBtns, [this.signInBtn, this.signUpBtn]);

    this.errorString = el('string.auth__text');

    setChildren(authForm, [
      authTitle,
      this.userInput,
      this.passwordInput,
      authContainerBtns,
      this.errorString,
    ]);

    setChildren(authContainer, [authForm]);

    return authContainer;
  }

  signIn(): void {
    this.signInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthPresenter.signInEvent(
        (this.userInput as HTMLInputElement).value,
        (this.passwordInput as HTMLInputElement).value,
        this.errorString,
      );
      (this.userInput as HTMLInputElement).value = '';
      (this.passwordInput as HTMLInputElement).value = '';
    });
  }

  signUp(): void {
    this.signUpBtn.addEventListener('click', (e) => {
      e.preventDefault();
      AuthPresenter.signUpEvent(
        (this.userInput as HTMLInputElement).value,
        (this.passwordInput as HTMLInputElement).value,
        this.errorString,
      );
      (this.userInput as HTMLInputElement).value = '';
      (this.passwordInput as HTMLInputElement).value = '';
    });
  }
}
