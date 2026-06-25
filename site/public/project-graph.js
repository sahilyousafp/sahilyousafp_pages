(function(){
  var DATA = window.PROJECT_DATA;
  if(!DATA) return;

  var graphEl = document.getElementById('pg-graph');
  var canvas  = document.getElementById('pg-canvas');
  if(!graphEl || !canvas) return;

  var ctx = canvas.getContext('2d');
  var nodeEls = {};
  var sim = [];
  var drag = {active:false, nodeId:null, isPan:false, startX:0, startY:0, moved:false};

  var REPULSION = 3500;
  var SPRING_K = 0.008;
  var REST_BRANCH = 140;
  var REST_SUB = 100;
  var MIN_DIST = 80;
  var DAMPING = 0.85;
  var CENTER_G = 0.0003;

  function initSim(){
    var w = graphEl.clientWidth;
    var h = graphEl.clientHeight;
    sim = DATA.nodes.map(function(n){
      return {id:n.id, parent:n.parent, type:n.type, cat:n.cat, color:n.color, line:n.line,
              px: n.x/100*w, py: n.y/100*h, vx:0, vy:0};
    });
  }

  DATA.nodes.forEach(function(node){
    var el = document.createElement('div');
    el.className = 'pg-node pg-node-' + node.type + (node.cat ? ' pg-cat-' + node.cat : '');
    if(node.color) el.style.setProperty('--node-color', node.color);
    el.dataset.id = node.id;

    var icon = document.createElement('div');
    icon.className = 'pg-node-icon';
    icon.innerHTML = '<i class="' + node.icon + '"></i>';
    el.appendChild(icon);

    var label = document.createElement('span');
    label.className = 'pg-node-label';
    label.textContent = node.label;
    el.appendChild(label);

    if(node.sub){
      var sub = document.createElement('span');
      sub.className = 'pg-node-sublabel';
      sub.textContent = node.sub;
      el.appendChild(sub);
    }

    el.addEventListener('click', function(){
      if(drag.moved) return;
      if(node.link){
        window.location.href = node.link;
      } else if(node.section){
        openSection(node.section);
        setActiveNode(node.id);
      }
    });

    graphEl.appendChild(el);
    nodeEls[node.id] = el;
  });

  graphEl.addEventListener('mousedown', function(e){
    var rect = graphEl.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var hit = null;
    for(var i = sim.length - 1; i >= 0; i--){
      var dx = sim[i].px - mx;
      var dy = sim[i].py - my;
      if(Math.sqrt(dx*dx + dy*dy) < 40){ hit = sim[i]; break; }
    }
    if(hit){
      drag = {active:true, nodeId:hit.id, isPan:false, startX:mx, startY:my, moved:false};
    } else {
      drag = {active:true, nodeId:null, isPan:true, startX:mx, startY:my, moved:false};
    }
  });

  window.addEventListener('mousemove', function(e){
    if(!drag.active) return;
    var rect = graphEl.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    var ddx = mx - drag.startX;
    var ddy = my - drag.startY;
    if(Math.abs(ddx) > 3 || Math.abs(ddy) > 3) drag.moved = true;

    if(drag.isPan){
      sim.forEach(function(n){ n.px += ddx; n.py += ddy; n.vx = 0; n.vy = 0; });
      drag.startX = mx;
      drag.startY = my;
    } else if(drag.nodeId){
      var node = sim.find(function(n){ return n.id === drag.nodeId; });
      if(node){ node.px = mx; node.py = my; node.vx = 0; node.vy = 0; }
    }
  });

  window.addEventListener('mouseup', function(){ drag.active = false; });

  function animate(){
    if(!sim.length){ requestAnimationFrame(animate); return; }
    var w = graphEl.clientWidth;
    var h = graphEl.clientHeight;
    var cx = w/2, cy = h/2;
    var lookup = {};
    sim.forEach(function(n){ lookup[n.id] = n; });

    for(var i = 0; i < sim.length; i++){
      var a = sim[i];
      if(drag.active && drag.nodeId === a.id) continue;
      for(var j = i+1; j < sim.length; j++){
        var b = sim[j];
        if(drag.active && drag.nodeId === b.id) continue;
        var dx = a.px - b.px;
        var dy = a.py - b.py;
        var dist = Math.sqrt(dx*dx + dy*dy) || 1;
        if(dist < MIN_DIST) dist = MIN_DIST;
        var force = REPULSION / (dist * dist);
        var fx = (dx/dist) * force;
        var fy = (dy/dist) * force;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }

      if(a.parent && lookup[a.parent]){
        var p = lookup[a.parent];
        var dx2 = a.px - p.px;
        var dy2 = a.py - p.py;
        var dist2 = Math.sqrt(dx2*dx2 + dy2*dy2) || 1;
        var rest = a.type === 'sub' ? REST_SUB : REST_BRANCH;
        var disp = dist2 - rest;
        var sfx = (dx2/dist2) * disp * SPRING_K;
        var sfy = (dy2/dist2) * disp * SPRING_K;
        a.vx -= sfx; a.vy -= sfy;
        if(!(drag.active && drag.nodeId === p.id)){
          p.vx += sfx; p.vy += sfy;
        }
      }

      a.vx += (cx - a.px) * CENTER_G;
      a.vy += (cy - a.py) * CENTER_G;
    }

    sim.forEach(function(n){
      if(drag.active && drag.nodeId === n.id) return;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.px += n.vx;
      n.py += n.vy;
      n.px = Math.max(35, Math.min(w - 35, n.px));
      n.py = Math.max(35, Math.min(h - 35, n.py));
    });

    sim.forEach(function(n){
      var el = nodeEls[n.id];
      if(el){ el.style.left = n.px + 'px'; el.style.top = n.py + 'px'; }
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  function drawLines(){
    canvas.width = graphEl.clientWidth;
    canvas.height = graphEl.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var lookup = {};
    sim.forEach(function(n){ lookup[n.id] = n; });
    sim.forEach(function(node){
      if(!node.parent) return;
      var p = lookup[node.parent];
      if(!p) return;
      ctx.beginPath();
      ctx.moveTo(node.px, node.py);
      ctx.lineTo(p.px, p.py);
      ctx.strokeStyle = node.color || '#ff3300';
      ctx.lineWidth = 1;
      ctx.globalAlpha = node.line === 'dashed' ? 0.22 : 0.4;
      ctx.setLineDash(node.line === 'dashed' ? [4,4] : []);
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  function setActiveNode(id){
    Object.keys(nodeEls).forEach(function(k){ nodeEls[k].classList.remove('active'); });
    if(nodeEls[id]) nodeEls[id].classList.add('active');
  }

  function openSection(sectionId){
    var items = document.querySelectorAll('.pg-accordion-item');
    items.forEach(function(item){
      if(item.dataset.section === sectionId){
        item.classList.add('open');
        setTimeout(function(){
          item.scrollIntoView({behavior:'smooth', block:'start'});
        }, 120);
      }
    });
  }

  document.querySelectorAll('.pg-accordion-header').forEach(function(header){
    header.addEventListener('click', function(){
      var item = header.parentElement;
      var wasOpen = item.classList.contains('open');
      item.classList.toggle('open');
      if(!wasOpen){
        var sid = item.dataset.section;
        if(sid){
          var n = DATA.nodes.find(function(nd){ return nd.section === sid; });
          if(n) setActiveNode(n.id);
        }
      }
    });
  });

  var closeBtn = document.querySelector('.pg-panel-close');
  if(closeBtn){
    closeBtn.addEventListener('click', function(){
      window.location.href = '/sahilyousafp_pages/#code';
    });
  }

  window.addEventListener('resize', initSim);
  initSim();
  requestAnimationFrame(animate);

  var first = document.querySelector('.pg-accordion-item');
  if(first){
    first.classList.add('open');
    var sid = first.dataset.section;
    var n = DATA.nodes.find(function(nd){ return nd.section === sid; });
    if(n) setActiveNode(n.id);
  }
})();
