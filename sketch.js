var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trex_standing;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, scoreObj;
var gameOver, gameOverImg;
var restart, restartImg;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trex_standing = loadAnimation("trex1.png");
  trex_collided = loadAnimation("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud-1.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);

  trex = createSprite(50, 180, 20, 50);
  trex.addAnimation("standing", trex_standing);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided)
  trex.scale = 0.5;
  trex.setCollider("circle", -10, 3, 36);
  // trex.debug = true;

  ground = createSprite(300, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = 0;

  invisibleGround = createSprite(ground.x, 190, ground.width, 10);
  invisibleGround.visible = false;
  ground2 = createSprite(ground.x, 190, ground.width, 22);
  ground2.shapeColor = color(215, 181, 145);
  
  ground.depth = ground2.depth + 1;
  
  scoreObj = createSprite(trex.x + 450, 50, 20, 20);
  scoreObj.visible = false;


  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //spawn the clouds
  spawnClouds();

  //spawn obstacles on the ground
  spawnObstacles();

  restart = createSprite(windowWidth / 2, 120, 20, 20);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  gameOver = createSprite(width / 2, 80);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;


  score = 0;
}

function draw() {
  background(176, 213, 230);

  //console.log(trex.x);
  
  if (gameState === PLAY) {

    if (keyDown("space") && trex.y >= 161.5) {
      trex.velocityY = -13;
    }

    if (keyDown("right")) {
      trex.x += 5;
      camera.x = trex.x + 250;
      scoreObj.x = trex.x + 450;
      gameOver.x = camera.x;
      restart.x = camera.x;
      score = score + Math.round(getFrameRate() / 60);
    }
    if (keyWentDown("right")){
      trex.changeAnimation("running", trex_running);
      
    }
    if (keyWentUp("right")){
      trex.changeAnimation("standing", trex_standing);
      
    }

    trex.velocityY = trex.velocityY + 0.8;

    if (trex.isTouching(obstaclesGroup) || trex.x >= 2340) {
      gameState = END;
    }
  } 
  
  else if (gameState === END) {

    gameOver.visible = true;
    restart.visible = true;

    trex.velocityY = 0;

    trex.changeAnimation("collided", trex_collided);

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  trex.collide(invisibleGround);

  drawSprites();
  
  text("Score: " + score, scoreObj.x, 50);

}

function reset() {
  score = 0;

  gameState = PLAY;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("standing", trex_standing);

  gameOver.visible = false;
  restart.visible = false;

  //spawn the clouds
  spawnClouds();

  //spawn obstacles on the ground
  spawnObstacles();

  trex.x = 50;
  camera.x = trex.x + 250;
}

function spawnObstacles() {

  for (var i = 250; i < ground.width; i += 250) {
    var obstacle = createSprite(i, 170, 10, 40);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;

    //adding obstacles to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  for (var i = 200; i < ground.width; i += 200) {
    cloud = createSprite(i, 120, 40, 10);
    cloud.y = Math.round(random(20, 80));
    cloud.addImage(cloudImage);
    
    cloud.scale = random(0.18,0.3);
    // var rand = Math.round(random(1, 2));
    // switch(rand) {
    //   case 1: cloud.scale = 0.2
    //           break;
    //   case 2: cloud.scale = 0.3;
    //           break;
    //   default: break;
    // }

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //adding cloud to the group
    cloudsGroup.add(cloud);
  }
}