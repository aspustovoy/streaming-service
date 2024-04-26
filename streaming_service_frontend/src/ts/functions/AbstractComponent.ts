export abstract class Element {
  public element: HTMLElement | null;

  abstract getTemplate(): HTMLElement;

  getElement(): HTMLElement {
    this.element = this.getTemplate();
    return this.element;
  }

  removeElement(): void {
    this.element = null;
  }
}
