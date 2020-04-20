function movingBot(monsters, human, dist, callback) {
  var m = null, t = null;
  monsters.forEach(function(monster, im, monsters) {
    var d = dist(monster, human);
    if (!m || d < m) {
      m = d;
      t = monster.pos;
    }
  });

  if (m < 100) {
    callback([2*human.pos[0]-t[0], 2*human.pos[1]-t[1]]);
  }
}