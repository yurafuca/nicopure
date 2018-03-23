export class Loading {
  constructor(dom) {
    this.dom = dom;
  }

  start() {
    this.dom.addClass('nowloading');
  }

  done() {
    this.dom.removeClass('nowloading');
  }
}
