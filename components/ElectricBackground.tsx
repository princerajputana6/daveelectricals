"use client";

import { useEffect, useRef } from "react";

type Pulse = { node: number; t: number; speed: number };
type Node = { x: number; y: number };
type Edge = [number, number];

export default function ElectricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.max(5, Math.round(w / 170));
      const rows = Math.max(4, Math.round(h / 150));
      nodes = [];
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          nodes.push({
            x: (c / cols) * w + (Math.random() - 0.5) * 60,
            y: (r / rows) * h + (Math.random() - 0.5) * 60,
          });
        }
      }
      edges = [];
      const rowCount = rows + 1;
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const i = c * rowCount + r;
          if (r < rows && Math.random() > 0.25) edges.push([i, i + 1]);
          if (c < cols && Math.random() > 0.25)
            edges.push([i, i + rowCount]);
        }
      }
      pulses = Array.from({ length: reduce ? 6 : 22 }, () => ({
        node: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.0026 + Math.random() * 0.006,
      }));
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255, 212, 0, 0.07)";
      for (const [a, b] of edges) {
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }

      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 212, 0, 0.22)";
        ctx.fill();
      }

      for (const p of pulses) {
        const edge = edges[p.node];
        if (!edge) continue;
        const a = nodes[edge[0]];
        const b = nodes[edge[1]];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, 16);
        grad.addColorStop(0, "rgba(255, 240, 122, 0.95)");
        grad.addColorStop(0.4, "rgba(255, 212, 0, 0.55)");
        grad.addColorStop(1, "rgba(255, 212, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#fff7c2";
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();

        if (!reduce) p.t += p.speed;
        if (p.t >= 1) {
          p.t = 0;
          p.node = Math.floor(Math.random() * edges.length);
          p.speed = 0.0026 + Math.random() * 0.006;
        }
      }

      raf = requestAnimationFrame(draw);
    };

    build();
    draw();
    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
