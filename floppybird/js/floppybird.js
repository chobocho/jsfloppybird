class Observer {
  constructor() {
  }

  /**
   * 0: INIT_STATE
   * 1: IDLE
   * 2: PLAY
   * 3: PAUSE
   * 4: GAME OVER
   */
  update(state) {
    console.log("Observer update: ", state);
  }
}

class Pillar {
  constructor() {
    this._pillars = [];
    this._coins = [];
  }

  init() {
    this._coins = [[0, 0]];
    this._pillars= [[200, 0, 0]];

    for (let i = 0; i < 4; ++i) {
      let down = getRandomInt(0, 5);
      let top = getRandomInt(0, 5 - down);
      this._pillars.push([400 + i * 200, top, down])
      if (i < 3)
        this._coins.push([0, top + Math.floor((9-top-down)/2)]);
      else
        this._coins.push([400 + i * 200, top + Math.floor((9 - top - down) / 2)]);
    }
  }

  move(speed=1) {
    printf("[Pillar] ", "Speed:" + speed);

    for (let i = 0; i < this._pillars.length; i++) {
      this._pillars[i][0] -= speed;
    }

    for (let i = 0; i < this._coins.length; i++) {
      this._coins[i][0] -= speed;
    }

    if (this._pillars[0][0] < -60)
        this._make_new_pillar(speed);

  }

  _make_new_pillar(gameSpeed=1) {
    this._pillars.splice(0, 1);
    let speed = gameSpeed > 5 ? gameSpeed * 2 : gameSpeed;
    let gap = speed * 2 > 100 ? 100 : Math.floor(speed * 2);
    let px = this._pillars[3][0] + 250 + getRandomInt(gap, 120 + gap);

    let block = [5, 5, 5, 5, 5, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
    let block_count = speed < 15 ? block[Math.floor(speed)] : 3;
    let down = getRandomInt(0, block_count);
    let top = getRandomInt(0, block_count - down);
    this._pillars.push([px, top, down]);

    this._coins.splice(0, 1);
    let coin_y = top+Math.floor((9-top-down)/2);
    let coin_x = getRandomInt(0, 10) > 6 ? px : -1;
    this._coins.push([coin_x, coin_y])
  }

  pillar() {
    return this._pillars;
  }

  coin() {
    return this._coins;
  }

  removeFirstCoin() {
    this._coins[0][0] = -1;
  }
}

class Energy {
  constructor() {
    this._energy = 100;
  }

  init() {
    this._energy = 100;
  }

  energy() {
    return this._energy;
  }

  increase(value) {
    this._energy += value;
    this._energy = this._energy > 100 ? 100 : this._energy;
  }

  decrease(value) {
    this._energy -= value;
    this._energy = this._energy < 0 ? 0 : this._energy;
  }
}

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
    this._score = new Score(highscore);
    this._energy = new Energy();
    this._pillar = new Pillar();
    this._state = this.IDLE_STATE;
    this.observer = [];
  }

  init() {
    this._level = 1;
    this._tick = 0;
    this._space_click_count = 0;
    this._x = this._startX;
    this._y = this._startY;
    this._score.init();
    this._pillar.init();
    this._energy.init();
    this._state = this.IDLE_STATE;
  }

  register(observer) {
    //this.observer.push(observer);
    //observer.update(this.state.get());
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
    this._y -= (this.JUMP + acceleration);
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

  tick() {
    return this._tick;
  }

  increaseTick() {
    this._tick++;
    if (this._tick > 30) {
      this._tick = 0;
      this._energy.decrease(1);
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

  coin() {
    return this._pillar.coin();
  }

  upCollision(x1, x2, y) {
    if (this._x + this.core_rect[2] < x1)
        return false;
    if (this._x + this.core_rect[0] > x2)
        return false;
    if (this._y + this.core_rect[1] > y)
        return false;
    return true;
  }

  downCollision(x1, x2, y) {
    if (this._x + this.core_rect[2] < x1)
      return false;
    if (this._x + this.core_rect[0] > x2)
      return false;
    if (this._y + this.core_rect[3] < y)
      return false;
    return true;
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
        this._state = this.GAME_OVER_STATE;
        return false;
      }
    }
    return true;
  }

  checkGetCoin() {
     let coins = this.coin();
     if (this.upCollision(coins[0][0], coins[0][0] + 60, coins[0][1] * 60)
       || this.downCollision(coins[0][0], coins[0][0] + 60, coins[0][1] * 60 + 60)) {
       this._pillar.removeFirstCoin();
       this._score.increase(2022);
       this._energy.increase(48);
       printf("[Floppybird] ", "Get Coins");
     }
  }

  needToSaveScore() {
    return this._score.needToSave();
  }
}
