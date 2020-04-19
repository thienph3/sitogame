$(function () {
  var elem = document.getElementById('canvas');
  //var ctx = elem.getContext('2d');

  // load humanImg
  var humanImg = {
    src: new Image,
    loaded: false
  };
  humanImg.src.src = '/statics/main_48.png';
  humanImg.src.addEventListener('load', function() {
    humanImg.loaded = true;
  });

  // load monsterImg
  var monsterImgs = [];
  for (var i = 0; i < 3; i++) {
    monsterImg = {
        src: new Image,
        loaded: false
    };
    monsterImg.src.src =  '/statics/covid19_' + i.toString() + '.png'
    monsterImgs.push(monsterImg);
  }
  monsterImgs[0].src.addEventListener('load', function () {
    monsterImgs[0].loaded = true;
  });
  monsterImgs[1].src.addEventListener('load', function () {
    monsterImgs[1].loaded = true;
  });
  monsterImgs[2].src.addEventListener('load', function () {
    monsterImgs[2].loaded = true;
  });

  // load click Icon
  var clickImg = {
      src: new Image,
      loaded: false
  };
  clickImg.src.src = '/statics/click_32.png';
  clickImg.src.addEventListener('load', function () {
    clickImg.loaded = true;
  });

  // load Collision Image
  var collisionImg = {
      src: new Image,
      loaded: false
  };
  collisionImg.src.src = '/statics/collision_16.png';
  collisionImg.src.addEventListener('load', function () {
    collisionImg.loaded = true;
  });

  var api = zino.Canvas({
      target: elem,
      width: 1000,
      height: 1000
  });

  function dist(a, b) {
      return Math.sqrt(Math.pow(a.pos[0] - b.pos[0], 2) + Math.pow(a.pos[1] - b.pos[1], 2)) - a.r - b.r;
  }
  function isCollision(a, b) {
      return dist(a, b) <= 0;
  }
  function getCollisionPoint(a, b) {
      return [(a.pos[0] * b.r + b.pos[0] * a.r) / (a.r + b.r), (a.pos[1] * b.r + b.pos[1] * a.r) / (a.r + b.r)]
  }

  monsters = [];
  for (var i = 0; i < 50; i++) {
      type = Math.floor(3*Math.random());
      monster = {
          type: type,
          pos: [100*(Math.floor(9*Math.random())+1), 100*(Math.floor(9*Math.random())+1)],
          r: 8*type+16,
          dPos: [-2+Math.floor(5*Math.random()), -2+Math.floor(5*Math.random())]
      };

      var flag = true;
      for (var j = 0; j < monsters.length; j++) 
          if (dist(monsters[j], monster) < 10) {
              flag = false;
              break;
          }
      
      if (flag)
          monsters.push(monster);
  }
  //console.log(monsters);

  humans = [];
  for (var i = 0; i < 1; i++) {
      human = {
          pos: [100*(Math.floor(9*Math.random())+1), 100*(Math.floor(9*Math.random())+1)],
          r: 24,
          dPos: [0, 0],
          t: 250,
          i: 0,
          k: 5
      };

      var flag = true;
      for (var j = 0; j < humans.length; j++) 
          if (dist(humans[j], human) < 10) {
              flag = false;
              break;
          }
      
      if (flag)
          humans.push(human);
  }
  //console.log(humans);

  var me = humans[0];
  me.click = 0;
  //console.log(me);

  // Add event listener for `click` events.
  elem.addEventListener('click', function(event) {
      var a = {pos: me.pos, r: 0}
      var elemLeft = elem.offsetLeft, elemTop = elem.offsetTop;
      var b = {pos: [event.pageX - elemLeft, event.pageY - elemTop], r: 0};
      //console.log(event)
      var d = dist(a, b);
      var speed = 3.0;
      //console.log(dist, me, t, d);
      me.dPos = [
          (-speed*a.pos[0] + speed*b.pos[0]) / (d + speed), 
          (-speed*a.pos[1] + speed*b.pos[1]) / (d + speed)
      ];
      
      me.click = 25;
      me.clickPos = b.pos;
  }, false);
  
  function drawImg(img, left, top) {
    elem.childNodes[0].getContext('2d').drawImage(img, left, top);
  }
  function drawCollision(collisionDict) {
    for (var key in collisionDict) {
        if (collisionDict.hasOwnProperty(key) && key != 'count') {           
            a = collisionDict[key];
            //console.log(a);
            elem.childNodes[0].getContext('2d').drawImage(collisionImg.src, 0, 0, 16, 16, a.x - a.r, a.y - a.r , 2*a.r, 2*a.r);
            a.r += a.delta;
            if (a.r >= 16) a.delta = -a.delta;
            else if (a.r <= 0) { 
                a.delta = 0;
                delete collisionDict[key];
            }
        }
    }
  }

  var collisionDict = {'count': 1, 0: {left: 100, top: 100, r: 1, delta: 1}};
  function draw() {
      // Xóa canvas cũ
      api.clear();
      // Vẽ lại canvas mới
      //  - Monsters
      monsters.forEach(function(item, index) {
          // Render vị trí
          if (monsterImgs[item.type].loaded)
            elem.childNodes[0].getContext('2d').drawImage(monsterImgs[item.type].src, item.pos[0] - item.r, item.pos[1] - item.r);
          else
            api.attr({
                lineWidth: 4,
                fillStyle: "#EED592",
                strokeStyle: "#B59554"
            }).begin().circle(item.pos[0], item.pos[1], item.r).fill().stroke();
          // Cập nhật position
          item.pos[0] += item.dPos[0];
          item.pos[1] += item.dPos[1];
      });
      //  - Humans
      humans.forEach(function(item, index) {
          // Render vị trí
          
          //api.image('/statics/main_32.jpg', item.pos[0] - 16 - 32, item.pos[1] - 22, 32, 38);
          if (humanImg.loaded) {
            elem.childNodes[0].getContext('2d').drawImage(humanImg.src, 48*Math.floor(item.i / item.k), 0, 48, 48, item.pos[0] - item.r, item.pos[1] - item.r, 48, 48);
            item.i = (item.i + 1) % (4 * item.k);
          } else {
            api.attr({
             lineWidth: 4,
                fillStyle: "#00CC66",
                strokeStyle: "#009933"
            }).begin().circle(item.pos[0], item.pos[1], item.r).fill().stroke();

            //elem.childNodes[0].getContext('2d').drawImage(img, 0, 0);
            // Đếm số để bắt đầu game
            api.attr({
                font: "normal 12pt Arial",
                textAlign: "center",
                textBaseline: "middle",
                fillStyle: "white",
                strokeStyle: "blue"
            }).text(Math.round(item.t / 25).toString(), item.pos[0], item.pos[1]);
          }
          // Cập nhật position
          item.pos[0] += item.dPos[0];
          item.pos[1] += item.dPos[1];
      });
      //  - Minimap
      document.getElementById('image_for_crop').src = elem.childNodes[0].toDataURL();
      document.getElementById('image_for_crop').style.top = (elem.offsetTop + 768).toString() + 'px';
      document.getElementById('image_for_crop').style.left = (elem.offsetLeft + 32).toString() + 'px';
      //  - Human ở Client này (sự kiện click chuột)
      if (me.click > 0) {
          if (clickImg.loaded)
            drawImg(clickImg.src, me.clickPos[0] - 13, me.clickPos[1] - 16)
          else
            api.attr({
              lineWidth: 5,
              lineCap: "round",
              lineJoin: "round",
              strokeStyle: "#006633"
            }).moveTo(me.clickPos[0] - 10, me.clickPos[1] - 10)
            .lineTo(me.clickPos[0] + 10, me.clickPos[1] + 10)
            .moveTo(me.clickPos[0] - 10, me.clickPos[1] + 10)
            .lineTo(me.clickPos[0] + 10, me.clickPos[1] - 10)
            .stroke();
          me.click--;
      }
      //  - Collision
      if (collisionImg.loaded && collisionDict) {
        drawCollision(collisionDict);
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
      //  - End game
      humans.forEach(function(human, ih, humans) {
          if (human.t > 0) {
              human.t--;
          } else {
              monsters.forEach(function(monster, im, monsters) {
                  if (isCollision(monster, human)) {
                      monsters.forEach(function(monster) {
                          monster.dPos = [0, 0];
                      });
                      humans.forEach(function(human) {
                          human.dPos = [0, 0];
                      });
                  }
              });
          }
      });
      // Check va chạm tường
      //  - Monsters
      monsters.forEach(function(item, index) {
          if (item.pos[0] - item.r <= 0 || item.pos[0] + item.r >= 1000)
              item.dPos[0] = -item.dPos[0];
          if (item.pos[1] - item.r <= 0 || item.pos[1] + item.r >= 1000)
              item.dPos[1] = -item.dPos[1];
      });
      //  - Humans
      humans.forEach(function(item, index) {
          if (item.pos[0] - item.r <= 0 || item.pos[0] + item.r >= 1000)
              item.dPos[0] = -item.dPos[0];
          if (item.pos[1] - item.r <= 0 || item.pos[1] + item.r >= 1000)
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
    requestAnimFrame(animate);
    draw();
  }
  
  animate();
});