class DrawEngine extends Observer {
  constructor(game) {
    super();
    this.game = game;
    this.game.register(this);
    this._InitValue();
    this._LoadImage();
  }

  _InitValue() {
    this.background_image = 0;
  }

  _LoadImage() {
    let root = "./img";

    this.background = [];
    this.background[0] = LoadImage(root + "/background01.jpg");
    this.background[1] = LoadImage(root + "/background02.jpg");
    this.background[2] = LoadImage(root + "/background03.png");
    this.background[3] = LoadImage(root + "/background04.png");
    this.background[4] = LoadImage(root + "/background05.png");
    this.background[5] = LoadImage(root + "/background06.png");

    this.buttonImage = {};
    this.buttonImage['score'] = LoadImage(root + "/score.png");
    this.buttonImage['0'] = LoadImage(root + "/sn00.png");
    this.buttonImage['1'] = LoadImage(root + "/sn01.png");
    this.buttonImage['2'] = LoadImage(root + "/sn02.png");
    this.buttonImage['3'] = LoadImage(root + "/sn03.png");
    this.buttonImage['4'] = LoadImage(root + "/sn04.png");
    this.buttonImage['5'] = LoadImage(root + "/sn05.png");
    this.buttonImage['6'] = LoadImage(root + "/sn06.png");
    this.buttonImage['7'] = LoadImage(root + "/sn07.png");
    this.buttonImage['8'] = LoadImage(root + "/sn08.png");
    this.buttonImage['9'] = LoadImage(root + "/sn09.png");
    this.buttonImage['tile_top'] = LoadImage(root + "/tile01.png");
    this.buttonImage['tile_down'] = LoadImage(root + "/tile02.png");
    this.buttonImage['tile_body'] = LoadImage(root + "/tile03.png");
    this.buttonImage['coin'] = LoadImage(root + "/coin.png");
    this.buttonImage['start'] = LoadImage(root + "/start.png");
    this.buttonImage['resume'] = LoadImage(root + "/resume.png");
    this.buttonImage['pause'] = LoadImage(root + "/pause.png");

    this.birdImage = [];
    this.birdImage[0] = LoadImage(root + "/bird01.png");
    this.birdImage[1] = LoadImage(root + "/bird02.png");
    this.birdImage[2] = LoadImage(root + "/bird03.png");
    this.birdImage[3] = LoadImage(root + "/bird04.png");

    printf("[DrawEngine]", "_LoadImage");
  }

  OnDraw() {
    let image = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5];
    if (this.game.level() > image.length) {
      this.background_image = 5;
    } else {
      this.background_image = image[this.game.level() - 1];
    }

    bufCtx.beginPath();
    this._drawBoard();
    this._drawPillar();
    this._drawEnergy();
    this._drawScore();
    this._drawBird();
    this._drawButton();
    bufCtx.closePath();
    bufCtx.stroke();

