let customFont;
let magnetA, magnetB; // vị trí của nam châm A và B trên trục x (tọa độ thế giới)
let spherePos;       // vị trí của quả cầu X trên trục x (tọa độ thế giới)
let initialDashedX;  // tọa độ x cố định cho đường nét đứt, được ghi nhận khi khởi động

let draggingA = false, draggingB = false;
let offsetA = 0, offsetB = 0; // hiệu số giữa vị trí nam châm và chuột khi nhấn

let zoom = 1.0; // hệ số phóng to toàn cảnh

function preload() {
  customFont = loadFont("Arial.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  textFont(customFont);
  textSize(16);
  textAlign(CENTER, CENTER);
  
  // Khởi tạo vị trí (tọa độ thế giới)
  magnetA = -100;
  spherePos = 0;
  magnetB = 200;
  
  // Ghi nhận tâm ban đầu của X cho đường nét đứt.
  initialDashedX = spherePos;
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
}

function draw() {
  background(0);
  
  // Áp dụng zoom cho toàn cảnh.
  scale(zoom);
  
  // Cho phép xoay cảnh nếu không đang kéo nam châm
  if (!(draggingA || draggingB)) {
    // Reset ma trận để xoay cảnh một cách trực quan.
    resetMatrix();
    orbitControl();
    // Áp dụng lại zoom.
    scale(zoom);
  }
  
  ambientLight(60);
  directionalLight(255, 255, 255, 0, 0, -1);
  
  // Giới hạn vị trí của X sao cho không vượt qua các nam châm.
  let minX = magnetA + 55;
  let maxX = magnetB - 80;
  spherePos = constrain(spherePos, minX, maxX);

  push();
    // Vẽ nam châm A với hiệu ứng kim loại và không có viền.
    push();
      translate(magnetA, 0, 0);
      noStroke();
      shininess(50);
      specularMaterial(200);
      // Vẽ A dưới dạng hình cầu với bán kính 30.
      sphere(30);
      // Vẽ nhãn A(+) phía trên đối tượng.
      push();
        translate(0, -40, 0);
        noStroke();
        fill(255);
        text("A(+)", 0, 0);
      pop();
    pop();

    // Vẽ nam châm B với hiệu ứng kim loại và không có viền.
    push();
      translate(magnetB, 0, 0);
      noStroke();
      shininess(100);
      specularMaterial(220);
      // Vẽ B dưới dạng hình cầu với bán kính 60.
      sphere(60);
      // Vẽ nhãn B(++) phía trên đối tượng.
      push();
        translate(0, -70, 0);
        noStroke();
        fill(255);
        text("B(++)", 0, 0);
      pop();
    pop();

    // Vẽ quả cầu X (không có viền).
    push();
      translate(spherePos, 0, 0);
      noStroke();
      fill(255, 0, 0);
      // Vẽ X dưới dạng hình cầu với bán kính 15.
      sphere(15);
      // Vẽ nhãn X(-) phía trên quả cầu.
      push();
        translate(0, -35, 0);
        noStroke();
        fill(255);
        text("X(-)", 0, 0);
      pop();
    pop();

    // Vẽ đường nét đứt cố định:
    // Chiều dài giảm 50% từ 400 xuống còn 200, và màu được thay bằng xanh lá cây sáng.
    push();
      translate(initialDashedX, 0, 0);
      stroke(0, 255, 0);
      strokeWeight(1);
      let dashLength = 5;
      let gapLength = 5;
      for (let y = 0; y < 100; y += dashLength + gapLength) {
        line(0, y, 0, 0, y + dashLength, 0);
      }
    pop();
  pop();
}

function mousePressed() {
  // Khi không kéo thì orbitControl đã bị vô hiệu hóa do draggingA/B=false,
  // vì vậy ta sử dụng chuyển đổi từ tọa độ thế giới sang tọa độ màn hình đơn giản:
  // Màn hình: x = width/2 + (world_x * zoom), y = height/2 + (world_y * zoom)
  let screenX_A = width/2 + magnetA * zoom;
  let screenY_A = height/2;
  let screenX_B = width/2 + magnetB * zoom;
  let screenY_B = height/2;
  
  // Kiểm tra xem vị trí chuột có nằm trong vùng tác dụng của A không.
  // Vùng tác dụng của A: hình tròn có bán kính = 30 * zoom.
  if (dist(mouseX, mouseY, screenX_A, screenY_A) < 30 * zoom) {
    draggingA = true;
    // Tính offset ở tọa độ thế giới.
    offsetA = magnetA - ((mouseX - width/2) / zoom);
  }
  // Ngược lại, kiểm tra cho B (vùng tác dụng của B với bán kính = 60 * zoom).
  else if (dist(mouseX, mouseY, screenX_B, screenY_B) < 60 * zoom) {
    draggingB = true;
    offsetB = magnetB - ((mouseX - width/2) / zoom);
  }
}

function mouseDragged() {
  // Chuyển đổi từ tọa độ màn hình sang tọa độ thế giới (dựa trên zoom).
  let worldX = (mouseX - width/2) / zoom;
  
  // Khi kéo A, cập nhật vị trí của A và điều chỉnh sphere theo hướng ngược lại.
  if (draggingA) {
    let newMagnetA = worldX + offsetA;
    if (newMagnetA > magnetB - 10) {
      newMagnetA = magnetB - 10;
    }
    let deltaA = newMagnetA - magnetA;
    magnetA = newMagnetA;
    spherePos = spherePos - deltaA;
  }
  
  // Khi kéo B, cập nhật vị trí của B và điều chỉnh sphere tương tự.
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

function mouseWheel(event) {
  // Điều chỉnh zoom dựa theo delta của chuột.
  zoom *= (1 - event.delta * 0.001);
  zoom = constrain(zoom, 0.2, 5);
  return false;
}