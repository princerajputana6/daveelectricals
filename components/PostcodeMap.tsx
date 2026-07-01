"use client";

import { useEffect, useRef } from "react";

/**
 * Greater-London postcode-district map: every London postal district drawn as
 * a filled polygon, coloured by postcode area (like the classic London
 * postcode map). Boundary data: /public/postcodes-london.geojson (open data,
 * OpenDoorLogistics / missinglink UK postcode polygons), coloured to match our
 * dark theme. The M25 orbital is overlaid to show our coverage ring.
 */

// Postcode-area → fill colour (roughly matching the well-known London map).
const AREA_COLORS: Record<string, string> = {
  EN: "#34c759", // Enfield — green
  N: "#b9b9bd", // North — grey
  NW: "#8e8e93", // North West — dark grey
  E: "#7c7c82", // East — dark grey
  EC: "#3f6fb0", // City — blue
  WC: "#4a90d9", // West Central — blue
  W: "#cfcfd4", // West — light grey
  SW: "#9a9aa0", // South West — grey
  SE: "#c3c3c8", // South East — light grey
  HA: "#efe14b", // Harrow — yellow
  UB: "#1f4fd8", // Uxbridge — blue
  TW: "#e53935", // Twickenham/Hounslow — red
  KT: "#8a8a3a", // Kingston — olive
  SM: "#3a7fe0", // Sutton — blue
  CR: "#2e8b2e", // Croydon — green
  BR: "#f28c4b", // Bromley — orange
  DA: "#33d6e0", // Dartford — cyan
  RM: "#e838d8", // Romford — magenta
  IG: "#efe14b", // Ilford — yellow
};

// Areas we highlight in the legend (the boroughs we actively serve).
const LEGEND: { area: string; label: string }[] = [
  { area: "TW", label: "Twickenham · Hounslow" },
  { area: "UB", label: "Uxbridge · Hayes" },
  { area: "HA", label: "Harrow" },
  { area: "W", label: "West London" },
  { area: "SW", label: "South West" },
  { area: "KT", label: "Kingston" },
  { area: "EN", label: "Enfield" },
  { area: "N", label: "North" },
  { area: "E", label: "East" },
  { area: "SE", label: "South East" },
  { area: "CR", label: "Croydon" },
  { area: "BR", label: "Bromley" },
];

// M25 orbital (approx) — overlaid as our coverage ring.
const M25_PATH: [number, number][] = [
  [51.692, -0.187], [51.69, -0.146], [51.665, -0.063], [51.678, 0.011],
  [51.672, 0.075], [51.616, 0.246], [51.566, 0.26], [51.484, 0.282],
  [51.464, 0.26], [51.43, 0.225], [51.408, 0.221], [51.388, 0.168],
  [51.359, 0.103], [51.3, 0.085], [51.236, -0.035], [51.273, -0.165],
  [51.262, -0.205], [51.3, -0.33], [51.305, -0.46], [51.378, -0.508],
  [51.4, -0.52], [51.443, -0.52], [51.482, -0.498], [51.51, -0.483],
  [51.57, -0.49], [51.625, -0.487], [51.642, -0.46], [51.665, -0.402],
  [51.69, -0.38], [51.706, -0.33], [51.713, -0.27], [51.692, -0.187],
];

type Feat = {
  properties: { district: string; area: string };
};

export default function PostcodeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const map = L.map(mapRef.current!, {
        center: [51.5, -0.11],
        zoom: 10,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: false,
      });

      let geo: { features: Feat[] } | null = null;
      try {
        const res = await fetch("/postcodes-london.geojson");
        geo = await res.json();
      } catch {
        geo = null;
      }
      if (!geo) return;

      const layer = L.geoJSON(geo as never, {
        style: (feature) => {
          const area = (feature?.properties as Feat["properties"])?.area;
          return {
            fillColor: AREA_COLORS[area] || "#8e8e93",
            fillOpacity: 0.82,
            color: "#0a0a0a",
            weight: 0.6,
          };
        },
        onEachFeature: (feature, lyr) => {
          const p = (feature.properties || {}) as Feat["properties"];
          lyr.bindTooltip(p.district, {
            sticky: true,
            direction: "top",
            className: "pc-tip",
          });
          const path = lyr as unknown as {
            setStyle: (s: Record<string, unknown>) => void;
          };
          lyr.on({
            mouseover: () => path.setStyle({ weight: 1.6, color: "#ffffff" }),
            mouseout: () => path.setStyle({ weight: 0.6, color: "#0a0a0a" }),
          });
        },
      }).addTo(map);

      // M25 coverage ring on top.
      L.polyline(M25_PATH, {
        color: "#e2e61f",
        weight: 3.5,
        opacity: 0.95,
        dashArray: "2 8",
        lineJoin: "round",
        lineCap: "round",
        interactive: false,
      }).addTo(map);

      const bounds = layer.getBounds();
      map.fitBounds(bounds, { padding: [20, 20] });
      map.setMaxBounds(bounds.pad(0.15));

      mapInstanceRef.current = map;
    };

    init();

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
          London postcode coverage
        </p>
        <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-wider sm:flex">
          <span className="h-1 w-8 rounded-full border-b-2 border-dashed border-ink" />
          M25
        </span>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="h-[460px] w-full bg-[#0a0a0b] sm:h-[620px]"
        aria-label="Map of Greater London postcode districts we cover"
      />

      {/* Legend */}
      <div className="border-t border-white/10 bg-coal px-6 py-4 sm:px-8">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ash">
          Postcode areas we cover
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {LEGEND.map((l) => (
            <span
              key={l.area}
              className="flex items-center gap-2 text-xs text-zinc-200"
            >
              <span
                className="h-3 w-3 rounded-sm ring-1 ring-black/40"
                style={{ background: AREA_COLORS[l.area] }}
              />
              <span className="font-semibold text-white">{l.area}</span>
              <span className="text-ash">{l.label}</span>
            </span>
          ))}
          <span className="text-xs text-ash">…and every district in between.</span>
        </div>
      </div>
    </div>
  );
}
