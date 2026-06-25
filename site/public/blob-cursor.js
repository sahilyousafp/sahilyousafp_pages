'use strict';

(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var FILL = '#00F0FF';
  var INNER = 'rgba(255,255,255,0.8)';
  var SIZES = [40, 80, 55];
  var INNER_SIZES = [12, 22, 16];
  var OPACITIES = [0.6, 0.5, 0.4];
  var LEAD_SPEED = 0.25;
  var TRAIL_SPEED = 0.08;

  var mx = 0, my = 0;
  var hasMoused = false;
  var positions = SIZES.map(function () { return { x: 0, y: 0 }; });

  var container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.2s;';

  container.innerHTML =
    '<svg style="position:absolute;width:0;height:0;">' +
      '<filter id="blob-filter">' +
        '<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="12"/>' +
        '<feColorMatrix in="blur" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10"/>' +
      '</filter>' +
    '</svg>';

  var filtered = document.createElement('div');
  filtered.style.cssText = 'pointer-events:none;position:absolute;width:100%;height:100%;overflow:hidden;background:transparent;user-select:none;filter:url(#blob-filter);';
  container.appendChild(filtered);

  function makeBlob(size, innerSize, opacity) {
    var el = document.createElement('div');
    el.style.cssText =
      'position:absolute;will-change:transform;pointer-events:none;border-radius:50%;background:' + FILL +
      ';width:' + size + 'px;height:' + size + 'px;opacity:' + opacity +
      ';left:0;top:0;transform:translate(-200px,-200px);';
    var dot = document.createElement('div');
    dot.style.cssText =
      'position:absolute;border-radius:50%;background:' + INNER +
      ';width:' + innerSize + 'px;height:' + innerSize + 'px;top:' +
      ((size - innerSize) / 2) + 'px;left:' + ((size - innerSize) / 2) + 'px;';
    el.appendChild(dot);
    return el;
  }

  var trails = [];
  for (var i = 1; i < SIZES.length; i++) {
    var blob = makeBlob(SIZES[i], INNER_SIZES[i], OPACITIES[i]);
    filtered.appendChild(blob);
    trails.push(blob);
  }

  var lead = makeBlob(SIZES[0], INNER_SIZES[0], OPACITIES[0]);
  container.appendChild(lead);

  document.body.appendChild(container);

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!hasMoused) {
      hasMoused = true;
      for (var i = 0; i < positions.length; i++) {
        positions[i].x = mx;
        positions[i].y = my;
      }
      container.style.opacity = '1';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', function () {
    container.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    if (hasMoused) container.style.opacity = '1';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  var prev = performance.now();
  function tick(now) {
    var dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;

    if (!hasMoused) {
      requestAnimationFrame(tick);
      return;
    }

    var factor = 1 - Math.exp(-LEAD_SPEED * 60 * dt);
    positions[0].x = lerp(positions[0].x, mx, factor);
    positions[0].y = lerp(positions[0].y, my, factor);
    lead.style.transform = 'translate(' + (positions[0].x - SIZES[0] / 2) + 'px,' + (positions[0].y - SIZES[0] / 2) + 'px)';

    for (var i = 0; i < trails.length; i++) {
      var speed = TRAIL_SPEED + i * 0.03;
      var tf = 1 - Math.exp(-speed * 60 * dt);
      positions[i + 1].x = lerp(positions[i + 1].x, mx, tf);
      positions[i + 1].y = lerp(positions[i + 1].y, my, tf);
      trails[i].style.transform = 'translate(' + (positions[i + 1].x - SIZES[i + 1] / 2) + 'px,' + (positions[i + 1].y - SIZES[i + 1] / 2) + 'px)';
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
