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

  alpha: 5,
  alphaMax: 100,
  alphaMin: 2,
   
  cosIndex: 0.5,
  cosIndexMin: 0,
  cosIndexMax: 2,
  cosIndexStep: 0.5,

  noiseScale: 0.01,
  noiseScaleMin: 0.01,
  noiseScaleMax: 0.5,
  noiseScaleStep: 0.01,

  presets: ['Chaos', 'Upside Down', 'Windy'],

 
  
};

// Params for logging
let loggingParams = {
  targetDrawingParams: document.getElementById('drawingParams'),
  targetCanvasParams: document.getElementById('canvasParams'),
  state: false
};



/* ###########################################################################
Classes
############################################################################ */



/* ###########################################################################
Custom Functions
############################################################################ */


/* ###########################################################################
P5 Functions
############################################################################ */

//Variables
var song;
var totalNumber;
var particles = [];
var noiseScale;
var alpha;
let currentPreset = false;
let sketchGUI;


function preload(){
  soundFormats('mp3');
  song = loadSound('Music/Forever.mp3');
}

function onCanvas(c){
  return c.x >= 0 && c.x <= width && c.y >= 0 && c.y <= height;
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
  frameRate(20);
  smooth();
    

  // GUI Management
  if (canvasParams.gui) { 
    sketchGUI = createGui('Params');
    sketchGUI.addObject(drawingParams);
  }

  // Anything else
 
  stroke(random(0, 255), random(0, 255), random(0, 255));
  totalNumber = 5000;
  alpha =  drawingParams.alpha;
  noiseScale = drawingParams.noiseScale;


  //Create Particles
  for(i = 0; i < totalNumber; i++){
    particles.push(createVector(random(0, width), random(0, height)))
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
  background(0, 0, 10, alpha);

  //Presets
 
  if (drawingParams.presets !== currentPreset) { 
       currentPreset = drawingParams.presets;
       if (drawingParams.presets === 'Chaos') { 
          sketchGUI.update('cosIndex', 0.5);
      } else if (drawingParams.presets === 'Upside Down') { 
         sketchGUI.update('cosIndex', 0);
      } else if (drawingParams.presets === 'Windy') { 
        sketchGUI.update('cosIndex', 2); 
      }
    }
  
  
  
  // Additional background mask
  push();
  stroke(0, 0, 10);
  strokeWeight(width/2);
  noFill();
  ellipse(width/2, height/2, height + height/5, height + height/5);
  pop(); 


  //Particel Flow
  push();
  for(i = 0; i < totalNumber; i++){
    let allPoints = particles[i];
    point(allPoints.x, allPoints.y);
    let n = noise(allPoints.x * drawingParams.noiseScale, allPoints.y * drawingParams.noiseScale);
    let moveDirectios = TWO_PI * n ;
    allPoints.x += cos(moveDirectios) * drawingParams.cosIndex;
    allPoints.y += sin(moveDirectios) * 0.5;

    if(!onCanvas(allPoints)){
      allPoints.x = random(0, width);
      allPoints.y = random(0, height);
    }
  }
  pop();

 
  // Text box
  push()
  fill(0, 0, 10)
  noStroke()
  rectMode(CENTER)
  rect(width/2, 465, 150, 15);
  noStroke()
  textAlign(CENTER)
  textFont("Tahoma");
  textSize(10)
  fill(255);
  text("For more Colors, Click the Mouse", width/2, 470);
  text("For sound on/off, press q/w", width/2, 485);
  pop();
  

}

function mouseReleased() {
  stroke(random(0, 255), random(0, 255), random(0, 255));
  noiseSeed(millis());
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







function mouseDragged() {}



function keyReleased() {
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