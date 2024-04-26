import { Auth } from './Auth';
import { AuthModel } from '../../model/AuthModel';
import { startApp } from '../../functions/startApp';

export class AuthPresenter {
  constructor(private view: Auth) {
    this.render();
    this.view.signIn();
    this.view.signUp();
  }

  render(): void {
    document.querySelector('body')?.append(this.view.getElement());
  }

  static async signInEvent(
    username: string,
    password: string,
    error: HTMLElement,
  ) {
    error.textContent = '';
    const response = await new AuthModel().getToken(username, password);

    if (response) {
      error.textContent = response;
    } else {
      startApp();
    }
  }

  static async signUpEvent(
    username: string,
    password: string,
    error: HTMLElement,
  ) {
    error.textContent = '';

    if (!username || !password) {
      error.textContent = 'not filled in';
    } else {
      const response = await new AuthModel().registration(username, password);

      if (response) {
        error.textContent = response;
      } else {
        startApp();
      }
    }
  }
}
