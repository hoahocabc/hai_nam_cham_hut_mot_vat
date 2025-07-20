let customFont;
let magnetA, magnetB; // Vị trí của nam châm A và B trên trục x (world coordinates)
let spherePos;       // Vị trí của quả cầu X trên trục x (world coordinates)

let draggingA = false, draggingB = false;
let offsetA = 0, offsetB = 0; // Offset giữa vị trí nam châm và vị trí chuột khi bấm

function preload() {
  customFont = loadFont("Arial.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(customFont);
  textSize(16);
  textAlign(CENTER, TOP);
  
  // Khởi tạo các vị trí ban đầu (world coordinates)
  magnetA = -100;
  spherePos = 0;
  magnetB = 200;
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
}

function draw() {
  background(0);
  
  // Cho phép xoay cảnh nếu không đang kéo nam châm
  if (!(draggingA || draggingB)) {
    orbitControl();
  }
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // Ràng buộc vị trí X của quả cầu X để không cho phép nó va chạm vào nam châm
  let minX = magnetA + 55;
  let maxX = magnetB - 80;
  spherePos = constrain(spherePos, minX, maxX);

  push();
    // Vẽ magnet A với hiệu ứng ánh kim (metallic effect)
    push();
      translate(magnetA, 0, 0);
      stroke(0);
      strokeWeight(2);
      // Hiệu ứng ánh kim cho A
      shininess(50);
      specularMaterial(200);
      box(50);
      push();
        translate(0, 35, 0);
        noStroke();
        // Dùng fill đơn giản cho chữ để nổi bật
        fill(255);
        text("A", 0, 0);
      pop();
    pop();

    // Vẽ magnet B với hiệu ứng ánh kim (metallic effect)
    push();
      translate(magnetB, 0, 0);
      stroke(0);
      strokeWeight(2);
      // Hiệu ứng ánh kim mạnh hơn cho B
      shininess(100);
      specularMaterial(220);
      box(100);
      push();
        translate(0, 60, 0);
        noStroke();
        fill(255);
        text("B", 0, 0);
      pop();
    pop();

    // Vẽ quả cầu X (giữ nguyên, không cần hiệu ứng ánh kim)
    push();
      translate(spherePos, 0, 0);
      noStroke();
      fill(255, 0, 0);
      sphere(30);
      push();
        translate(0, 40, 0);
        noStroke();
        fill(255);
        text("X", 0, 0);
      pop();
    pop();
  pop();
}

function mousePressed() {
  // Chuyển đổi mouseX từ tọa độ màn hình sang world coordinate (WEBGL có gốc ở giữa)
  let worldX = mouseX - width / 2;
  
  // Kiểm tra xem chuột có bấm vào vùng tác dụng của nam châm A (bán kích thước ~25) hay không
  if (abs(worldX - magnetA) < 25) {
    draggingA = true;
    offsetA = magnetA - worldX;
  } 
  // Kiểm tra cho B (bán kích thước ~50)
  else if (abs(worldX - magnetB) < 50) {
    draggingB = true;
    offsetB = magnetB - worldX;
  }
}

function mouseDragged() {
  let worldX = mouseX - width / 2;
  
  // Cập nhật vị trí của nam châm A khi kéo, giữ nguyên offset ban đầu
  if (draggingA) {
    let newMagnetA = worldX + offsetA;
    // Đảm bảo A không vượt qua B
    if (newMagnetA > magnetB - 10) {
      newMagnetA = magnetB - 10;
    }
    let deltaA = newMagnetA - magnetA;
    magnetA = newMagnetA;
    // Di chuyển quả cầu X theo hướng đối lập delta của A
    spherePos = spherePos - deltaA;
  }
  
  // Cập nhật vị trí của nam châm B khi kéo, giữ nguyên offset ban đầu
  if (draggingB) {
    let newMagnetB = worldX + offsetB;
    // Đảm bảo B không vượt qua A
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