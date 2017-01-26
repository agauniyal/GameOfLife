'use strict';


var canvas = document.getElementById('bgCanvas');
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;


var arena = {
  canvas : canvas,
  sqSide : 5,
  gutter : 3,
  colors : {
    alive: '#DB9E36',
    dead: '#FFFAD5',
    alter: '#BD4932'
  }
};

arena.xLimit = Math.ceil(arena.canvas.width / (arena.gutter + arena.sqSide));
arena.yLimit = Math.ceil(arena.canvas.height / (arena.gutter + arena.sqSide));

if(arena.yLimit < 5 || arena.xLimit < 10){
  alert('Screen size should be atleast 4y by 8x for optimal functioning');
}


var players = new Array(arena.yLimit);

for(var i = 0; i < arena.yLimit; ++i){
  players[i] = new Array(arena.xLimit);
}

for(var i = 0; i < arena.yLimit; ++i){
  for(var j = 0; j < arena.xLimit; ++j){
    players[i][j] = {
      state : false,
      color : arena.colors.dead
    };
  }
}


function getUpdate(players, arena){

  var clone = JSON.parse(JSON.stringify(players));

  for(var i = 0; i < arena.yLimit; ++i){
    for (var j = 0; j < arena.xLimit; ++j) {

      if(i === 0 || j === 0 || i === (arena.yLimit - 1) || j === (arena.xLimit - 1)){
        clone[i][j].state = (Math.random() >= 0.7);
        clone[i][j].color = (Math.random() >= 0.99) ? arena.colors.alive : arena.colors.dead;
        continue;
      }

      var allies = 0;

      if(players[i - 1][j - 1].state) { ++allies; }
      if(players[i - 1][j].state) { ++allies; }
      if(players[i - 1][j + 1].state) { ++allies; }
      if(players[i][j - 1].state) { ++allies; }
      if(players[i][j + 1].state) { ++allies; }
      if(players[i + 1][j - 1].state) { ++allies; }
      if(players[i + 1][j].state) { ++allies; }
      if(players[i + 1][j + 1].state) { ++allies; }

      switch (allies) {
        case 2: clone[i][j] = players[i][j]; break;
        case 3: clone[i][j].state = true; clone[i][j].color = (Math.random() >= 0.4) ? arena.colors.alive : arena.colors.alter; break;
        default: clone[i][j].state = false; clone[i][j].color = arena.colors.dead;
      }
    }
  }
  return clone;
}


function paint(arena, players){
  var ctx = arena.canvas.getContext('2d');

  for(var i = 0; i < arena.yLimit; ++i){
    for(var j = 0; j < arena.xLimit; ++j){
      var xDim = ((arena.sqSide + arena.gutter) * j);
      var yDim = ((arena.sqSide + arena.gutter) * i);
      ctx.fillStyle = players[i][j].color;
      ctx.fillRect(xDim, yDim, arena.sqSide, arena.sqSide);
    }
  }
}


(function(){
  var midX = parseInt((arena.xLimit - 1) / 2);
  var midY = parseInt((arena.yLimit - 1) / 2);

  players[midY + 1][midX - 3].state = true;
  players[midY + 1][midX - 3].color = arena.colors.alive;

  players[midY + 1][midX - 2].state = true;
  players[midY + 1][midX - 2].color = arena.colors.alter;

  players[midY - 1][midX - 2].state = true;
  players[midY - 1][midX - 2].color = arena.colors.alive;

  players[midY][midX].state = true;
  players[midY][midX].color = arena.colors.alter;

  players[midY + 1][midX + 1].state = true;
  players[midY + 1][midX + 1].color = arena.colors.alive;

  players[midY + 1][midX + 2].state = true;
  players[midY + 1][midX + 2].color = arena.colors.alter;

  players[midY + 1][midX + 3].state = true;
  players[midY + 1][midX + 3].color = arena.colors.alive;
})();


setInterval(function() {
  paint(arena, players);
  players = getUpdate(players, arena);
}, 100);
