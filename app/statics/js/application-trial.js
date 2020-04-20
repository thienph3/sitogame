$(function () {
  var map = {
    width: 2000,
    height: 2000,
    border: 32
  };
  var screen = {
    left: 0,
    top: 0,
    width: Math.min(window.innerWidth, map.width + 2*map.border),
    height: Math.min(window. innerHeight, map.height + 2*map.border),
    wBias: 500,
    hBias: 500
  };
  //console.log(screen);

  var hIndex = 0, mIndex = 1, clIndex = 4, coIndex = 5; // image Index of human, monster, click & collision
  var num_type_m = 3;

  var $maindiv = $('#maindiv'),
      $maindiv00 = $('#maindiv00'),
      $maindiv01 = $('#maindiv01'),
      $maindiv02 = $('#maindiv02'),
      $maindiv10 = $('#maindiv10'),
      $maindiv11 = $('#maindiv11'),
      $maindiv12 = $('#maindiv12'),
      $maindiv20 = $('#maindiv20'),
      $maindiv21 = $('#maindiv21'),
      $maindiv22 = $('#maindiv22');
  var DOMmaindiv11 = document.getElementById('maindiv11');
  var DOMminimap = document.getElementById('minimap');
  var gameState = 0; // INIT

  function updateScreen(left, top) {
    screen.left = Math.max(0, Math.round(left));
    screen.top = Math.max(0, Math.round(top));
    $maindiv11.css({'background-position': (screen.left % 32) + 'px ' + (screen.top % 32) + 'px'});
  }

  // setSize of maindiv
  (function setSize() {
    var width = map.width, height = map.height, border = map.border;
    width = Math.min(width, screen.width - 2*border);
    height = Math.min(height, screen.height - 2*border);
    
    $maindiv.css({'width': (width + 2*border).toString() + 'px', 'height': (height + 2*border).toString() + 'px'});
    $maindiv00.css({'width': (border).toString() + 'px', 'height': (border).toString() + 'px'});
    $maindiv01.css({'width': (width).toString() + 'px', 'height': (border).toString() + 'px'});
    $maindiv02.css({'width': (border).toString() + 'px', 'height': (border).toString() + 'px'});
    $maindiv10.css({'width': (border).toString() + 'px', 'height': (height).toString() + 'px'});
    $maindiv11.css({'width': (width).toString() + 'px', 'height': (height).toString() + 'px'});
    $maindiv12.css({'width': (border).toString() + 'px', 'height': (height).toString() + 'px'});
    $maindiv20.css({'width': (border).toString() + 'px', 'height': (border).toString() + 'px'});
    $maindiv21.css({'width': (width).toString() + 'px', 'height': (border).toString() + 'px'});
    $maindiv22.css({'width': (border).toString() + 'px', 'height': (border).toString() + 'px'});
  })();

  function startGame() {
    var startTime = Date.now(),
        currentTime = startTime,
        lastTime = startTime,
        passTime = 0, // between startTime & currentTime, by seconds.
        diff = 0; // between lastTime & currentTime, by micro seconds.

    function dist(a, b) {
      return Math.sqrt(Math.pow(a.pos[0] - b.pos[0], 2) + Math.pow(a.pos[1] - b.pos[1], 2)) - a.r - b.r;
    }
    function isCollision(a, b) {
      return dist(a, b) <= 0;
    }
    function getCollisionPoint(a, b) {
      return [(a.pos[0] * b.r + b.pos[0] * a.r) / (a.r + b.r), (a.pos[1] * b.r + b.pos[1] * a.r) / (a.r + b.r)]
    }

    var monsters = (function initMonsters(num_monsters) {
      var width = map.width, height = map.height, border = map.border;
      var max_r = 8*num_monsters+8;
        
      var monsters = [];
      for (var i = 0; i < num_monsters; i++) {
        type = Math.floor(num_type_m*Math.random());
        monster = {
          type: type,
          pos: [Math.floor((width-2*max_r)*Math.random())+max_r, Math.floor((height-2*max_r)*Math.random())+max_r],
          r: 8*type+16,
          dPos: [-120+Math.floor(241*Math.random()), -120+Math.floor(241*Math.random())] // -120 -> 120, speed per second.
        };
    
        var flag = true;
        for (var j = 0; j < monsters.length; j++) 
          if (dist(monsters[j], monster) < 10) {
            flag = false;
            break;
          }
            
        if (flag) monsters.push(monster);
      }
      return monsters;
    })(50);

    var humans = (function initHumans(num_humans) {
      var width = map.width, height = map.height, border = map.border;
      var max_r = 24;
        
      var humans = [];
      for (var i = 0; i < num_humans; i++) {
        human = {
          name: i == 0 ? 'me' : 'Human ' + i, 
          type: i == 0 ? 'me' : 'bot', // for bot
          pos: [Math.floor((width-2*max_r)*Math.random())+max_r, Math.floor((height-2*max_r)*Math.random())+max_r],
          r: 24,
          dPos: [0, 0], // speed per second.
          t: 250, // time bất tử đầu game
          i: 5, // render chuyển động
          k: 5, // render chuyển động
          state: 0 // INIT in (INIT, MOVING, DEAD)
        };
    
        var flag = true;
        for (var j = 0; j < humans.length; j++) 
          if (dist(humans[j], human) < 10) {
            flag = false;
            break;
          }
            
        if (flag) humans.push(human);
        if (i == 0) {// me
          // update screen for main in center
          updateScreen(human.pos[0] - (screen.width - 2*map.border)/2, human.pos[0] - (screen.height - 2*map.border)/2);
        }
      }
      return humans;
    })(10);
    var number_of_survival = humans.length;
    var deadList = [];

// TODO: START

    // for render canvas
  var api = zino.Canvas({
    target: DOMmaindiv11,
    width: screen.width - 2*map.border,
    height: screen.height - 2*map.border
});
var canvas = DOMmaindiv11.childNodes[0].getContext('2d');
canvas.font = '48px serif';

var me = humans[0];
me.click = 0;

// Add event listener for `click` events.
function moveClick (me, event) {
  if (me.state == 0) // INIT
    me.state = 1
  if (me.state != 2) { // NOT DEAD
    var a = {pos: me.pos, r: 0}
    var elemLeft = DOMmaindiv11.offsetLeft, elemTop = DOMmaindiv11.offsetTop;
    var b = {pos: [event.pageX - elemLeft + screen.left, event.pageY - elemTop + screen.top], r: 0};
    //console.log(event)
    var d = dist(a, b);
    var speed = 240; // speed per second.
    //console.log(dist, me, t, d);
    me.dPos = [
        Math.round((-speed*a.pos[0] + speed*b.pos[0]) / (d + speed)), 
        Math.round((-speed*a.pos[1] + speed*b.pos[1]) / (d + speed))
    ];
    
    me.click = 25;
    me.clickPos = b.pos;
  } else if (gameState != 2) { // GAME NOT ENDED
    //alert('You dead!');
  }
}
DOMmaindiv11.addEventListener('click', function(event) {
  moveClick(me, event);
}, false);

// update screen when mouse out
$maindiv11.mouseout(function(a) {
    //console.log('Mouseout', a.offsetX, a.offsetY);
    if (a.offsetX < 0)
      updateScreen(screen.left + 1*a.offsetX, screen.top);
    if (a.offsetX > screen.width - 2*map.border)
      updateScreen(Math.min(map.width - screen.width + 2*map.border, screen.left + 1*(a.offsetX - screen.width + 2*map.border)), screen.top);
      
    if (a.offsetY < 0)
      updateScreen(screen.left, Math.max(0, screen.top + 1*a.offsetY));
    if (a.offsetY > screen.height - 2*map.border)
      updateScreen(screen.left, Math.min(map.height - screen.height + 2*map.border, screen.top + 1*(a.offsetY - screen.height + 2*map.border)));
});

function drawCollision(collisionDict) {
  for (var key in collisionDict) {
      if (collisionDict.hasOwnProperty(key) && key != 'count') {           
          a = collisionDict[key];
          //console.log(a);
          canvas.drawImage(images[coIndex].src, 0, 0, 16, 16, a.x - a.r - screen.left, a.y - a.r - screen.top, 2*a.r, 2*a.r);
          a.r += a.delta;
          if (a.r >= 16) a.delta = -a.delta;
          else if (a.r <= 0) { 
              a.delta = 0;
              delete collisionDict[key];
          }
      }
  }
}

var collisionDict = {'count': 0};

function checkOnScreen(object) {
  var x = object.pos[0], y = object.pos[1], r = object.r;
  var left = screen.left, top = screen.top, width = screen.width, height = screen.height;
  //console.log(x, y, r);
  if (x + r < left || x - r > left + width)
    return false;
  if (y + r < top || y + r > top + height)
    return false;
  return true;
}

function draw() {
  lastTime = currentTime;
  currentTime = Date.now();
  passTime = Math.round((currentTime - startTime) / 1000); // by seconds
  diff = Math.round(currentTime - lastTime); // by micro seconds.
  
  function passTimeToString() {
    function pad(n) {
      var s = '0' + n;
      return s.substr(s.length - 2);
    }

    var hh = Math.floor(passTime / 3600), 
        mm = Math.floor((passTime % 3600) / 60), 
        ss = passTime % 60;
    return pad(hh) + ':' + pad(mm) + ':' + pad(ss); 
  }

  // Check va chạm nhau
  //  - Monster & Monster
  for (var i = 0; i < monsters.length; i++)
      for (var j = i + 1; j < monsters.length; j++)
          if (isCollision(monsters[i], monsters[j])) {
              var t = monsters[i].dPos;
              monsters[i].dPos = monsters[j].dPos;
              monsters[j].dPos = t;

              t = getCollisionPoint(monsters[i], monsters[j]);
              collisionDict['count']++;
              collisionDict[collisionDict['count']] = {
                  x: t[0],
                  y: t[1],
                  r: 0,
                  delta: Math.round((monsters[i].r + monsters[j].r) / 8) / 4,
                  rMax: Math.round((monsters[i].r + monsters[j].r) / 8)
              }
          }
  //  - Monster & Human
  humans.forEach(function(human, ih, humans) {
    if (human.state != 2) { // NOT DEAD
      if (human.t > 0) {
        human.t--;
      } else {
        monsters.forEach(function(monster, im, monsters) {
          if (isCollision(monster, human)) {
            human.state = 2;
            number_of_survival--;
            deadList.push(human.name + ' dead at ' + passTimeToString());
          }
        });
      }
      if (true) {//(human.type == 'bot') {
        movingBot(monsters, human, dist, function(goingPos) {
          var elemLeft = DOMmaindiv11.offsetLeft, elemTop = DOMmaindiv11.offsetTop;
          moveClick(human, {
            'pageX': Math.min(screen.width-2*map.border, Math.max(0, goingPos[0] + elemLeft - screen.left)), 
            'pageY': Math.min(screen.height-2*map.border, Math.max(0, goingPos[1] + elemTop - screen.top))
          });
        })
      }
    }
  });

    // Xóa canvas cũ
    api.clear();
    // Vẽ lại canvas mới
    //  - Monsters
    monsters.forEach(function(monster, index) {
        // Render vị trí
        if (checkOnScreen(monster))
          canvas.drawImage(images[monster.type + mIndex].src, monster.pos[0] - monster.r - screen.left, monster.pos[1] - monster.r - screen.top);
        // Cập nhật position
        monster.pos[0] += Math.round(monster.dPos[0] * diff / 1000);
        monster.pos[1] += Math.round(monster.dPos[1] * diff / 1000);
    });
    //  - Humans
    humans.forEach(function(human, index) {
      //if (index == 1) console.log(human.pos)
      // Update screen when moving
      if (index == 0) {// me
        if (human.pos[0] - human.r < screen.left + screen.wBias)
          updateScreen(human.pos[0] - human.r - screen.wBias, screen.top);
        if (human.pos[0] + human.r > screen.left + screen.width - screen.wBias)
          updateScreen(Math.min(map.width - screen.width + 2*map.border, human.pos[0] + human.r - screen.width + screen.wBias), screen.top);
        if (human.pos[1] - human.r < screen.top + screen.hBias)
          updateScreen(screen.left, human.pos[1] - human.r - screen.hBias);
        if (human.pos[1] + human.r > screen.top + screen.height - screen.hBias)
          updateScreen(screen.left, Math.min(map.height - screen.height + 2*map.border, human.pos[1] + human.r - screen.height + screen.hBias));
      } else {
        canvas.globalAlpha = 0.4;
      }
      // Render vị trí
      if (checkOnScreen(human)) {
        canvas.drawImage(images[hIndex].src, 48*Math.floor(human.i / human.k), 0, 48, 48, human.pos[0] - human.r - screen.left, human.pos[1] - human.r - screen.top, 48, 48);
      }
      // Cập nhật position
      if (human.state != 2) { // NOT DEAD
        human.pos[0] += Math.round(human.dPos[0] * diff / 1000);
        human.pos[1] += Math.round(human.dPos[1] * diff / 1000);
        human.i = (human.i + 1) % (4 * human.k);
      } else {
        human.i = human.k;
      }  
    });
    canvas.globalAlpha = 1;
    //  - Minimap
    DOMminimap.src = DOMmaindiv11.childNodes[0].toDataURL();
    DOMminimap.style.top = (DOMmaindiv11.offsetTop + 768).toString() + 'px';
    DOMminimap.style.left = (DOMmaindiv11.offsetLeft + 32).toString() + 'px';
    //  - Human ở Client này (sự kiện click chuột)
    if (me.click > 0) {
        canvas.drawImage(images[clIndex].src, me.clickPos[0] - 13 - screen.left, me.clickPos[1] - 16 - screen.top)
        me.click--;
    }
    //  - Collision
    if (gameState == 1 && collisionDict) {
      drawCollision(collisionDict);
    }
    //  - Draw some Text
    canvas.font = '48px serif';
    canvas.fillStyle = 'black';
    canvas.textAlign = 'left';
    canvas.fillText(screen.left + ' ' + screen.top, 32, 64);
    canvas.textAlign = 'right';
    canvas.fillText(passTimeToString(), screen.width - 2*map.border - 32, 64);
    canvas.textAlign = 'center';
    canvas.fillText(number_of_survival + '/' + humans.length, Math.round((screen.width - 2*map.border)/2), 64);
    
    canvas.font = '15px serif';
    canvas.textAlign = 'right';
    deadList.forEach(function(item, index) {
      if (item.substr(0, 2) == 'me') {
        canvas.fillStyle = '#660000';
      } else {
        canvas.fillStyle = '#3300CC';
      }
      canvas.fillText(item, screen.width - 2*map.border - 32, screen.height - 2*map.border - 20*(index + 1));
    });
    
    //  - End GAME
    if (number_of_survival == 1) {
      gameState = 2; // ENDED
    }

    // Check va chạm tường
    //  - Monsters
    monsters.forEach(function(item, index) {
        if (item.pos[0] - item.r <= 0 || item.pos[0] + item.r >= map.width)
            item.dPos[0] = -item.dPos[0];
        if (item.pos[1] - item.r <= 0 || item.pos[1] + item.r >= map.height)
            item.dPos[1] = -item.dPos[1];
    });
    //  - Humans
    humans.forEach(function(item, index) {
        if (item.pos[0] - item.r <= 0 || item.pos[0] + item.r >= map.width)
            item.dPos[0] = -item.dPos[0];
        if (item.pos[1] - item.r <= 0 || item.pos[1] + item.r >= map.height)
            item.dPos[1] = -item.dPos[1];
    });
}

window.requestAnimFrame = (function() {
    //return function(callback) {
    //  window.setTimeout(callback, 1000 / 50);
    //};
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 25);
        };
})();

function animate() {
  if (gameState != 2) { // NOT ENDED
    requestAnimFrame(animate);
    draw();
  }
}

animate();

// TODO: END
  }

  // Load all resources
  var images = (function loadResources(callback) {
    function loadImage(src) {
      var img = {
        src: new Image,
        loaded: false
      }
      img.src.src = src;
      img.src.addEventListener('load', function() {
        //console.log(src, img, num_loaded, images, gameState);
        img.loaded = true;
        num_loaded++;
        if (num_loaded == images.length) {
            gameState = 1; // LOADED
            callback();
        }
      });
      return img;
    }
    var num_loaded = 0;
    var srcs = ['main_48.png', 'covid19_0.png', 'covid19_1.png', 'covid19_2.png', 'click_32.png', 'collision_16.png'];
    var images = [];
    srcs.forEach(function(src, index, srcs) {
      var image = loadImage('/statics/' + src);
      images.push(image);
    });

    return images;
  })(startGame);
});