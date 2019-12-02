var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var PLAY =1;
var END = 0;
var gameState = PLAY;
var gameOver , restart;
var gameOver_image, restart_image;
localStorage["HighestScore"] = 0;

let jump,die,checkpoint;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOver_image=loadImage("gameOver.png");
  restart_image=loadImage("restart.png");
  jump=loadSound('jump.mp3');
  die=loadSound('die.mp3');
  checkpoint=loadSound('checkPoint.mp3');
}

function setup() {
  createCanvas(1600, 200);
  
gameOver = createSprite(650,100);
restart = createSprite(650,140);
gameOver.addImage("gameOver" , gameOver_image );
gameOver.scale = 0.5;
restart.addImage("restart" , restart_image);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
  
  trex = createSprite(200,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("dead", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(900,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(180);
  
  trex.collide(invisibleGround);
  trex.velocityY = trex.velocityY + 0.8
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
  score = score + Math.round(getFrameRate()/60);
  ground.velocityX = -(6 + 3*score/100);
  
  if(keyDown("space") && trex.y >150) {
    trex.velocityY = -10;
    jump.play();
  }
  
    if (score>0 && score%100 === 0){
      checkpoint.play();
    }
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  
  spawnClouds();
  spawnObstacles();
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      die.play();
      
    }
  }
   else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
     
    trex.changeAnimation("dead", trex_collided);
    
     
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  drawSprites();
}
function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score; 
  } 
  
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(1600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}