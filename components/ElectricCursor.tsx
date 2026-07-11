"use client";

import { useEffect } from "react";

/**
 * Custom electric-themed cursor (WEB changes V1.1 — Sr No 1 & 2).
 *
 * - A bright yellow lightning-bolt cursor with a soft, pulsing glow.
 * - Smooth trailing spark particles as the pointer moves.
 * - Click → white flash + electric discharge (sparks), an expanding energy
 *   ring and a subtle screen shake, then the glow fades (~300–600ms).
 * - Hovering an interactive element (button / link / card) brightens and
 *   enlarges the bolt and adds a glow; disabled controls give a weak red
 *   short-circuit flicker instead.
 *
 * Everything is drawn on a single pointer-events:none canvas + one bolt
 * element, so it never intercepts clicks. Fully disabled on touch devices
 * and for users who prefer reduced motion.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1 remaining
  decay: number;
  size: number;
  color: string;
};

type Ring = {
  x: number;
  y: number;
  r: number;
  maxR: number;
  life: number;
  color: string;
};

const COLORS = {
  boltYellow: "#FFD400",
  boltBright: "#FFEA00",
  cyan: "#00E5FF",
  blue: "#4FC3F7",
  white: "#FFFFFF",
  red: "#FF3B3B",
};

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label, summary, [data-cursor="interactive"]';

export default function ElectricCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!finePointer || reducedMotion) return;

    // ---- DOM setup ---------------------------------------------------------
    const root = document.documentElement;
    root.classList.add("electric-cursor-active");

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "2147483646",
    } as CSSStyleDeclaration);
    document.body.appendChild(canvas);

    const bolt = document.createElement("div");
    bolt.setAttribute("aria-hidden", "true");
    bolt.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L4.5 13.5H11L9 22L19.5 9.5H13L13 2Z"
          fill="${COLORS.boltBright}" stroke="${COLORS.white}" stroke-width="0.75"
          stroke-linejoin="round"/>
      </svg>`;
    Object.assign(bolt.style, {
      position: "fixed",
      top: "0",
      left: "0",
      pointerEvents: "none",
      zIndex: "2147483647",
      transform: "translate3d(-100px,-100px,0)",
      transformOrigin: "4px 2px",
      transition: "filter 120ms ease, opacity 200ms ease",
      willChange: "transform",
      filter: `drop-shadow(0 0 4px ${COLORS.boltYellow})`,
    } as CSSStyleDeclaration);
    document.body.appendChild(bolt);

    const ctx = canvas.getContext("2d");
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    // ---- State -------------------------------------------------------------
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: target.x, y: target.y };
    let lastX = pos.x;
    let lastY = pos.y;
    let hoverScale = 1;
    let hoverScaleTarget = 1;
    let mode: "normal" | "interactive" | "disabled" = "normal";
    let visible = false;
    let pulse = 0;

    const particles: Particle[] = [];
    const rings: Ring[] = [];

    function rand(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function spawnTrail(speed: number) {
      // Small trailing sparks — count scales with pointer speed.
      const count = Math.min(3, Math.floor(speed / 6));
      for (let i = 0; i < count; i++) {
        const palette =
          mode === "disabled"
            ? [COLORS.red, COLORS.red]
            : [COLORS.boltYellow, COLORS.cyan, COLORS.white];
        particles.push({
          x: pos.x + rand(-2, 2),
          y: pos.y + rand(-2, 2),
          vx: rand(-0.6, 0.6) - (target.x - pos.x) * 0.02,
          vy: rand(-0.6, 0.6) - (target.y - pos.y) * 0.02,
          life: 1,
          decay: rand(0.05, 0.09),
          size: rand(0.8, 2),
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
    }

    function burst(x: number, y: number) {
      const disabled = mode === "disabled";
      // Sparks scatter outward (electrical discharge).
      const n = disabled ? 8 : 22;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + rand(-0.25, 0.25);
        const sp = disabled ? rand(0.6, 2) : rand(2, 7);
        const palette = disabled
          ? [COLORS.red]
          : [COLORS.boltBright, COLORS.cyan, COLORS.blue, COLORS.white];
        particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          decay: rand(0.02, 0.05),
          size: rand(1, 3),
          color: palette[Math.floor(Math.random() * palette.length)],
        });
      }
      // Expanding energy ring (capacitor discharge).
      rings.push({
        x,
        y,
        r: 4,
        maxR: disabled ? 22 : 46,
        life: 1,
        color: disabled ? COLORS.red : COLORS.cyan,
      });
      if (!disabled) {
        rings.push({
          x,
          y,
          r: 2,
          maxR: 30,
          life: 1,
          color: COLORS.boltBright,
        });
      }
      // Subtle screen shake (2–4px) on a real (non-disabled) discharge.
      if (!disabled) shake();
    }

    let shakeUntil = 0;
    function shake() {
      shakeUntil = performance.now() + 130;
    }

    // ---- Interaction detection --------------------------------------------
    let rafPending = false;
    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      ensureRunning();
      if (!visible) {
        visible = true;
        bolt.style.opacity = "1";
      }
      if (!rafPending) {
        rafPending = true;
        requestAnimationFrame(() => {
          rafPending = false;
          const el = e.target as Element | null;
          const interactive = el?.closest?.(INTERACTIVE_SELECTOR) as
            | HTMLElement
            | null;
          if (interactive) {
            const isDisabled =
              interactive.hasAttribute("disabled") ||
              interactive.getAttribute("aria-disabled") === "true";
            mode = isDisabled ? "disabled" : "interactive";
            hoverScaleTarget = isDisabled ? 1.15 : 1.45;
          } else {
            mode = "normal";
            hoverScaleTarget = 1;
          }
        });
      }
    }

    function onDown(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      pos.x = e.clientX;
      pos.y = e.clientY;
      burst(e.clientX, e.clientY);
      ensureRunning();
    }

    function onLeave() {
      visible = false;
      bolt.style.opacity = "0";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerout", (e) => {
      if (!e.relatedTarget) onLeave();
    });

    // ---- Render loop (self-suspending when idle to stay lightweight) ------
    let raf = 0;
    let running = false;
    function ensureRunning() {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    function frame() {
      if (!ctx) {
        running = false;
        return;
      }

      // Smoothly ease the bolt toward the pointer.
      pos.x += (target.x - pos.x) * 0.35;
      pos.y += (target.y - pos.y) * 0.35;
      const dx = pos.x - lastX;
      const dy = pos.y - lastY;
      const speed = Math.hypot(dx, dy);
      lastX = pos.x;
      lastY = pos.y;
      spawnTrail(speed);

      hoverScale += (hoverScaleTarget - hoverScale) * 0.2;
      pulse += 0.08;
      const glow = 4 + Math.sin(pulse) * 1.5 + (hoverScale - 1) * 10;

      // Screen shake.
      const now = performance.now();
      if (now < shakeUntil) {
        const mag = 3 * ((shakeUntil - now) / 130);
        root.style.setProperty(
          "--electric-shake",
          `translate3d(${rand(-mag, mag)}px, ${rand(-mag, mag)}px, 0)`,
        );
      } else {
        root.style.removeProperty("--electric-shake");
      }

      // Position + style the bolt.
      const boltColor =
        mode === "disabled" ? COLORS.red : COLORS.boltBright;
      bolt.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${hoverScale})`;
      bolt.style.filter = `drop-shadow(0 0 ${glow}px ${
        mode === "disabled" ? COLORS.red : COLORS.boltYellow
      }) drop-shadow(0 0 ${glow * 2}px ${
        mode === "interactive" ? COLORS.cyan : "transparent"
      })`;
      const path = bolt.querySelector("path");
      if (path) path.setAttribute("fill", boltColor);

      // Clear + draw with additive blending for an electric glow.
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.r += (r.maxR - r.r) * 0.18;
        r.life -= 0.06;
        if (r.life <= 0) {
          rings.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, r.life) * 0.7;
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2 * r.life;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // Suspend the loop once everything has settled — restarts on the next
      // pointer move / click. Keeps the effect idle-cheap.
      const settled =
        particles.length === 0 &&
        rings.length === 0 &&
        Math.hypot(target.x - pos.x, target.y - pos.y) < 0.5 &&
        Math.abs(hoverScaleTarget - hoverScale) < 0.01 &&
        now >= shakeUntil;
      if (settled) {
        running = false;
        root.style.removeProperty("--electric-shake");
      } else {
        raf = requestAnimationFrame(frame);
      }
    }
    ensureRunning();

    // ---- Cleanup -----------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      root.classList.remove("electric-cursor-active");
      root.style.removeProperty("--electric-shake");
      canvas.remove();
      bolt.remove();
    };
  }, []);

  return null;
}
