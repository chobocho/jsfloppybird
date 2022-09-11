const ENTER_KEY = 13;
const ESC_KEY = 27;
const SPACE_KEY = 32;
const ARROW_UP_KEY = 38;
const P_KEY = 80;
const S_KEY = 83;

let cvs;
let canvas;

let bufCanvas;
let bufCtx;

let floppybird;
let drawEngine;
let gameEngine;
let scoreDB;

let offset = 0;
let isMobile = false;

let LoadImage = function (image_name) {
  let load_image = new Image();
  load_image.src = image_name;
  return load_image;
}
