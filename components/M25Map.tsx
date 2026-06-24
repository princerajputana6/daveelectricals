"use client";

import { useEffect, useRef } from "react";

/**
 * Real, interactive map (Leaflet + OpenStreetMap) with the M25 London orbital
 * motorway highlighted as a glowing yellow ring. Dark CARTO basemap so the
 * highlight reads against the rest of the site.
 *
 * The path below traces the M25 clockwise from the M1 (J21/J23) in the north,
 * round the east via the Dartford Crossing, south past Sevenoaks, and back up
 * the west side past Heathrow. It's an approximation of the carriageway good
 * enough to show our coverage ring — not a survey-grade alignment.
 */
const M25_PATH: [number, number][] = [
  [51.692, -0.187], // J23 South Mimms (M1/A1)
  [51.69, -0.146], // J24 Potters Bar
  [51.665, -0.063], // J25 Enfield
  [51.678, 0.011], // J26 Waltham Abbey
  [51.672, 0.075], // J27 M11
  [51.616, 0.246], // J28 Brentwood
  [51.566, 0.26], // J29 Upminster
  [51.484, 0.282], // J30 Thurrock
  [51.464, 0.26], // Dartford Crossing (QE2 / tunnels)
  [51.43, 0.225], // J1b Dartford
  [51.408, 0.221], // J2 A2
  [51.388, 0.168], // J3 Swanley (M20)
  [51.359, 0.103], // J4 Orpington (A21)
  [51.3, 0.085], // J5 Sevenoaks
  [51.236, -0.035], // J6 Godstone (A22)
  [51.273, -0.165], // J7 M23 (Gatwick spur)
  [51.262, -0.205], // J8 Reigate (A217)
  [51.3, -0.33], // J9 Leatherhead (A243)
  [51.305, -0.46], // J10 Wisley (A3)
  [51.378, -0.508], // J11 Chertsey (A320)
  [51.4, -0.52], // J12 M3
  [51.443, -0.52], // J13 Staines (A30)
  [51.482, -0.498], // J14 Heathrow Terminal 5
  [51.51, -0.483], // J15 M4
  [51.57, -0.49], // J16 M40
  [51.625, -0.487], // J17 Maple Cross
  [51.642, -0.46], // J18 Rickmansworth (A404)
  [51.665, -0.402], // J19 Watford (A41)
  [51.69, -0.38], // J20 Kings Langley (A41)
  [51.706, -0.33], // J21 St Albans (M1/M10)
  [51.713, -0.27], // J22 London Colney (A1081)
  [51.692, -0.187], // back to J23 — close the loop
];

const BASES = [
  { name: "Hounslow", lat: 51.4677, lng: -0.361 },
  { name: "Twickenham", lat: 51.4489, lng: -0.3314 },
  { name: "Feltham", lat: 51.4473, lng: -0.4082 },
  { name: "Cranford", lat: 51.4856, lng: -0.4313 },
];

export default function M25Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        center: [51.46, -0.12],
        zoom: 9,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      // Dark basemap WITHOUT labels, so the yellow M25 highlight pops.
      const baseLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
          subdomains: "abcd",
        },
      ).addTo(map);

      // Brighten the base so roads, boundaries and coastlines (drawn near-black
      // by default) lift toward grey/white and read clearly on the dark map.
      baseLayer.on("load", () => {
        const c = baseLayer.getContainer();
        if (c) c.style.filter = "brightness(2.1) contrast(1.15)";
      });
      const bc = baseLayer.getContainer();
      if (bc) bc.style.filter = "brightness(2.1) contrast(1.15)";

      // Place-name labels on their own pane, brightened to near-white so the
      // area names are clearly readable on the dark map.
      map.createPane("labels");
      const labelsPane = map.getPane("labels")!;
      labelsPane.style.zIndex = "650";
      labelsPane.style.pointerEvents = "none";
      labelsPane.style.filter = "brightness(2.4) contrast(1.05)";
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png",
        {
          pane: "labels",
          maxZoom: 19,
          subdomains: "abcd",
        },
      ).addTo(map);

      // Soft glow underlay, then the bright M25 line on top.
      L.polyline(M25_PATH, {
        color: "#ffd400",
        weight: 12,
        opacity: 0.22,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(map);

      const m25 = L.polyline(M25_PATH, {
        color: "#ffd400",
        weight: 4,
        opacity: 1,
        lineJoin: "round",
        lineCap: "round",
      })
        .addTo(map)
        .bindTooltip("M25 — London orbital motorway", { sticky: true });

      // Service-base markers for context.
      const baseIcon = L.divIcon({
        html: `<div style="background:#ffd400;border:3px solid #050505;border-radius:50% 50% 50% 0;width:22px;height:22px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 22],
        className: "",
      });
      BASES.forEach((b) => {
        L.marker([b.lat, b.lng], { icon: baseIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif"><strong style="color:#050505">${b.name}</strong></div>`,
          );
      });

      map.fitBounds(m25.getBounds(), { padding: [40, 40] });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-3xl border border-bolt/30 shadow-2xl shadow-bolt/10">
      {/* Top ribbon */}
      <div className="flex items-center justify-between gap-3 bg-bolt px-6 py-3 text-ink sm:px-8">
        <p className="font-display text-base font-extrabold uppercase tracking-tight sm:text-xl">
          The M25, highlighted — our coverage ring
        </p>
        <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider sm:flex">
          <span className="h-1 w-8 rounded-full bg-ink" />
          M25
        </span>
      </div>

      {/* Real map */}
      <div
        ref={mapRef}
        className="h-[420px] w-full bg-coal sm:h-[560px]"
        aria-label="Map of London with the M25 motorway highlighted"
      />
    </div>
  );
}
