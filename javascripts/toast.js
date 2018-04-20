const DURATION = 2000;

export default class Toast {
  constructor(text) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = text;
    this.node = toast;
  }

  show() {
    // すべて消す
    [...document.querySelectorAll('.toast')].forEach(node => {
      node.remove();
    });

    document.querySelector('body').appendChild(this.node);
    this.node.classList.add('show');
    setTimeout(() => {
      this.node.remove();
    }, DURATION);
  }
}
