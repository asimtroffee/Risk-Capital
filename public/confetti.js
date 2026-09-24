// Lightweight Self-Contained Canvas Confetti Engine for Risk Capital
// Zero external network dependencies, 60fps hardware-accelerated canvas particles.
window.ConfettiCelebration = (function() {
  function fire(options) {
    options = options || {};
    const particleCount = options.particleCount || 120;
    const duration = options.duration || 3500;
    const colors = options.colors || ['#fbbf24', '#f59e0b', '#10b981', '#38bdf8', '#a855f7', '#ec4899'];

    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '99999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI / 2) + (Math.random() * Math.PI - Math.PI / 2);
      const speed = 8 + Math.random() * 16;
      particles.push({
        x: width * 0.5 + (Math.random() * 100 - 50),
        y: height * 0.45 + (Math.random() * 50 - 25),
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 4,
        size: 5 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        wobbleSpeed: 0.1 + Math.random() * 0.1,
        gravity: 0.35,
        drag: 0.96,
        opacity: 1
      });
    }

    const startTime = Date.now();
    let animId = null;

    function render() {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx *= p.drag;
        p.vy = (p.vy * p.drag) + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        const wobbleX = p.x + Math.sin(p.wobble) * 4;
        const fade = progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1;

        ctx.save();
        ctx.translate(wobbleX, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, fade * p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
  }

  return { fire };
})();
