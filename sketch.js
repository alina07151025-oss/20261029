// 定義變數以儲存精靈圖片與角色狀態
let walkImg;       // 走路動畫圖檔
let jumpImg;       // 跳躍動畫圖檔

let currentImg;    // 當前顯示的精靈圖檔
let totalFrames;   // 當前動畫的總張數
let totalWidth;    // 當前精靈圖的總寬度
let totalHeight;   // 當前精靈圖的總高度
let frameWidth;    // 單張精靈圖的寬度 (總寬度 / 張數)

let frameIndex = 0; // 當前播放到第幾張影格 (0 ~ totalFrames - 1)
let posX, posY;     // 角色的 X 與 Y 座標位置
let speed = 5;      // 角色的移動速度
let isFlipped = false; // 角色是否轉向 (false: 朝右, true: 朝左)

// 預載圖片函式：在 setup 之前執行，確保圖片完全載入
function preload() {
  // 載入走路精靈圖 (路徑: 1/walk/walk.png)
  walkImg = loadImage('1/walk/walk.png');
  // 載入跳躍精靈图 (路徑: 1/jump/jump.png)
  jumpImg = loadImage('1/jump/jump.png');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定動畫播放速率 (每秒更新幾次，可依需求調整動畫順暢度)
  frameRate(12);
  
  // 初始角色位置設定在畫面正中央
  posX = width / 2;
  posY = height / 2;
  
  // 預設切換為走路狀態
  setAnimation(walkImg, 8, 1946, 180);
}

function draw() {
  // 設定背景顏色 (RGB: #264653)
  background(38, 70, 83);
  
  // 檢查鍵盤按壓狀態並更新角色位置與動畫
  handleInput();
  
  // 繪製角色精靈動畫
  drawSprite();
  
  // 更新影格索引以實現循環播放動畫
  frameIndex = (frameIndex + 1) % totalFrames;
}

// 根據按下的按鍵調整角色的動作與位移
function handleInput() {
  if (keyIsDown(RIGHT_ARROW)) {
    // 按下右鍵：切換為跳躍動畫，朝右移動
    setAnimation(jumpImg, 7, 1091, 180);
    posX += speed;
    isFlipped = false; // 朝右不翻轉
  } else if (keyIsDown(LEFT_ARROW)) {
    // 按下左鍵：切換為走路動畫，朝左移動並轉向
    setAnimation(walkImg, 8, 1946, 180);
    posX -= speed;
    isFlipped = true;  // 朝左進行水平翻轉
  } else {
    // 若未按下左右鍵，維持預設走路動畫與當前方向
    setAnimation(walkImg, 8, 1946, 180);
  }
}

// 切換目前的動畫設定值
function setAnimation(img, frames, w, h) {
  // 當切換新的動畫圖檔時，重設相關參數
  if (currentImg !== img) {
    currentImg = img;
    totalFrames = frames;
    totalWidth = w;
    totalHeight = h;
    frameWidth = totalWidth / totalFrames; // 計算單一格精靈的寬度
    frameIndex = 0;                        // 重設影格計數
  }
}

// 繪製並剪裁精靈圖
function drawSprite() {
  push(); // 儲存當前的繪圖狀態
  
  // 將原點移動至角色的位置 (方便進行旋轉與縮放翻轉)
  translate(posX, posY);
  
  // 若需要轉向（朝左），將 X 軸方向進行水平翻轉 (-1)
  if (isFlipped) {
    scale(-1, 1);
  }
  
  // 計算目前影格在精靈圖上的 X 軸裁切起始位置
  let sx = frameIndex * frameWidth;
  
  // 繪製精靈：使用 image() 9參數模式裁切並繪製
  // 參數說明: image(圖檔, dx, dy, dw, dh, sx, sy, sw, sh)
  // 將角色中心點對準 (0,0) 位置進行繪製
  image(
    currentImg, 
    -frameWidth / 2, -totalHeight / 2, // 繪製於本地原點中央
    frameWidth, totalHeight,           // 繪製目標寬高
    sx, 0,                             // 來源圖檔裁切起始點 (sx, sy)
    frameWidth, totalHeight            // 來源圖檔裁切寬高 (sw, sh)
  );
  
  pop(); // 還原之前的繪圖狀態
}

// 當使用者調整瀏覽器視窗大小時自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}