    cvs.clearRect(0, 0, canvas.width, canvas.height);
    cvs.drawImage(bufCanvas, 0, 0);
    // printf("[DrawEngine]", "OnDraw()");
  }

  _drawButton() {
    // printf("[DrawEngine] _drawButton() ", this.game.state());
    if (this.game.isIdleState()) {
      bufCtx.drawImage(this.buttonImage['start'], 250, 100, 300, 163);
      this._drawHighScore();
    } else if (this.game.isPauseState()) {
      bufCtx.drawImage(this.buttonImage['resume'], 300, 100, 200, 100);
      this._drawHighScore();
    }  else if (this.game.isGameOverState()) {
      bufCtx.drawImage(this.buttonImage['start'], 250, 100, 300, 163);
      this._drawHighScore();
    }  else if (this.game.isPlayState()) {
      bufCtx.drawImage(this.buttonImage['pause'], 710, 510, 80, 80);
    }
  }

  _drawBird() {
    bufCtx.drawImage(this.birdImage[this.game.tick()%4], this.game.x(), this.game.y(), 60, 51);
  }

  _drawPillar() {
    let coin = this.game.coin();
    let pillar = this.game.pillar();

    for (let i = 0; i < pillar.length; i++) {
      let p = pillar[i];
      let x = p[0];

      if (x > 800) {
        continue;
      }

      for (let j = 0; j < p[1]; j++) {
        bufCtx.drawImage(this.buttonImage['tile_body'], x, j * 60, 60, 60);
      }
      bufCtx.drawImage(this.buttonImage['tile_top'], x, p[1] * 60, 60, 60);

      for (let j = 0; j < p[2]; j++) {
        bufCtx.drawImage(this.buttonImage['tile_body'], x, 540 - j*60, 60, 60);
      }
      bufCtx.drawImage(this.buttonImage['tile_down'], x, 540 - p[2]*60, 60, 60);

      if (coin[i][0] > 0)
          bufCtx.drawImage(this.buttonImage['coin'], coin[i][0], coin[i][1] * 60, 60, 60);
    }
  }

  _drawEnergy() {
    // printf("[DrawEngine] _drawScore()", this.game.score());
    let code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let energy = this.game.energy();
    let pos = 3;
    let blockSize = 30;
    let startX = 500-blockSize*0.6*pos;
    let startY = 10;

    // printf("[DrawEngine] _drawScore()", startX + ", " + startY);

    if (energy < 80) {
      bufCtx.fillStyle = '#FF000055';
      bufCtx.fillRect(startX, startY, 120, blockSize);
    }

    bufCtx.drawImage(this.buttonImage[code[energy%10]], startX + blockSize * 0.6 * pos, startY, blockSize * 0.6, blockSize);
    while (energy > 0) {
      bufCtx.drawImage(this.buttonImage[code[energy%10]], startX + blockSize * 0.6 * pos, startY, blockSize * 0.6, blockSize);
      energy = Math.floor(energy / 10);
      pos--;
    }
  }


  _drawScore() {
    // printf("[DrawEngine] _drawScore()", this.game.score());
    let code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let score = this.game.score();
    let pos = 7;
    let blockSize = 30;
    let startX = 780-blockSize*0.6*pos;
    let startY = 10;

    // printf("[DrawEngine] _drawScore()", startX + ", " + startY);

    bufCtx.drawImage(this.buttonImage['score'], startX-120, 10, 120, blockSize);
    bufCtx.drawImage(this.buttonImage[code[score%10]], startX + blockSize * 0.6 * pos, startY, blockSize * 0.6, blockSize);
    while (score > 0) {
      bufCtx.drawImage(this.buttonImage[code[score%10]], startX + blockSize * 0.6 * pos, startY, blockSize * 0.6, blockSize);
      score = Math.floor(score / 10);
      pos--;
    }
  }

  _drawHighScore() {
    // printf("[DrawEngine] _drawHighScore()", this.game.highScore());
    let code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let highScore = this.game.highScore();
    let pos = 8;
    let blockSize = 60;
    let startX = (780-blockSize*pos)/2;
    let startY = 300;

    bufCtx.fillStyle = '#FFFF0022';
    bufCtx.fillRect(startX, startY, blockSize*pos, blockSize);
    pos--;
    bufCtx.drawImage(this.buttonImage[code[highScore%10]], startX + blockSize * pos, startY, blockSize, blockSize);
    while (highScore > 0) {
      bufCtx.drawImage(this.buttonImage[code[highScore%10]], startX + blockSize * pos, startY, blockSize, blockSize);
      highScore = Math.floor(highScore / 10);
      pos--;
    }
  }

  _drawBoard() {
    // printf("[DrawEngine] _drawBoard()", this.background_image);
    this._drawBackground();
  }

  _drawBackground() {
    bufCtx.drawImage(this.background[this.background_image], 0, 0, canvas.width, canvas.height);
  }

  getEventCode(x, y) {
    printf("[DrawEngine] getEventCode() ", this.game.state() + " (" + x + ", " + y + ")");
    if (this.game.isIdleState()) {
      if (x > 250 && x < 250+300 && y > 100 && y < 100+163) {
        return S_KEY;
      }
    } else if (this.game.isPauseState()) {
      if (x > 300 && x < 300+200 && y > 100 && y < 100+100) {
        return S_KEY;
      }
    }  else if (this.game.isGameOverState()) {
      if (x > 250 && x < 250+300 && y > 100 && y < 100+163) {
        return S_KEY;
      }
    }  else if (this.game.isPlayState()) {
      if (x > 710 && x < 710+80 && y > 510 && y < 510+80) {
        return P_KEY;
      }
      return SPACE_KEY;
    }
    return SPACE_KEY;
  }
}
