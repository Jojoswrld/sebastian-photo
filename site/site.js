(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* fade in once the faces are in, never wait longer than 1.2s */
  const ready = () => root.classList.add('fonts-ready');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready);
  setTimeout(ready, 1200);

  /* ---------- lazy photos fade in once loaded ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach((im) => {
    if (im.complete) return;
    im.classList.add('is-pending');
    const done = () => {
      im.classList.add('is-arriving');
      void im.offsetWidth; // commit the hidden state so the fade runs
      im.classList.remove('is-pending');
    };
    im.addEventListener('load', done, { once: true });
    im.addEventListener('error', done, { once: true });
  });

  /* ---------- tokens to linear rgb ---------- */
  const probe = document.createElement('canvas');
  probe.width = probe.height = 1;
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  const token = (name) => {
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    pctx.clearRect(0, 0, 1, 1);
    pctx.fillStyle = v;
    pctx.fillRect(0, 0, 1, 1);
    const d = pctx.getImageData(0, 0, 1, 1).data;
    const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return [lin(d[0]), lin(d[1]), lin(d[2])];
  };

  /* ---------- the air: one slow WebGL field ---------- */
  const air = (() => {
    const canvas = document.querySelector('[data-air-canvas]');
    if (!canvas) return null;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) return null;

    const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
    const fs = `
      precision mediump float;
      uniform vec2 uRes; uniform float uTime;
      uniform vec3 uPaper; uniform vec3 uVeil; uniform vec3 uAmber; uniform vec3 uLit; uniform vec3 uTint;
      uniform float uTintAmt; uniform vec2 uPtr; uniform float uPtrAmt;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(h(i), h(i+vec2(1,0)), u.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), u.x), u.y); }
      float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*n(p); p = p*2.03 + 17.0; a *= 0.5; } return v; }
      vec3 toSrgb(vec3 c){ return mix(c*12.92, 1.055*pow(c, vec3(1.0/2.4)) - 0.055, step(0.0031308, c)); }
      void main(){
        vec2 uv = gl_FragCoord.xy / uRes;
        vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 1.6;
        float t = uTime * 0.018;
        vec2 ptr = vec2(uPtr.x * uRes.x / uRes.y, uPtr.y) * 1.6;
        vec2 d = p - ptr; float dl = length(d);
        p += normalize(d + 0.0001) * uPtrAmt * 0.35 * exp(-dl * 3.2);
        p.y -= t;
        vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3 - t)));
        vec2 r = vec2(fbm(p + 3.0*q + vec2(1.7, 9.2) + 0.6*t), fbm(p + 3.0*q + vec2(8.3, 2.8) - 0.4*t));
        float f = fbm(p + 3.2*r);
        vec3 c = uPaper;
        c = mix(c, uVeil, smoothstep(0.35, 0.85, f) * 0.85);
        c = mix(c, uAmber, smoothstep(0.55, 0.95, length(q)) * 0.10);
        c = mix(c, uLit, smoothstep(0.45, 0.9, r.x) * 0.55);
        c = mix(c, uTint, uTintAmt * smoothstep(0.3, 0.9, f) * 0.22);
        gl_FragColor = vec4(toSrgb(c), 1.0);
      }`;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const u = (n) => gl.getUniformLocation(prog, n);
    const U = { res: u('uRes'), time: u('uTime'), paper: u('uPaper'), veil: u('uVeil'), amber: u('uAmber'), lit: u('uLit'), tint: u('uTint'), tintAmt: u('uTintAmt'), ptr: u('uPtr'), ptrAmt: u('uPtrAmt') };
    gl.uniform3fv(U.paper, token('--color-paper'));
    gl.uniform3fv(U.veil, token('--color-paper-3'));
    gl.uniform3fv(U.amber, token('--stain-3'));
    gl.uniform3fv(U.lit, token('--card-lit'));
    let tint = token('--stain-3');
    gl.uniform3fv(U.tint, tint);

    const resize = () => {
      const w = Math.max(1, Math.round(innerWidth * 0.5)), hgt = Math.max(1, Math.round(innerHeight * 0.5));
      canvas.width = w; canvas.height = hgt;
      gl.viewport(0, 0, w, hgt);
      gl.uniform2f(U.res, w, hgt);
    };
    resize();

    const s = { time: 40, last: 0, ptr: [0.5, 0.5], ptrAmt: 0, tintAmt: 0, tintTarget: 0, visible: true, held: reduced, raf: 0 };
    const draw = () => {
      gl.uniform1f(U.time, s.time);
      gl.uniform2f(U.ptr, s.ptr[0], s.ptr[1]);
      gl.uniform1f(U.ptrAmt, s.ptrAmt);
      gl.uniform1f(U.tintAmt, s.tintAmt);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const frame = (now) => {
      const dt = s.last ? Math.min(0.05, (now - s.last) / 1000) : 0;
      s.last = now;
      s.time += dt;
      s.ptrAmt *= Math.pow(0.35, dt);
      s.tintAmt += (s.tintTarget - s.tintAmt) * Math.min(1, dt * 1.5);
      draw();
      s.raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      const run = s.visible && !s.held && !document.hidden;
      if (run && !s.raf) { s.last = 0; s.raf = requestAnimationFrame(frame); }
      if (!run && s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; draw(); }
    };
    draw();

    addEventListener('resize', () => { resize(); draw(); }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    addEventListener('pointermove', (e) => {
      if (s.held) return;
      s.ptr = [e.clientX / innerWidth, 1 - e.clientY / innerHeight];
      s.ptrAmt = Math.min(1, s.ptrAmt + 0.08);
    }, { passive: true });

    const zones = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? zones.add(e.target) : zones.delete(e.target)));
      s.visible = zones.size > 0;
      sync();
    });
    document.querySelectorAll('[data-air-zone]').forEach((z) => io.observe(z));

    return {
      tint(name) { tint = token(name); gl.uniform3fv(U.tint, tint); s.tintTarget = 1; if (!s.raf) { s.tintAmt = 1; draw(); } },
      hold(v) { s.held = v; sync(); },
      held: () => s.held,
    };
  })();

  const toggle = document.querySelector('[data-air-toggle]');
  if (toggle) {
    if (!air || reduced) toggle.parentElement.hidden = true;
    else toggle.addEventListener('click', () => {
      const held = !air.held();
      air.hold(held);
      toggle.setAttribute('aria-pressed', String(held));
      toggle.textContent = held ? toggle.dataset.labelMove : toggle.dataset.labelStill;
    });
  }

  /* ---------- the service choices ---------- */
  document.querySelectorAll('[data-sampler]').forEach((box) => {
    const tabs = [...box.querySelectorAll('[role="tab"]')];
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (air && tab.dataset.tint) air.tint(tab.dataset.tint);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t, false));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        let j = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') j = (i + 1) % tabs.length;
        if (k === 'ArrowLeft' || k === 'ArrowUp') j = (i - 1 + tabs.length) % tabs.length;
        if (k === 'Home') j = 0;
        if (k === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    tabs.forEach((t) => {
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = t.getAttribute('aria-selected') !== 'true';
    });
  });

  /* ---------- films: load the Drive player only when asked ---------- */
  document.querySelectorAll('[data-film]').forEach((frame) => {
    const link = frame.querySelector('.film__play');
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const f = document.createElement('iframe');
      f.src = `https://drive.google.com/file/d/${frame.dataset.film}/preview`;
      f.title = frame.dataset.filmTitle || '';
      f.allow = 'autoplay; fullscreen';
      f.allowFullscreen = true;
      frame.replaceChildren(f);
      f.focus();
    });
  });

  /* ---------- the photo viewer ---------- */
  const dlg = document.querySelector('.viewer');
  if (dlg && typeof dlg.showModal === 'function') {
    const img = document.createElement('img');
    img.className = 'viewer__img';
    img.decoding = 'async';
    dlg.querySelector('.viewer__fig').prepend(img);
    const text = dlg.querySelector('.viewer__text');
    const count = dlg.querySelector('.viewer__count');
    const prevBtn = dlg.querySelector('[data-viewer-prev]');
    const nextBtn = dlg.querySelector('[data-viewer-next]');
    const of = dlg.dataset.of || 'of';
    let list = [], at = 0, opener = null;

    const show = (i) => {
      at = (i + list.length) % list.length;
      const a = list[at];
      const inner = a.querySelector('img');
      img.classList.add('is-loading');
      img.onload = () => img.classList.remove('is-loading');
      img.src = a.href;
      img.alt = inner ? inner.alt : '';
      text.textContent = a.dataset.caption || img.alt;
      count.textContent = list.length > 1 ? `${at + 1} ${of} ${list.length}` : '';
      prevBtn.hidden = nextBtn.hidden = list.length < 2;
      [at - 1, at + 1].forEach((k) => { const n = list[(k + list.length) % list.length]; if (n) { const p = new Image(); p.src = n.href; } });
    };
    const open = (a) => {
      list = [...document.querySelectorAll(`[data-viewer="${a.dataset.viewer}"]`)];
      opener = a;
      root.classList.add('viewer-open');
      dlg.showModal();
      show(list.indexOf(a));
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('[data-viewer]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      open(a);
    });
    prevBtn.addEventListener('click', () => show(at - 1));
    nextBtn.addEventListener('click', () => show(at + 1));
    dlg.querySelector('[data-viewer-close]').addEventListener('click', () => dlg.close());
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(at - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
    });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => {
      root.classList.remove('viewer-open');
      img.removeAttribute('src');
      if (opener) opener.focus();
    });
    let x0 = null;
    img.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
    img.addEventListener('pointerup', (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 48) show(at + (dx < 0 ? 1 : -1));
    });
  }

  /* ---------- the plate list follows the scroll ---------- */
  const items = new Map([...document.querySelectorAll('[data-plate]')].map((li) => [li.dataset.plate, li]));
  if (items.size) {
    const pio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      items.forEach((li, k) => li.setAttribute('aria-current', String(k === e.target.dataset.plateFigure)));
    }), { rootMargin: '-45% 0px -45% 0px' });
    document.querySelectorAll('[data-plate-figure]').forEach((f) => pio.observe(f));
  }
})();
