import { pageTemplate } from './pageTemplate';

export function renderPage(): void {
  const body = document.querySelector('body');
  body.innerHTML = '';
  body.insertAdjacentHTML('beforeend', pageTemplate());
}
