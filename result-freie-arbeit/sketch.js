/*jshint esversion: 6 */

/* ############################################################################ 

Kurs «Generative Gestaltung» an der TH Köln
Christian Noss
christian.noss@th-koeln.de
https://twitter.com/cnoss
https://cnoss.github.io/generative-gestaltung/

############################################################################ */


let saveParams = {
  sketchName: "gg-sketch"
}


// Params for canvas
let canvasParams = {
  holder: document.getElementById('canvas'),
  state: false,
  mouseX: false,
  mouseY: false,
  mouseLock: false,
  background: 0,
  gui: true,
  mode: 'canvas', // canvas or svg … SVG mode is experimental 
};
getCanvasHolderSize();

// Params for the drawing
let drawingParams = {

  alpha: 0.3,
  alphaStep: 0.1,
  waveFade: 70,
  waveFadeMin: 50,
  waveFadeMax: 90,
  sunset: false,
  
  
  
};

// Params for logging
let loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};



/// Variables
let number = 40;
let posY = new Array(number);
let posY2 = new Array(number);
let weight = 0;
let img;
let move;
let posX;
let song;
let hue;
let go;
let yoff;
let noiseY;
let noiseSpeed;
let noiseHeight;
let offsetY;






/* ###########################################################################
Classes
############################################################################ */



/* ###########################################################################
Custom Functions
############################################################################ */

function setImage(loadedImageFile) {
  img = loadedImageFile;
  img.resize(300, 0);
}


/* ###########################################################################
P5 Functions
############################################################################ */

function preload() {
  
  loadImage('Image/birds-03.png', setImage);
  soundFormats('mp3');
  song = loadSound('Music/chill.mp3');
  
}

function setup() {

  let canvas;
  if (canvasParams.mode === 'svg') {
    canvas = createCanvas(canvasParams.w, canvasParams.h, SVG);
  } else { 
    canvas = createCanvas(canvasParams.w, canvasParams.h);
    canvas.parent("canvas");
  }

  // Display & Render Options
  frameRate(25);
  smooth();
  
  

  // GUI Management
  if (canvasParams.gui) { 
    let sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
    //noLoop();
  }

  // Anything else
  colorMode(HSB, 360, 100, 100, 100);
  for (let n = 0; n < number ; n++){
    posY[n] = height / number*n;
  }


  // Variable Initialisation
  weight = height/number/2;
  move = height/2;
  posX = width/2 - 100;
  hue = 14;
  yoff = 0.0;
  noiseY = height-35;
  noiseSpeed = 0.02;
  noiseHeight = 20;
  move = height/2-50;
 
}




/*function wave (){
   
  beginShape();
  stroke(203, 100, 68);
  let xoff = 0; 
  for (let x = 0; x <= width; x += 10) {
    let y = map(noise(xoff, yoff), 0, 1, 450, 500);
    vertex(x, y);
    xoff += 0.05;
  }
  
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

}*/




function newWave(){
  for (let j = 0; j < 3; j++) {
    let offsetY = j * 60;
    noFill();
    stroke(240, 100, 60, drawingParams.waveFade);
    strokeWeight(height / 2);
    beginShape();
    curveVertex(0, height / 2);
    for (let i = 0; i < width; i += 50) {
      let y = noise(frameCount * noiseSpeed + i + j) * noiseHeight + noiseY + offsetY;
      curveVertex(i, y);
    }
    curveVertex(width, height / 2);
    endShape(LINES);
  }
}



function draw() {

  /* ----------------------------------------------------------------------- */
  // Log globals
  if (!canvasParams.mouseLock) {
    canvasParams.mouseX = mouseX;
    canvasParams.mouseY = mouseY;
    logInfo();
  }

  /* ----------------------------------------------------------------------- */
  // Provide your Code below
  
  background(340, 32, 100, drawingParams.alpha);
  
  
  //Sun
  for (let n = 0; n < number ; n++){
    const fade = map (posY[n], 0, height, 255, 20);
    const day = map (posY[n], 0, height/2, 35, 1);
    stroke(day, 89, fade);
    strokeWeight(weight);
    line (100, posY[n], 400, posY[n]);
    posY[n] += 0.5;
      if (posY[n] > height){
         posY[n] = 0;
      }
  }

 
  
  //Sky
  stroke(340, 32, 100);
  strokeWeight(height/2);
  noFill();
  ellipse(width/2, move, height + height/15, height + height/15);

  //Sunset
  if (drawingParams.sunset){
    if(move < height/2 + 80){
      move+=0.2;
     }else{
       move = move; 
     }
  }


// Birds
image (img, posX, 200);
posX -= 0.2;
if (posX < -140){
  posX = width - 100;
}



newWave();


 // Text box
 push()
 noStroke()
 textAlign(CENTER)
 textFont("Tahoma");
 textSize(9)
 fill(340, 32, 100);
 text("  For Sound On / Off, please press Q / W", width/2, 490);
 pop();


    

}



function keyPressed() {

  if (keyCode === 81) { // Q-Key
    song.play();
    
  }

  if (keyCode === 87) { // W-Key
    song.stop();
    
  }

  if (keyCode === 89) { // Y-Key
  }

  if (keyCode === 88) { // X-Key
    
  }

  if (keyCode === 83) { // S-Key
    let suffix = (canvasParams.mode === "canvas") ? '.jpg' : '.svg';
    let fragments = location.href.split(/\//).reverse().filter(fragment => {
      return (fragment.match !== 'index.html' && fragment.length > 2) ? fragment : false;
    });
    let suggestion = fragments.shift();
  
    let fn = prompt(`Filename for ${suffix}`, suggestion);
    save(fn + suffix);
  }

  if (keyCode === 49) { // 1-Key
  }

  if (keyCode === 50) { // 2-Key
  }

  if (keyCode === 76) { // L-Key
    if (!canvasParams.mouseLock) {
      canvasParams.mouseLock = true;
    } else { 
      canvasParams.mouseLock = false;
    }
    document.getElementById("canvas").classList.toggle("mouseLockActive");
  }


}



function mousePressed() {}



function mouseReleased() {}



function mouseDragged() {}



function keyReleased() {
  stroke(random(0, 255), random(0, 255), random(0, 255));
  noiseSeed(millis());
  if (keyCode == DELETE || keyCode == BACKSPACE) clear();
}


/* ###########################################################################
Service Functions
############################################################################ */



function getCanvasHolderSize() {
  canvasParams.w = canvasParams.holder.clientWidth;
  canvasParams.h = canvasParams.holder.clientHeight;
}



function resizeMyCanvas() {
  getCanvasHolderSize();
  resizeCanvas(canvasParams.w, canvasParams.h);
}



function windowResized() {
  resizeMyCanvas();
}



function logInfo(content) {

  if (loggingParams.targetDrawingParams) {
    loggingParams.targetDrawingParams.innerHTML = helperPrettifyLogs(drawingParams);
  }

  if (loggingParams.targetCanvasParams) {
    loggingParams.targetCanvasParams.innerHTML = helperPrettifyLogs(canvasParams);
  }

}

