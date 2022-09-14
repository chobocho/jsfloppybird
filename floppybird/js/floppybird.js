class FloppyBird {
  constructor(startX, startY, highscore=0) {
    this.IDLE_STATE = 0;
    this.PLAY_STATE = 1;
    this.PAUSE_STATE = 2;
    this.GAME_OVER_STATE = 3;

    this.core_rect = [18, 14, 48, 32];

    this.JUMP = 60;
    this.GRAVITY = 3;
    this._bottom = 600;

    this._startX = startX;
    this._startY = startY;
    this._x = startX;
    this._y = startY;
    this._level = 1;
    this._tick = 0;
    this._space_click_count = 0;
    this._shield = new Shield();
    this._score = new Score(highscore);
    this._energy = new Energy(this);
    this._items = new Item(this);
    this._pillar = new Pillar(this._items);
    this._state = this.IDLE_STATE;
  }

  init() {
    this._level = 1;
    this._tick = 0;
    this._space_click_count = 0;
    this._x = this._startX;
    this._y = this._startY;
    this._shield.init();
    this._score.init();
    this._pillar.init();
    this._energy.init();
    this._state = this.IDLE_STATE;
    this._shield.start();
  }

  shield() {
    return this._shield.energy();
  }

  moveDown(acceleration) {
    if (this._state !== this.PLAY_STATE) {
      return;
    }
    this._y += this.GRAVITY + acceleration;
    this._y = this._y < this._bottom ? this._y : this._bottom;
  }

  moveUp(acceleration) {
    if (this._state !== this.PLAY_STATE) {
      return;
    }

    offset = this.JUMP + acceleration;
    this._y -= offset;
    this._y = this._y > 0 ? this._y : 0;
    this._space_click_count++;
    if (this._space_click_count > 2) {
      this._energy.decrease(1);
      this._space_click_count = 0;
    }
  }

  moveRight(acceleration) {
    if (this._state !== this.PLAY_STATE) {
      return;
    }
    this._pillar.move(acceleration);
    this._items.move(acceleration);
  }

  start() {
    console.log("[FloppyBird] Start()" + this._state);
    if (this._state === this.PLAY_STATE) {
      return;
    }

    if (this._state === this.PAUSE_STATE || this._state === this.IDLE_STATE) {
      this._state = this.PLAY_STATE;
    } else if (this._state === this.GAME_OVER_STATE) {
      this.init();
      this._state = this.PLAY_STATE;
    }
  }

  pause() {
    if (this._state !== this.PLAY_STATE) {
      return;
    }
    console.log("Pause");
    this._state = this.PAUSE_STATE;
  }

  score() {
    printf("[FloppyBird]", this._score.score());
    return this._score.score();
  }

  increaseScore(score) {
    this._score.increase(score);
    this._level = Math.floor(this._score.score() / 10000) + 1;
  }

  highScore() {
    return this._score.highScore();
  }

  level() {
    return this._level;
  }

  increaseTick() {
    if (!this.isPlayState()) {
      return;
    }
    this._tick++;
    if (this._tick > 25) {
      this._tick = 0;
      this._energy.decrease(1);
    }
    if (this._shield.isAlive()) {
      this._shield.decrease(1);
    }
  }

  x() {
    return this._x;
  }

  y() {
    return this._y;
  }

  state() {
    return this._state;
  }

  isIdleState() {
    return this._state === this.IDLE_STATE;
  }

  isPlayState() {
    return this._state === this.PLAY_STATE;
  }

  isPauseState() {
    return this._state === this.PAUSE_STATE;
  }

  isGameOverState() {
    return this._state === this.GAME_OVER_STATE;
  }

  energy() {
    return this._energy.energy();
  }

  pillar() {
    return this._pillar.pillar();
  }

  item() {
    return this._items.item();
  }

  upCollision(x1, x2, y) {
    if (this._x + this.core_rect[2] < x1)
        return false;
    if (this._x + this.core_rect[0] > x2)
        return false;
    return this._y + this.core_rect[1] <= y;
  }

  downCollision(x1, x2, y) {
    if (this._x + this.core_rect[2] < x1)
      return false;
    if (this._x + this.core_rect[0] > x2)
      return false;
    return this._y + this.core_rect[3] >= y;
  }

  isAlive() {
    if (this._state !== this.PLAY_STATE) {
      return false;
    }
    if (this._energy.energy() === 0) {
      this._state = this.GAME_OVER_STATE;
      return false;
    }

    printf("[FloppyBird] isAlive()", this._x + ", " + this._y + this.core_rect[3]);
    if (this._y + this.core_rect[3] > this._bottom) {
      this._state = this.GAME_OVER_STATE;
      return false;
    }

    let p = this._pillar.pillar();

    for (let i = 0; i < p.length; i++) {
      if (this.upCollision(p[i][0], p[i][0] + 60, p[i][1] * 60 + 60)
        || this.downCollision(p[i][0], p[i][0] + 60, 540 - p[i][2] * 60)) {

        if (this._shield.isAlive()) {
          this._shield.decrease(1);
          return true;
        }

        this._state = this.GAME_OVER_STATE;
        return false;
      }
    }
    return true;
  }

  startShield() {
    this._shield.start();
  }

  checkGetItem() {
    let item = this._items.item();
    let itemType = item[0][2];
    printf("[Floppybird] ", "Get Items " + itemType);

    if (this.upCollision(item[0][0], item[0][0] + 60, item[0][1] * 60)
        || this.downCollision(item[0][0], item[0][0] + 60, item[0][1] * 60 + 60)) {
      this._items.removeFirstItem();
      let scoreTable = [0, 128, 1024, 2048, 3072];
      // None, Coin, RED, PINK, SHIELD
      let energyTable = [0, 3, 12, 32, 100];
      this._score.increase(scoreTable[itemType]);
      this._energy.increase(energyTable[itemType]);

      if (itemType === this._items.ITEM_SHIELD) {
        this.startShield();
      }

      printf("[Floppybird] ", "Get Items:" + itemType);
    }
  }

  needToSaveScore() {
    return this._score.needToSave();
  }
}
