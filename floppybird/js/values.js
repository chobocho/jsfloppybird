let cvs;
let canvas;

let bufCanvas;
let bufCtx;

let floppybird;
let drawEngine;
let gameEngine;
let scoreDB;

let LoadImage = function (image_name) {
  var load_image = new Image();
  load_image.src = image_name;
  return load_image;
}
