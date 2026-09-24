/**
 * Quick Cash - Pixel Art Sprite Matrix Engine
 * Built strictly according to pixel-art-creator skill specifications
 * (16x16 / 24x24 indexed coordinate matrices, 3-color ramp shading, crisp pixelated rendering)
 */

(function(window) {
  'use strict';

  // 1. SAFE: 16x16 Emerald Shield (3-color ramp + gold rivet emblem)
  const SHIELD_16x16 = {
    width: 16,
    height: 16,
    palette: [
      'transparent',            // 0
      '#064e3b',                // 1: Dark Green Outline
      '#059669',                // 2: Base Emerald Green
      '#34d399',                // 3: Light Emerald Highlight
      '#fef08a',                // 4: Gold Rivet
      '#d97706'                 // 5: Gold Shadow
    ],
    pixels: [
      {x:4,y:1,c:1},{x:5,y:1,c:1},{x:6,y:1,c:1},{x:7,y:1,c:1},{x:8,y:1,c:1},{x:9,y:1,c:1},{x:10,y:1,c:1},{x:11,y:1,c:1},
      {x:3,y:2,c:1},{x:4,y:2,c:3},{x:5,y:2,c:3},{x:6,y:2,c:3},{x:7,y:2,c:3},{x:8,y:2,c:2},{x:9,y:2,c:2},{x:10,y:2,c:2},{x:11,y:2,c:2},{x:12,y:2,c:1},
      {x:2,y:3,c:1},{x:3,y:3,c:3},{x:4,y:3,c:3},{x:5,y:3,c:3},{x:6,y:3,c:3},{x:7,y:3,c:3},{x:8,y:3,c:2},{x:9,y:2,c:2},{x:10,y:3,c:2},{x:11,y:3,c:2},{x:12,y:3,c:2},{x:13,y:3,c:1},
      {x:2,y:4,c:1},{x:3,y:4,c:3},{x:4,y:4,c:3},{x:7,y:4,c:4},{x:8,y:4,c:4},{x:11,y:4,c:2},{x:12,y:4,c:2},{x:13,y:4,c:1},
      {x:2,y:5,c:1},{x:3,y:5,c:3},{x:6,y:5,c:4},{x:7,y:5,c:4},{x:8,y:5,c:5},{x:9,y:5,c:5},{x:12,y:5,c:2},{x:13,y:5,c:1},
      {x:2,y:6,c:1},{x:3,y:6,c:3},{x:6,y:6,c:4},{x:7,y:6,c:4},{x:8,y:6,c:5},{x:9,y:6,c:5},{x:12,y:6,c:2},{x:13,y:6,c:1},
      {x:2,y:7,c:1},{x:3,y:7,c:3},{x:4,y:7,c:3},{x:7,y:7,c:5},{x:8,y:7,c:5},{x:11,y:7,c:2},{x:12,y:7,c:2},{x:13,y:7,c:1},
      {x:2,y:8,c:1},{x:3,y:8,c:3},{x:4,y:8,c:3},{x:5,y:8,c:3},{x:6,y:8,c:2},{x:7,y:8,c:2},{x:8,y:8,c:2},{x:9,y:8,c:2},{x:10,y:8,c:2},{x:11,y:8,c:2},{x:12,y:8,c:2},{x:13,y:8,c:1},
      {x:3,y:9,c:1},{x:4,y:9,c:3},{x:5,y:9,c:3},{x:6,y:9,c:3},{x:7,y:9,c:2},{x:8,y:9,c:2},{x:9,y:9,c:2},{x:10,y:9,c:2},{x:11,y:9,c:2},{x:12,y:9,c:1},
      {x:3,y:10,c:1},{x:4,y:10,c:3},{x:5,y:10,c:3},{x:6,y:10,c:2},{x:7,y:10,c:2},{x:8,y:10,c:2},{x:9,y:10,c:2},{x:10,y:10,c:2},{x:11,y:10,c:2},{x:12,y:10,c:1},
      {x:4,y:11,c:1},{x:5,y:11,c:3},{x:6,y:11,c:2},{x:7,y:11,c:2},{x:8,y:11,c:2},{x:9,y:11,c:2},{x:10,y:11,c:2},{x:11,y:11,c:1},
      {x:5,y:12,c:1},{x:6,y:12,c:2},{x:7,y:12,c:2},{x:8,y:12,c:2},{x:9,y:12,c:2},{x:10,y:12,c:1},
      {x:6,y:13,c:1},{x:7,y:13,c:2},{x:8,y:13,c:2},{x:9,y:13,c:1},
      {x:7,y:14,c:1},{x:8,y:14,c:1}
    ]
  };

  // 2. MEDIUM: 16x16 Golden Scale of Justice (Balanced Risk)
  const SCALE_16x16 = {
    width: 16,
    height: 16,
    palette: [
      'transparent',            // 0
      '#451a03',                // 1: Dark Brown Outline
      '#d97706',                // 2: Gold Base
      '#fbbf24',                // 3: Gold Highlight
      '#92400e'                 // 4: Bronze Shadow
    ],
    pixels: [
      {x:7,y:1,c:1},{x:8,y:1,c:1},
      {x:7,y:2,c:3},{x:8,y:2,c:2},
      {x:3,y:3,c:1},{x:4,y:3,c:1},{x:5,y:3,c:1},{x:6,y:3,c:1},{x:7,y:3,c:3},{x:8,y:3,c:2},{x:9,y:3,c:1},{x:10,y:3,c:1},{x:11,y:3,c:1},{x:12,y:3,c:1},
      {x:2,y:4,c:1},{x:3,y:4,c:3},{x:4,y:4,c:3},{x:5,y:4,c:3},{x:7,y:4,c:2},{x:8,y:4,c:4},{x:10,y:4,c:3},{x:11,y:4,c:3},{x:12,y:4,c:2},{x:13,y:4,c:1},
      {x:2,y:5,c:1},{x:5,y:5,c:1},{x:7,y:5,c:2},{x:8,y:5,c:4},{x:10,y:5,c:1},{x:13,y:5,c:1},
      {x:2,y:6,c:1},{x:5,y:6,c:1},{x:7,y:6,c:2},{x:8,y:6,c:4},{x:10,y:6,c:1},{x:13,y:6,c:1},
      {x:1,y:7,c:1},{x:2,y:7,c:3},{x:3,y:7,c:3},{x:4,y:7,c:2},{x:5,y:7,c:2},{x:6,y:7,c:1},{x:7,y:7,c:2},{x:8,y:7,c:4},{x:9,y:7,c:1},{x:10,y:7,c:3},{x:11,y:7,c:3},{x:12,y:7,c:2},{x:13,y:7,c:2},{x:14,y:7,c:1},
      {x:2,y:8,c:1},{x:3,y:8,c:2},{x:4,y:8,c:4},{x:5,y:8,c:1},{x:7,y:8,c:2},{x:8,y:8,c:4},{x:10,y:8,c:1},{x:11,y:8,c:2},{x:12,y:8,c:4},{x:13,y:8,c:1},
      {x:7,y:9,c:2},{x:8,y:9,c:4},
      {x:7,y:10,c:2},{x:8,y:10,c:4},
      {x:7,y:11,c:2},{x:8,y:11,c:4},
      {x:7,y:12,c:2},{x:8,y:12,c:4},
      {x:5,y:13,c:1},{x:6,y:13,c:1},{x:7,y:13,c:3},{x:8,y:13,c:2},{x:9,y:13,c:1},{x:10,y:13,c:1},
      {x:4,y:14,c:1},{x:5,y:14,c:3},{x:6,y:14,c:3},{x:7,y:14,c:2},{x:8,y:14,c:4},{x:9,y:14,c:4},{x:10,y:14,c:4},{x:11,y:14,c:1}
    ]
  };

  // 3. HIGH RISK: 16x16 Crimson Skull
  const SKULL_16x16 = {
    width: 16,
    height: 16,
    palette: [
      'transparent',            // 0
      '#450a0a',                // 1: Dark Crimson Outline
      '#ef4444',                // 2: Crimson Base
      '#fca5a5',                // 3: Highlight
      '#991b1b',                // 4: Deep Shadow
      '#180808'                 // 5: Eye Socket Void
    ],
    pixels: [
      {x:5,y:1,c:1},{x:6,y:1,c:1},{x:7,y:1,c:1},{x:8,y:1,c:1},{x:9,y:1,c:1},{x:10,y:1,c:1},
      {x:3,y:2,c:1},{x:4,y:2,c:3},{x:5,y:2,c:3},{x:6,y:2,c:3},{x:7,y:2,c:3},{x:8,y:2,c:2},{x:9,y:2,c:2},{x:10,y:2,c:2},{x:11,y:2,c:2},{x:12,y:2,c:1},
      {x:2,y:3,c:1},{x:3,y:3,c:3},{x:4,y:3,c:3},{x:5,y:3,c:3},{x:6,y:3,c:2},{x:7,y:3,c:2},{x:8,y:3,c:2},{x:9,y:3,c:2},{x:10,y:3,c:2},{x:11,y:3,c:4},{x:12,y:3,c:4},{x:13,y:3,c:1},
      {x:2,y:4,c:1},{x:3,y:4,c:3},{x:4,y:4,c:5},{x:5,y:4,c:5},{x:6,y:4,c:2},{x:7,y:4,c:2},{x:8,y:4,c:2},{x:9,y:4,c:2},{x:10,y:4,c:5},{x:11,y:4,c:5},{x:12,y:4,c:4},{x:13,y:4,c:1},
      {x:2,y:5,c:1},{x:3,y:5,c:3},{x:4,y:5,c:5},{x:5,y:5,c:5},{x:6,y:5,c:2},{x:7,y:5,c:2},{x:8,y:5,c:2},{x:9,y:5,c:2},{x:10,y:5,c:5},{x:11,y:5,c:5},{x:12,y:5,c:4},{x:13,y:5,c:1},
      {x:2,y:6,c:1},{x:3,y:6,c:3},{x:4,y:6,c:2},{x:5,y:6,c:2},{x:6,y:6,c:2},{x:7,y:6,c:5},{x:8,y:6,c:5},{x:9,y:6,c:2},{x:10,y:6,c:2},{x:11,y:6,c:4},{x:12,y:6,c:4},{x:13,y:6,c:1},
      {x:3,y:7,c:1},{x:4,y:7,c:2},{x:5,y:7,c:2},{x:6,y:7,c:2},{x:7,y:7,c:5},{x:8,y:7,c:5},{x:9,y:7,c:2},{x:10,y:7,c:2},{x:11,y:7,c:4},{x:12,y:7,c:1},
      {x:4,y:8,c:1},{x:5,y:8,c:1},{x:6,y:8,c:2},{x:7,y:8,c:2},{x:8,y:8,c:2},{x:9,y:8,c:4},{x:10,y:8,c:1},{x:11,y:8,c:1},
      {x:4,y:9,c:1},{x:5,y:9,c:3},{x:6,y:9,c:1},{x:7,y:9,c:3},{x:8,y:9,c:2},{x:9,y:9,c:1},{x:10,y:9,c:4},{x:11,y:9,c:1},
      {x:4,y:10,c:1},{x:5,y:10,c:3},{x:6,y:10,c:1},{x:7,y:10,c:3},{x:8,y:10,c:2},{x:9,y:10,c:1},{x:10,y:10,c:4},{x:11,y:10,c:1},
      {x:4,y:11,c:1},{x:5,y:11,c:1},{x:6,y:11,c:1},{x:7,y:11,c:1},{x:8,y:11,c:1},{x:9,y:11,c:1},{x:10,y:11,c:1},{x:11,y:11,c:1}
    ]
  };

  // 4. RETURN VALUE: 16x16 Gold Coin
  const COIN_16x16 = {
    width: 16,
    height: 16,
    palette: [
      'transparent',            // 0
      '#78350f',                // 1: Outline
      '#f59e0b',                // 2: Base Gold
      '#fef08a',                // 3: Specular Highlight
      '#b45309'                 // 4: Rim Shadow
    ],
    pixels: [
      {x:5,y:2,c:1},{x:6,y:2,c:1},{x:7,y:2,c:1},{x:8,y:2,c:1},{x:9,y:2,c:1},{x:10,y:2,c:1},
      {x:3,y:3,c:1},{x:4,y:3,c:3},{x:5,y:3,c:3},{x:6,y:3,c:3},{x:7,y:3,c:3},{x:8,y:3,c:2},{x:9,y:2,c:2},{x:10,y:3,c:2},{x:11,y:3,c:2},{x:12,y:3,c:1},
      {x:2,y:4,c:1},{x:3,y:4,c:3},{x:4,y:4,c:3},{x:5,y:4,c:1},{x:6,y:4,c:1},{x:7,y:4,c:1},{x:8,y:4,c:1},{x:9,y:4,c:1},{x:10,y:4,c:1},{x:11,y:4,c:2},{x:12,y:4,c:4},{x:13,y:4,c:1},
      {x:2,y:5,c:1},{x:3,y:5,c:3},{x:4,y:5,c:1},{x:7,y:5,c:3},{x:8,y:5,c:3},{x:11,y:5,c:1},{x:12,y:5,c:4},{x:13,y:5,c:1},
      {x:1,y:6,c:1},{x:2,y:6,c:3},{x:3,y:6,c:1},{x:6,y:6,c:3},{x:7,y:6,c:3},{x:8,y:6,c:2},{x:12,y:6,c:1},{x:13,y:6,c:4},{x:14,y:6,c:1},
      {x:1,y:7,c:1},{x:2,y:7,c:3},{x:3,y:7,c:1},{x:6,y:7,c:3},{x:7,y:7,c:2},{x:12,y:7,c:1},{x:13,y:7,c:4},{x:14,y:7,c:1},
      {x:1,y:8,c:1},{x:2,y:8,c:3},{x:3,y:8,c:1},{x:7,y:8,c:2},{x:8,y:8,c:2},{x:12,y:8,c:1},{x:13,y:8,c:4},{x:14,y:8,c:1},
      {x:1,y:9,c:1},{x:2,y:9,c:2},{x:3,y:9,c:1},{x:8,y:9,c:2},{x:9,y:9,c:4},{x:12,y:9,c:1},{x:13,y:9,c:4},{x:14,y:9,c:1},
      {x:2,y:10,c:1},{x:3,y:10,c:2},{x:4,y:10,c:1},{x:7,y:10,c:4},{x:8,y:10,c:4},{x:11,y:10,c:1},{x:12,y:10,c:4},{x:13,y:10,c:1},
      {x:2,y:11,c:1},{x:3,y:11,c:2},{x:4,y:11,c:4},{x:5,y:11,c:1},{x:6,y:11,c:1},{x:7,y:11,c:1},{x:8,y:11,c:1},{x:9,y:11,c:1},{x:10,y:11,c:1},{x:11,y:11,c:4},{x:12,y:11,c:4},{x:13,y:11,c:1},
      {x:3,y:12,c:1},{x:4,y:12,c:2},{x:5,y:12,c:4},{x:6,y:12,c:4},{x:7,y:12,c:4},{x:8,y:12,c:4},{x:9,y:12,c:4},{x:10,y:12,c:4},{x:11,y:12,c:4},{x:12,y:12,c:1},
      {x:5,y:13,c:1},{x:6,y:13,c:1},{x:7,y:13,c:1},{x:8,y:13,c:1},{x:9,y:13,c:1},{x:10,y:13,c:1}
    ]
  };

  // 5. TIMER: 16x16 Pixel Hourglass
  const HOURGLASS_16x16 = {
    width: 16,
    height: 16,
    palette: [
      'transparent',            // 0
      '#1e1b4b',                // 1: Dark Indigo Outline
      '#6366f1',                // 2: Glass Tint
      '#fbbf24',                // 3: Golden Sand
      '#fef08a'                 // 4: Flowing Stream
    ],
    pixels: [
      {x:3,y:2,c:1},{x:4,y:2,c:1},{x:5,y:2,c:1},{x:6,y:2,c:1},{x:7,y:2,c:1},{x:8,y:2,c:1},{x:9,y:2,c:1},{x:10,y:2,c:1},{x:11,y:2,c:1},{x:12,y:2,c:1},
      {x:4,y:3,c:1},{x:5,y:3,c:3},{x:6,y:3,c:3},{x:7,y:3,c:3},{x:8,y:3,c:3},{x:9,y:3,c:3},{x:10,y:3,c:3},{x:11,y:3,c:1},
      {x:4,y:4,c:1},{x:5,y:4,c:2},{x:6,y:4,c:3},{x:7,y:4,c:3},{x:8,y:4,c:3},{x:9,y:4,c:3},{x:10,y:4,c:2},{x:11,y:4,c:1},
      {x:5,y:5,c:1},{x:6,y:5,c:2},{x:7,y:5,c:3},{x:8,y:5,c:3},{x:9,y:5,c:2},{x:10,y:5,c:1},
      {x:6,y:6,c:1},{x:7,y:6,c:2},{x:8,y:6,c:2},{x:9,y:6,c:1},
      {x:7,y:7,c:1},{x:8,y:7,c:1},
      {x:7,y:8,c:4},{x:8,y:8,c:1},
      {x:6,y:9,c:1},{x:7,y:9,c:4},{x:8,y:9,c:2},{x:9,y:9,c:1},
      {x:5,y:10,c:1},{x:6,y:10,c:2},{x:7,y:10,c:4},{x:8,y:10,c:2},{x:9,y:10,c:2},{x:10,y:10,c:1},
      {x:4,y:11,c:1},{x:5,y:11,c:2},{x:6,y:11,c:3},{x:7,y:11,c:3},{x:8,y:11,c:3},{x:9,y:11,c:3},{x:10,y:11,c:2},{x:11,y:11,c:1},
      {x:4,y:12,c:1},{x:5,y:12,c:3},{x:6,y:12,c:3},{x:7,y:12,c:3},{x:8,y:12,c:3},{x:9,y:12,c:3},{x:10,y:12,c:3},{x:11,y:12,c:1},
      {x:3,y:13,c:1},{x:4,y:13,c:1},{x:5,y:13,c:1},{x:6,y:13,c:1},{x:7,y:13,c:1},{x:8,y:13,c:1},{x:9,y:13,c:1},{x:10,y:13,c:1},{x:11,y:13,c:1},{x:12,y:13,c:1}
    ]
  };

  const SPRITE_MAP = {
    shield: SHIELD_16x16,
    scale: SCALE_16x16,
    skull: SKULL_16x16,
    coin: COIN_16x16,
    hourglass: HOURGLASS_16x16
  };

  /**
   * Generates SVG string for any sprite
   */
  function getSpriteSvg(name, size = 24, className = '') {
    const sprite = SPRITE_MAP[name] || SPRITE_MAP.shield;
    const { width, height, palette, pixels } = sprite;
    let rects = '';
    for (let i = 0; i < pixels.length; i++) {
      const p = pixels[i];
      rects += `<rect x="${p.x}" y="${p.y}" width="1" height="1" fill="${palette[p.c]}"/>`;
    }
    const cls = className ? ` class="${className}"` : '';
    return `<svg viewBox="0 0 ${width} ${height}" width="${size}" height="${size}" style="image-rendering:pixelated;display:block;"${cls}>${rects}</svg>`;
  }

  window.PixelSprites = {
    SPRITE_MAP,
    getSpriteSvg
  };
})(typeof window !== 'undefined' ? window : global);
