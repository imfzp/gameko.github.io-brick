
function main(){
    var canvas=document.getElementById('myCanvas');
    context=canvas.getContext('2d');
    context.lineWidth=3;
    startNew();
    tsid=setInterval(brickFall,400);
    document.addEventListener("keydown",keyEvent,false);
}

window.onload=main;

var tsid;
var brick;
var xp=15;//per pixel for x
var yp=15;//per pixel for y
var context;
var allBrick=new Array();
var latestisFast=false;
const strokeColor="black";
const fillColor="grey";
const maxy=25;
const maxx=20;
var score=0;
var level=1;


const brickMode=[
[[0,0],[1,0],[2,0],[3,0]]
,[[0,0],[0,1],[1,1],[1,0]]
,[[0,1],[1,1],[2,1],[1,0]]
,[[0,0],[1,0],[2,0],[2,1]]
,[[0,1],[0,0],[1,0],[2,0]]
,[[0,0],[1,0],[1,1],[2,1]]
,[[0,1],[1,1],[1,0],[2,0]]

]

function Brick(i){
    this.x=10;
    this.y=0;
    this.tox=10;
    this.toy=0;
    
    if (!i){
        i=Math.floor(Math.random()*7);
    }
    
    this.rects=clone(brickMode[i]);
    this.toRects=clone(brickMode[i]);
    this.change=function(){
        for(var i=0;i<this.rects.length;i++){
            this.toRects[i][0]=1-this.rects[i][1];
            this.toRects[i][1]=this.rects[i][0]-1;
        }
        if (allowTo()){
           reDraw();
        } else {
            for (var i=0;i<this.rects.length;i++){
            
                this.toRects[i][0]=this.rects[i][0];
             this.toRects[i][1]=this.rects[i][1];
          }
        }
    }

}
function clone(br){
  var cloneBrick=new Array();
  for(var i=0;i<br.length;i++){
      var child=br[i];
      if (child){
          var clonechild=child.concat();
          cloneBrick.push(clonechild);
      }
  }
  return cloneBrick;
}

function keyEvent(event){
    switch(event.keyCode)
    {
        case 37:
        case 65:
            brickMove(-1,0);
        break;
        case 39:
        case 68:
            brickMove(1,0);
        break;
        case 40:
        case 83:
           latestisFast=true;
            clearInterval(tsid);
            tsid=setInterval(brickFall,10);
        break;
        case 38:
        case 87:
            brick.change();
        break;
        default:
        break;
        
    }
}

function startNew(){
    if (brick){
       completTurn();
       checkRow(brick.y+3);
    }
    brick=new Brick();
    drawBrick(brick);
     if (latestisFast)
    {
        latestisFast=false;
        clearInterval(tsid);
        tsid=setInterval(brickFall,getLevelSpeed());

    }
    if (!allowTo()){
        clearInterval(tsid);
        context.fillText("Game over",200,390,100);
        alert("Game over");
    }
   

}
function completTurn(){
     for(var i=0;i<brick.rects.length;i++){
            var x=brick.x+brick.rects[i][0];
            var y=brick.y+brick.rects[i][1];
            if (!allBrick[y])
            {
                allBrick[y]=new Array();
            }
            allBrick[y][x]=1;
    }
}

function checkRow(y){
    if (!y || y>maxy){
        y=maxy;
    }
    var subScore=100;
    for(var i=y;i>=0;i--){
        var yBrick=allBrick[i];
        if (!yBrick) break;
        var allfill=true;
        for(var j=0;j<=maxx;j++){
            if (!yBrick[j]) {
                allfill=false;
                break;
            }
        }
        if (allfill){
            clearRow(i);
            reDrawRow(i);
            i++;
            score+=subScore;
            drawScore();
            subScore+=100;
        }
    }
    if (score>=level*level*1000){
        
        levelUp();
       
    }

}

function drawScore(){
    var scoreLabel=document.getElementById('score');
    scoreLabel.innerHTML='Score:'+score;
}

