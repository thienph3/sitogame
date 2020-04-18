$(function () {
  var elem = document.getElementById('canvas');
  //var ctx = elem.getContext('2d');
  var img = new Image;
  img.src = '/statics/main_32_2.png';
  var imgLoaded = false;
  img.addEventListener('load', function () {
    imgLoaded = true;
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

  monsters = [];
  for (var i = 0; i < 50; i++) {
      monster = {
          pos: [100*(Math.floor(9*Math.random())+1), 100*(Math.floor(9*Math.random())+1)],
          r: 10*(2+Math.floor(3*Math.random())),
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
          r: 16,
          dPos: [0, 0],
          t: 250
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
  
  function draw() {
      // Xóa canvas cũ
      api.clear();
      // Vẽ lại canvas mới
      //  - Monsters
      monsters.forEach(function(item, index) {
          // Render vị trí
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
          if (imgLoaded)
            elem.childNodes[0].getContext('2d').drawImage(img, item.pos[0] - 15, item.pos[1] - 20);
          else {
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
      // Vẽ background
      /*api.pattern("/statics/grass_32.png", "repeat", function (pattern) {
        api.attr({
          fillStyle: pattern,
            strokeStyle: "#B59554",
            lineWidth: 4
          }).begin().circle(500, 500, 500).fill().stroke();
      });*/
      //  - Human ở Client này
      if (me.click > 0) {
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
      // Check va chạm nhau
      //  - Monster & Monster
      for (var i = 0; i < monsters.length; i++)
          for (var j = i + 1; j < monsters.length; j++)
              if (isCollision(monsters[i], monsters[j])) {
                  t = monsters[i].dPos;
                  monsters[i].dPos = monsters[j].dPos;
                  monsters[j].dPos = t;
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
      return window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function(callback) {
              window.setTimeout(callback, 1000 / 5);
          };
  })();

  function animate() {
    requestAnimFrame(animate);
    draw();
  }
  
  animate();
});