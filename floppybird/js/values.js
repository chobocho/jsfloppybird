let cvs;
let canvas;

let bufCanvas;
let bufCtx;

let startX = 0;
let floppybird;
let drawEngine;
let gameEngine;

let LoadImage = function (image_name) {
  var load_image = new Image();
  load_image.src = image_name;
  return load_image;
}
