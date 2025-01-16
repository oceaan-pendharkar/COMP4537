export class Button {
  constructor(label, onClick) {
    this.button = document.createElement("button");
    this.button.textContent = label;
    this.button.addEventListener("click", onClick);
  }

  getElement() {
    return this.button;
  }
}
