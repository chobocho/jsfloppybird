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
    let root = "img";

    this.background = [];
    this.background[0] = LoadImage(root + "/background01.jpg");
    this.background[1] = LoadImage(root + "/background02.jpg");
    this.background[2] = LoadImage(root + "/background03.png");
    this.background[3] = LoadImage(root + "/background04.png");
    this.background[4] = LoadImage(root + "/background05.png");
    this.background[5] = LoadImage(root + "/background06.png");

    this.play_image = LoadImage(root + "/start.png");
    this.pause_image = LoadImage(root + "/pause.png");

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

    this.birdImage = [];
    this.birdImage[0] = LoadImage(root + "/bird01.png");
    this.birdImage[1] = LoadImage(root + "/bird02.png");
    this.birdImage[2] = LoadImage(root + "/bird03.png");
    this.birdImage[3] = LoadImage(root + "/bird04.png");

    printf("[DrawEngine]", "_LoadImage");
  }

  OnDraw() {
    let image = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5];
    this.background_image = image[(this.game.level() - 1) % this.background.length];

    bufCtx.beginPath();
    this._drawBoard();
    this._drawPillar();
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

  _drawScore() {
    // printf("[DrawEngine] _drawScore()", this.game.score());
    let code = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
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

  _drawBoard() {
    // printf("[DrawEngine] _drawBoard()", this.background_image);
    this._drawBackground();
  }

  _drawBackground() {
    bufCtx.drawImage(this.background[this.background_image], 0, 0, canvas.width, canvas.height);
  }
}
