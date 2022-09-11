function OnDraw() {
  gameEngine.increaseTick();
  drawEngine.OnDraw();
}

function processEvent(code) {
  printf("[Main] processEvent: ", code);
  switch (code) {
    case SPACE_KEY:
    case ARROW_UP_KEY:
      printf("[Main] processEvent: ", "UP");
      gameEngine.moveUp();
      break;
    case ESC_KEY:
    case P_KEY:
      printf("[Main] processEvent: ", "Pause");
      gameEngine.pause();
      break;
    case S_KEY:
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

function getMousePosition(event) {
  let mx = event.pageX - canvas.offsetLeft;
  let my = event.pageY - canvas.offsetTop;
  return { x: mx, y: my };
}

function processMouseEvent(x, y) {
  let code = drawEngine.getEventCode(x, y);
  printf("[Main] processMouseEvent: ", "(" + x + ", " + y + ") -> " + code);
  processEvent(code);
}

function mouseListener(event) {
  switch (event.type) {
    case "mousedown":
      break;
    case "mousemove":
      break;
    case "mouseup":
      let pos = getMousePosition(event)
      processMouseEvent(pos.x, pos.y);
      break;
    case "mouseout":
      break;
  }
}

function InitValue() {
  scoreDB = new LocalDB();
  floppybird = new FloppyBird(100, 200, scoreDB.getScore());
  floppybird.init();
  gameEngine = new GameEngine(floppybird, scoreDB);
  drawEngine = new DrawEngine(floppybird);

  window.onkeydown = KeyPressEvent;

  canvas.addEventListener("mousedown", mouseListener);
  canvas.addEventListener("mousemove", mouseListener);
  canvas.addEventListener("mouseout", mouseListener);
  canvas.addEventListener("mouseup", mouseListener);
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
