function OnDraw() {
  gameEngine.increaseTick();
  drawEngine.OnDraw();
}

function processEvent(code) {
  printf("[Main] processEvent: ", code);
  switch (code) {
    case 32:
    case 38:
      printf("[Main] processEvent: ", "UP");
      gameEngine.moveUp();
      break;
    case 27:
    case 80:
      printf("[Main] processEvent: ", "Pause");
      gameEngine.pause();
      break;
    case 83:
      printf("[Main] processEvent: ", "Start");
      gameEngine.start();
      break;
    default:
      break;
  }
}

function KeyPressEvent(e) {
  processEvent(e.keyCode);
}

function InitValue() {
  scoreDB = new LocalDB();
  floppybird = new FloppyBird(100, 200, scoreDB.getScore());
  floppybird.init();
  gameEngine = new GameEngine(floppybird, scoreDB);
  drawEngine = new DrawEngine(floppybird);

  window.onkeydown = KeyPressEvent;
}

function InitCanvas() {
  canvas = document.getElementById("canvas");
  let log_msg = "Width: " + canvas.width + " Height: " + canvas.height;
  printf("[main]", log_msg);
  canvas.width = 800;
  canvas.height = 600;
  cvs = canvas.getContext("2d");
  // log_msg = "Width: " + canvas.width + " Height: " + canvas.height;
  // printf("[main]", log_msg);

  bufCanvas = document.createElement("canvas");
  bufCanvas.width = canvas.width;
  bufCanvas.height = canvas.height;
  bufCtx = bufCanvas.getContext("2d");

  log_msg = "S: Start / SPACE, Up arrow: Jump / ESC, P: Pause  ";
  log_msg += "[" + bufCanvas.width + "x" + bufCanvas.height + "]";
  printf("[main] bufCtx", log_msg);
  document.getElementById("message").innerHTML = log_msg;
}

const onLoadPage = function onLoadPageFnc() {
  InitCanvas();
  InitValue();
  setInterval(OnDraw, 33);
  //setTimeout(function () { OnDraw() }, 300);
}

window.onload = onLoadPage;
