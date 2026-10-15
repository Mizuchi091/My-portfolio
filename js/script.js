(function () {
  'use strict';

  var earlyLoader = document.getElementById('page-loader');
  if (earlyLoader && document.readyState !== 'complete') earlyLoader.classList.add('is-active');

  var root = document.documentElement;
  var body = document.body;
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var storage = {
    get: function (key) { try { return window.localStorage.getItem(key); } catch (error) { return null; } },
    set: function (key, value) { try { window.localStorage.setItem(key, value); } catch (error) { /* Storage may be unavailable; keep the current-session setting. */ } }
  };

  function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
  function hexToRgb(hex) {
    var clean = String(hex || '').replace('#', '').trim();
    if (clean.length === 3) clean = clean.split('').map(function (character) { return character + character; }).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(clean)) return { r: 165, g: 255, b: 107 };
    return { r: parseInt(clean.slice(0, 2), 16), g: parseInt(clean.slice(2, 4), 16), b: parseInt(clean.slice(4, 6), 16) };
  }
  function rgbToHex(rgb) {
    function hex(value) { return Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0'); }
    return '#' + hex(rgb.r) + hex(rgb.g) + hex(rgb.b);
  }
  function blend(rgb, target, amount) {
    return { r: rgb.r + (target.r - rgb.r) * amount, g: rgb.g + (target.g - rgb.g) * amount, b: rgb.b + (target.b - rgb.b) * amount };
  }
  function luminance(rgb) {
    function linear(value) { var v = value / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return .2126 * linear(rgb.r) + .7152 * linear(rgb.g) + .0722 * linear(rgb.b);
  }
  function contrast(a, b) {
    var first = luminance(a); var second = luminance(b);
    var light = Math.max(first, second); var dark = Math.min(first, second);
    return (light + .05) / (dark + .05);
  }
  function accessibleAccent(hex, background, minimum) {
    var original = hexToRgb(hex); var bg = hexToRgb(background);
    if (contrast(original, bg) >= minimum) return rgbToHex(original);
    var black = { r: 0, g: 0, b: 0 }; var white = { r: 255, g: 255, b: 255 };
    var target = contrast(black, bg) > contrast(white, bg) ? black : white;
    var result = original;
    for (var i = 1; i <= 100; i += 1) {
      result = blend(original, target, i / 100);
      if (contrast(result, bg) >= minimum) return rgbToHex(result);
    }
    return rgbToHex(target);
  }
  function applyAccent(hex, save) {
    if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    var rgb = hexToRgb(hex);
    var ink = luminance(rgb) > .49 ? '#101710' : '#FFFFFF';
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--accent-button-text', ink);
    updateReadableAccent(hex);
    document.querySelectorAll('[data-accent]').forEach(function (button) {
      var active = button.getAttribute('data-accent').toLowerCase() === hex.toLowerCase();
      button.setAttribute('aria-pressed', String(active));
    });
    var custom = document.getElementById('custom-accent');
    if (custom) custom.value = hex;
    var customLabel = document.querySelector('.custom-swatch');
    if (customLabel) customLabel.setAttribute('aria-pressed', String(!Array.prototype.some.call(document.querySelectorAll('[data-accent]'), function (button) { return button.getAttribute('data-accent').toLowerCase() === hex.toLowerCase(); })));
    if (save) storage.set('jkp-accent', hex);
  }
  function updateReadableAccent(hex) {
    var isLight = root.getAttribute('data-theme') === 'light';
    var bg = isLight ? '#F5F7FA' : '#0B1018';
    root.style.setProperty('--accent-readable', accessibleAccent(hex, bg, 4.5));
  }
  function applyTheme(theme, save) {
    var next = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'dark' ? '#0B1018' : '#F5F7FA');
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.getAttribute('data-theme-choice') === next));
    });
    var activeAccent = root.style.getPropertyValue('--accent').trim() || '#A5FF6B';
    updateReadableAccent(activeAccent);
    if (save) storage.set('jkp-theme', next);
  }

  // Restore appearance preferences safely, including when localStorage is blocked.
  applyTheme(storage.get('jkp-theme') || 'dark', false);
  applyAccent(storage.get('jkp-accent') || '#A5FF6B', false);
  document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
    button.addEventListener('click', function () { applyTheme(button.getAttribute('data-theme-choice'), true); });
  });
  document.querySelectorAll('[data-accent]').forEach(function (button) {
    button.addEventListener('click', function () { applyAccent(button.getAttribute('data-accent'), true); });
  });
  var customAccent = document.getElementById('custom-accent');
  if (customAccent) customAccent.addEventListener('input', function () { applyAccent(customAccent.value, true); });

  // Appearance panel, including outside-click and Escape dismissal.
  var appearanceTrigger = document.getElementById('appearance-trigger');
  var appearancePanel = document.getElementById('appearance-panel');
  var appearanceClose = document.getElementById('appearance-close');
  function setAppearanceOpen(open) {
    if (!appearanceTrigger || !appearancePanel) return;
    appearancePanel.hidden = !open;
    appearanceTrigger.setAttribute('aria-expanded', String(open));
    if (open) {
      var selectedMode = appearancePanel.querySelector('[data-theme-choice][aria-pressed="true"]');
      if (selectedMode) selectedMode.focus({ preventScroll: true });
    }
  }
  if (appearanceTrigger && appearancePanel) {
    appearanceTrigger.addEventListener('click', function () { setAppearanceOpen(appearancePanel.hidden); });
    if (appearanceClose) appearanceClose.addEventListener('click', function () { setAppearanceOpen(false); appearanceTrigger.focus(); });
    document.addEventListener('click', function (event) {
      if (!appearancePanel.hidden && !appearancePanel.contains(event.target) && !appearanceTrigger.contains(event.target)) setAppearanceOpen(false);
    });
  }

  // Responsive navigation.
  var menuButton = document.getElementById('menu-toggle');
  var navigation = document.getElementById('primary-navigation');
  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
  }
  if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
      var open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      navigation.classList.toggle('is-open', open);
    });
    navigation.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', closeMenu); });
    document.addEventListener('click', function (event) {
      if (navigation.classList.contains('is-open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) closeMenu(); });
  }

  // Close popovers and the mobile menu using Escape; return focus to the trigger.
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (appearancePanel && !appearancePanel.hidden) { setAppearanceOpen(false); if (appearanceTrigger) appearanceTrigger.focus(); }
    closeMenu();
  });

  // Graceful local-image handling: CSS placeholders remain visible unless a real local file loads.
  function attachImageFallback(img, frame) {
    if (!img || !frame) return;
    function check() { if (img.complete && img.naturalWidth > 0) frame.classList.add('has-image'); else frame.classList.remove('has-image'); }
    img.addEventListener('load', check);
    img.addEventListener('error', check);
    if (img.complete) check();
  }
  attachImageFallback(document.querySelector('.profile-image'), document.getElementById('profile-frame'));
  document.querySelectorAll('.project-image').forEach(function (img) { attachImageFallback(img, img.closest('[data-image-frame]')); });

  // Rotating headline. This effect is omitted when reduced motion is requested.
  var rotatingHeadline = document.getElementById('rotating-headline');
  var headlineOptions = ['Creative Technology Enthusiast', 'Database Systems Explorer', 'Programming Learner', 'Prompting Enthusiast'];
  var headlineIndex = 0;
  if (rotatingHeadline && !reducedMotion) {
    window.setInterval(function () {
      if (document.hidden) return;
      rotatingHeadline.classList.add('is-changing');
      window.setTimeout(function () {
        headlineIndex = (headlineIndex + 1) % headlineOptions.length;
        rotatingHeadline.textContent = headlineOptions[headlineIndex];
        rotatingHeadline.classList.remove('is-changing');
      }, 170);
    }, 3200);
  }

  // Project filters.
  var filterButtons = document.querySelectorAll('[data-filter]');
  var projectCards = document.querySelectorAll('.project-card[data-category]');
  var projectCount = document.getElementById('project-count');
  function filterProjects(filter) {
    var visible = 0;
    projectCards.forEach(function (card) {
      var categories = (card.getAttribute('data-category') || '').split(/\s+/);
      var show = filter === 'all' || categories.indexOf(filter) !== -1;
      card.hidden = !show;
      if (show) visible += 1;
    });
    if (projectCount) projectCount.textContent = String(visible).padStart(2, '0') + (visible === 1 ? ' PROJECT' : ' PROJECTS');
    filterButtons.forEach(function (button) {
      var active = button.getAttribute('data-filter') === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  filterButtons.forEach(function (button) { button.addEventListener('click', function () { filterProjects(button.getAttribute('data-filter')); }); });

  // Reveal transitions only activate if IntersectionObserver exists. Without it, all content stays visible.
  if ('IntersectionObserver' in window && !reducedMotion) {
    root.classList.add('js-motion');
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('.reveal').forEach(function (element) { revealObserver.observe(element); });
  }

  // Active navigation section and top progress indicator use passive scroll events.
  var progressBar = document.getElementById('scroll-progress-bar');
  var topButton = document.getElementById('back-to-top');
  var lastScrollY = 0;
  var scrollQueued = false;
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.primary-nav a[href^="#"]'));
  function onScrollFrame() {
    scrollQueued = false;
    var scrollable = document.documentElement.scrollHeight - window.innerHeight;
    var amount = scrollable > 0 ? clamp(window.scrollY / scrollable, 0, 1) : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + amount + ')';
    if (topButton) topButton.classList.toggle('is-visible', window.scrollY > 520);
    var marker = window.scrollY + Math.min(window.innerHeight * .34, 240);
    var activeId = 'home';
    sections.forEach(function (section) { if (section.offsetTop <= marker) activeId = section.id; });
    navAnchors.forEach(function (link) {
      if (link.getAttribute('href') === '#' + activeId) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    lastScrollY = window.scrollY;
  }
  window.addEventListener('scroll', function () { if (!scrollQueued) { scrollQueued = true; window.requestAnimationFrame(onScrollFrame); } }, { passive: true });
  window.addEventListener('resize', function () { if (!scrollQueued) { scrollQueued = true; window.requestAnimationFrame(onScrollFrame); } }, { passive: true });
  onScrollFrame();
  if (topButton) topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
  var year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Decorative cursor follower for mouse devices; the native cursor remains available.
  var cursor = document.getElementById('cursor-follower');
  if (cursor && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion) {
    var cursorX = -40; var cursorY = -40; var targetX = -40; var targetY = -40; var cursorFrame = 0;
    function moveCursor() {
      cursorFrame = 0;
      cursorX += (targetX - cursorX) * .32; cursorY += (targetY - cursorY) * .32;
      cursor.style.left = cursorX + 'px'; cursor.style.top = cursorY + 'px';
      if (Math.abs(targetX - cursorX) + Math.abs(targetY - cursorY) > .6 && !document.hidden) cursorFrame = window.requestAnimationFrame(moveCursor);
    }
    document.addEventListener('pointermove', function (event) {
      targetX = event.clientX; targetY = event.clientY; cursor.classList.add('is-active');
      if (!cursorFrame && !document.hidden) cursorFrame = window.requestAnimationFrame(moveCursor);
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('is-active'); });
    document.querySelectorAll('a, button, input').forEach(function (element) {
      element.addEventListener('pointerenter', function () { cursor.classList.add('is-hovering'); });
      element.addEventListener('pointerleave', function () { cursor.classList.remove('is-hovering'); });
    });
  }

  // Lightweight pointer tilt for cards; runs only while the pointer moves over a card.
  if (!reducedMotion && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.project-card, .skill-card').forEach(function (card) {
      card.addEventListener('pointermove', function (event) {
        var rect = card.getBoundingClientRect();
        var x = (event.clientX - rect.left) / Math.max(1, rect.width);
        var y = (event.clientY - rect.top) / Math.max(1, rect.height);
        var rotateY = (x - .5) * 3.5;
        var rotateX = (.5 - y) * 3.5;
        card.style.transform = 'perspective(850px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-2px)';
      }, { passive: true });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  // Subtle, low-count particle canvas in the hero only. Pauses when off-screen or hidden.
  var canvas = document.getElementById('particle-canvas');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  if (canvas && ctx && !reducedMotion) {
    var particles = []; var canvasWidth = 0; var canvasHeight = 0; var animationId = 0; var lastPaint = 0; var heroVisible = true;
    var hero = canvas.closest('.hero');
    function resizeCanvas() {
      var rect = canvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvasWidth = Math.max(1, rect.width); canvasHeight = Math.max(1, rect.height);
      canvas.width = Math.round(canvasWidth * ratio); canvas.height = Math.round(canvasHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      var count = Math.min(24, Math.max(10, Math.round(canvasWidth / 42)));
      particles = [];
      for (var i = 0; i < count; i += 1) particles.push({ x: Math.random() * canvasWidth, y: Math.random() * canvasHeight, radius: Math.random() * 1.2 + .35, speed: Math.random() * .19 + .045, drift: (Math.random() - .5) * .14, alpha: Math.random() * .42 + .12, phase: Math.random() * Math.PI * 2 });
    }
    function drawParticles(timestamp) {
      animationId = 0;
      if (document.hidden || !heroVisible) return;
      if (timestamp - lastPaint < 32) { animationId = window.requestAnimationFrame(drawParticles); return; }
      lastPaint = timestamp;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      var accentRgb = getComputedStyle(root).getPropertyValue('--accent').trim() || '#A5FF6B';
      var rgb = hexToRgb(accentRgb);
      particles.forEach(function (particle) {
        particle.y -= particle.speed; particle.x += particle.drift; particle.phase += .012;
        if (particle.y < -4) { particle.y = canvasHeight + 4; particle.x = Math.random() * canvasWidth; }
        if (particle.x < -4) particle.x = canvasWidth + 4; if (particle.x > canvasWidth + 4) particle.x = -4;
        var alpha = particle.alpha * (.65 + .35 * Math.sin(particle.phase));
        ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + Math.round(rgb.r) + ',' + Math.round(rgb.g) + ',' + Math.round(rgb.b) + ',' + alpha + ')'; ctx.fill();
      });
      animationId = window.requestAnimationFrame(drawParticles);
    }
    function startParticles() { if (!animationId && !document.hidden && heroVisible) animationId = window.requestAnimationFrame(drawParticles); }
    function stopParticles() { if (animationId) { window.cancelAnimationFrame(animationId); animationId = 0; } }
    resizeCanvas();
    if ('IntersectionObserver' in window && hero) {
      var heroObserver = new IntersectionObserver(function (entries) { heroVisible = entries[0].isIntersecting; if (heroVisible) startParticles(); else stopParticles(); }, { threshold: 0.04 });
      heroObserver.observe(hero);
    }
    window.addEventListener('resize', function () { resizeCanvas(); startParticles(); }, { passive: true });
    document.addEventListener('visibilitychange', function () { if (document.hidden) stopParticles(); else startParticles(); });
    startParticles();
  }

  // Brief first-load transition; it is removed immediately once the document is ready.
  var loader = document.getElementById('page-loader');
  function hideLoader() { if (loader) { loader.classList.add('is-hidden'); window.setTimeout(function () { if (loader && loader.parentNode) loader.parentNode.removeChild(loader); }, 300); } }
  function queueLoaderExit() { window.requestAnimationFrame(function () { window.requestAnimationFrame(hideLoader); }); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') queueLoaderExit();
  else document.addEventListener('DOMContentLoaded', queueLoaderExit, { once: true });
}());
