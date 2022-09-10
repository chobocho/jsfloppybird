class GameEngine extends Observer {
  constructor(game) {
    super();
    this.game = game;
    this._reference_score = 20000;
    this._start_score = 19000;
  }

  tick() {
    return this.game.tick();
  }

  increaseTick() {
    if (!this.game.isPlayState()) {
      return;
    }

    this.game.increaseTick();
    let addition_score = 10 + getRandomInt(0, 8);
    this.game.increaseScore(addition_score);

    let score = this._start_score + this.game.score();
    let acceleration = score > this._reference_score ? (score - this._reference_score) / 10000 : 0;
    this.moveRight(acceleration);
    this.moveDown(acceleration);
    this.game.checkGetCoin();
  }

  moveUp() {
    printf("[GameEngine] moveUp()", "");
    if (!this.game.isPlayState()) {
      //return;
    }
    let score = this._start_score + this.game.score();
    let acceleration = score > this._reference_score ? (score - this._reference_score) / 5000 : 0;
    let gravity = [1, 1, 1, 1, 1, 1, 1, 1, 1.2, 1.5, 1.8, 2, 2.5, 2.5, 3, 3, 3, 3, 3];
    acceleration *= score < 150000 ? gravity[Math.floor(score / 10000)] : 3;
    this.game.moveUp(acceleration);
  }

  moveDown(acceleration) {
    this.game.moveDown(acceleration);
  }

  moveRight(acceleration) {
    this.game.moveRight(1+acceleration);
  }

  pause() {
    this.game.pause();
  }

  start() {
    this.game.start();
  }
}
