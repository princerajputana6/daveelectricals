"use client";

import { useEffect, useRef } from "react";

const locations = [
  {
    name: "Hounslow",
    lat: 51.4677,
    lng: -0.361,
    description: "Our main base of operations — full electrical services for domestic & commercial clients.",
  },
  {
    name: "Twickenham",
    lat: 51.4489,
    lng: -0.3314,
    description: "Residential refurbishments, certification and emergency call-outs across Twickenham.",
  },
  {
    name: "Feltham",
    lat: 51.4473,
    lng: -0.4082,
    description: "Commercial and industrial electrical work throughout the Feltham area.",
  },
  {
    name: "Cranford",
    lat: 51.4856,
    lng: -0.4313,
    description: "PAT testing, EV charging installations and maintenance in Cranford.",
  },
];

export default function OurReachMap() {
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

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const centerLat = locations.reduce((s, l) => s + l.lat, 0) / locations.length;
      const centerLng = locations.reduce((s, l) => s + l.lng, 0) / locations.length;

      const map = L.map(mapRef.current!, {
        center: [centerLat, centerLng],
        zoom: 12,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const customIcon = L.divIcon({
        html: `<div style="background:#e2e61f;border:3px solid #050505;border-radius:50% 50% 50% 0;width:28px;height:28px;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        className: "",
      });

      locations.forEach((loc) => {
        L.marker([loc.lat, loc.lng], { icon: customIcon })
          .addTo(map)
          .bindPopup(
            `<div style="font-family:sans-serif;min-width:160px">
              <strong style="font-size:14px;color:#050505">${loc.name}</strong>
              <p style="font-size:12px;color:#555;margin:4px 0 0">${loc.description}</p>
            </div>`,
            { maxWidth: 220 }
          );
      });

      const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });

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
    <section className="bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl" style={{ minHeight: 480 }}>
            <div ref={mapRef} style={{ height: "100%", minHeight: 480, width: "100%" }} />
          </div>

          {/* Location cards */}
          <div className="flex flex-col gap-4">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-bolt">
              Service Areas
            </p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Where we work
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              We cover Hounslow, Twickenham, Feltham &amp; Cranford, plus the wider West London area. Click a pin on the map or browse our areas below.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              {locations.map((loc) => (
                <div
                  key={loc.name}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-graphite p-4 transition-colors hover:border-bolt/40"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bolt font-display text-xs font-bold text-ink">
                    {loc.name[0]}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold text-white">{loc.name}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{loc.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
