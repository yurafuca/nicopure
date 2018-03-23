export default class Controller {
  constructor(player) {
    this.element = document.querySelector('#controller');
    this.player = player;
    this._init();
  }

  _init() {
    const play = this.element.querySelector('.play');
    play.addEventListener('click', () => {
      if (play.classList.contains('pause')) {
        this.player.pause();
      } else {
        this.player.play();
      }
      play.classList.toggle('play');
      play.classList.toggle('pause');
    });

    const prev = this.element.querySelector('.prev');
    prev.addEventListener('click', () => {
      this.player.replay();
    });

    const next = this.element.querySelector('.next');
    next.addEventListener('click', () => {
      this.player.next();
    });
  }
}
