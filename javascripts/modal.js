export default class Modal {
  constructor(params) {
    const { title, innerHTML, okText, calcelText, onClickOk, onClickOkArg } = params;

    const parser = new DOMParser();
    const node = parser
      .parseFromString(
        `
          <div id="modal" class="modal none">
            <div class="text">${title}</div>
            <div class="flex flex-horizontal-center">
              <span class="inner-child">${innerHTML}</span>
              <span class="btn btn-primary btn-sm save">${okText}</span>
            </div>
            <span class="btn btn-sm close">${calcelText}</span>
          </div>
        `,
        'text/html'
      )
      .childNodes[0].querySelector('body').childNodes[0];

    node.querySelector('.btn').addEventListener('click', () => {
      onClickOk(this.node, onClickOkArg);
      this.close();
    });

    node.querySelector('.close').addEventListener('click', () => {
      this.close();
    });

    this.node = node;

    return this;
  }

  open() {
    // すべて消す
    [...document.querySelectorAll('.modal')].forEach(node => {
      node.remove();
    });

    // 表示
    this.node.classList.remove('none');
    document.querySelector('body').appendChild(this.node);
  }

  close() {
    this.node.remove();
  }
}