function levelUp(){
    level++;
    brick=null;
    allBrick=new Array();
    for(var x=0;x<=maxx;x++){
        for(var y=0;y<=maxy;y++){
            clearRect(x,y);
        }
    }
   
    var scoreLabel=document.getElementById('level');
    scoreLabel.innerHTML='Level:'+level;
    context.fillStyle='red';
    context.font='italic bold 1.5em Times,serif';
    context.fillText('level'+level,150,100,200);
   

    latestisFast=false;
    clearInterval(tsid);
    tsid=setInterval(brickFall,getLevelSpeed());
}

function getLevelSpeed(){
    return 1201/(2+level);
}


function clearRow(row){
    allBrick[row]=new Array();
    for(var y=row-1;y>=0;y--){
        var yBrick=allBrick[y];
        if (!yBrick) break;
        allBrick[y+1]=yBrick;
        allBrick[y]=new Array();
    }
}
function reDrawRow(row){
    for(var y=row;y>=0;y--){
        var yBrick=allBrick[y];
        if (!yBrick) break;
        for(var x=0;x<=maxx;x++)
        {
            clearRect(x,y);
        }
         for(var x=0;x<=maxx;x++)
        {
            if (yBrick[x])
            drawRect(x,y);
        }

    }
    
}

function drawRect(x,y){  
    context.fillStyle=fillColor;
    var dx=x*xp;
    var dy=y*yp;
    context.fillRect(dx,dy,xp,yp);
     context.strokeStyle=strokeColor;
     
     context.strokeRect(dx,dy,xp,yp);
}

function clearRect(x,y){
    context.fillStyle="white";
    var dx=x*xp;
    var dy=y*yp;
    context.fillRect(dx,dy,xp,yp);
   // context.fillStyle=fillColor
    context.strokeStyle="white";
    context.strokeRect(dx,dy,xp,yp);
   // context.strokeStyle=strokeColor;
}

function drawBrick(){
    for(var i=0;i<brick.rects.length;i++){
        drawRect(brick.rects[i][0]+brick.x,brick.rects[i][1]+brick.y)
    }
}
function clearBrick(){
    for(var i=0;i<brick.rects.length;i++){
        clearRect(brick.rects[i][0]+brick.x,brick.rects[i][1]+brick.y)
    }
}

function brickFall(){

   if (brick)
    {
         
        for (var i=0;i<brick.rects.length;i++){
            brick.toy=brick.y+1;
           // brick.toRects[i][1]=brick.rects[i][1]+1;
        }
         if (allowTo()){
           reDraw();
        } else {
          startNew();   
        }
    }
}
function brickMove(x,y)
{
    if (brick)
    {
            for (var i=0;i<brick.rects.length;i++){
               brick.tox=brick.x+x;
               brick.toy=brick.y+y;
              // brick.toRects[i][0]=brick.rects[i][0]+x;
             //  brick.toRects[i][1]=brick.rects[i][1]+y;
          }
         if (allowTo()){
           reDraw();
        } else {
            for (var i=0;i<brick.rects.length;i++){
            
            // brick.toRects[i][0]=brick.rects[i][0];
            // brick.toRects[i][1]=brick.rects[i][1];
             brick.tox=brick.x;
             brick.toy=brick.y;
          }
         
        }
    }

}

function reDraw(){
    clearBrick();
   for (var i=0;i<brick.rects.length;i++){
            
            brick.rects[i][0]=brick.toRects[i][0];
            brick.rects[i][1]=brick.toRects[i][1];
            brick.x=brick.tox;
            brick.y=brick.toy;
          }
    drawBrick();
}

function allowTo(){  
    for(var i=0;i<brick.rects.length;i++){
        var x=brick.tox+brick.toRects[i][0];
        var y=brick.toy+brick.toRects[i][1];
        if (y>maxy || y<0 || x<0 || x>maxx) return false;
        if (allBrick[y] && allBrick[y][x]==1) {
            return false;
        }
    }
    return true; 
}