let customFont;
let magnetA, magnetB; // positions of magnets A and B on the x-axis (world coordinates)
let spherePos;       // position of sphere X on the x-axis (world coordinates)
let initialDashedX;  // the fixed x-coordinate for the dashed line, captured at startup

let draggingA = false, draggingB = false;
let offsetA = 0, offsetB = 0; // offset between a magnet’s position and the mouse when pressed

function preload() {
  customFont = loadFont("Arial.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(customFont);
  textSize(16);
  textAlign(CENTER, CENTER);
  
  // Initialize positions (world coordinates)
  magnetA = -100;
  spherePos = 0;
  magnetB = 200;
  
  // Capture the initial center of sphere X for the dashed line.
  initialDashedX = spherePos;
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
}

function draw() {
  background(0);
  
  // Allow scene orbiting if not dragging either magnet
  if (!(draggingA || draggingB)) {
    orbitControl();
  }
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // Constrain sphere X so that it does not overlap the magnets
  let minX = magnetA + 55;
  let maxX = magnetB - 80;
  spherePos = constrain(spherePos, minX, maxX);

  push();
    // Draw magnet A with a metallic effect
    push();
      translate(magnetA, 0, 0);
      stroke(0);
      strokeWeight(2);
      shininess(50);
      specularMaterial(200);
      box(50);
      // Draw label A above the object
      push();
        translate(0, -35, 0);
        noStroke();
        fill(255);
        text("A", 0, 0);
      pop();
    pop();

    // Draw magnet B with a metallic effect
    push();
      translate(magnetB, 0, 0);
      stroke(0);
      strokeWeight(2);
      shininess(100);
      specularMaterial(220);
      box(100);
      // Draw label B above the object
      push();
        translate(0, -60, 0);
        noStroke();
        fill(255);
        text("B", 0, 0);
      pop();
    pop();

    // Draw sphere X
    push();
      translate(spherePos, 0, 0);
      noStroke();
      fill(255, 0, 0);
      sphere(30);
      // Draw label X above the sphere
      push();
        translate(0, -40, 0);
        noStroke();
        fill(255);
        text("X", 0, 0);
      pop();
    pop();

    // Draw the fixed dashed line:
    // It will be drawn at the initial center of X (initialDashedX)
    push();
      translate(initialDashedX, 0, 0);
      stroke(0, 255, 0);
      strokeWeight(1); // thinner dashed line
      // Use smaller dash segments for a finer dashed line
      let dashLength = 5;
      let gapLength = 5;
      for (let y = -200; y < 200; y += dashLength + gapLength) {
        line(0, y, 0, 0, y + dashLength, 0);
      }
    pop();
  pop();
}

function mousePressed() {
  // Convert mouseX from screen coordinates to world coordinates (WEBGL's origin is at the center)
  let worldX = mouseX - width / 2;
  
  // Check whether the mouse press is within magnet A's active area (approx. half-width = 25)
  if (abs(worldX - magnetA) < 25) {
    draggingA = true;
    offsetA = magnetA - worldX;
  } 
  // Else, check for magnet B (approx. half-width = 50)
  else if (abs(worldX - magnetB) < 50) {
    draggingB = true;
    offsetB = magnetB - worldX;
  }
}

function mouseDragged() {
  let worldX = mouseX - width / 2;
  
  // Update magnet A when dragging, keeping its initial offset
  if (draggingA) {
    let newMagnetA = worldX + offsetA;
    if (newMagnetA > magnetB - 10) {
      newMagnetA = magnetB - 10;
    }
    let deltaA = newMagnetA - magnetA;
    magnetA = newMagnetA;
    // Adjust sphere X accordingly (moves oppositely to A's delta)
    spherePos = spherePos - deltaA;
  }
  
  // Update magnet B when dragging, keeping its initial offset
  if (draggingB) {
    let newMagnetB = worldX + offsetB;
    if (newMagnetB < magnetA + 10) {
      newMagnetB = magnetA + 10;
    }
    let deltaB = newMagnetB - magnetB;
    magnetB = newMagnetB;
    spherePos = spherePos - deltaB;
  }
}

function mouseReleased() {
  draggingA = false;
  draggingB = false;
}