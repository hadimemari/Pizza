"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Minus, Plus } from "lucide-react";

// Tehran center
const DEFAULT_CENTER: [number, number] = [35.6892, 51.389];
const DEFAULT_ZOOM = 13;

// Delivery zone center & radius (meters)
const DELIVERY_CENTER: [number, number] = [35.6892, 51.389];
const DELIVERY_RADIUS = 5000;

interface MapPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onLocationSelect }: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    // Inject leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
    // Dynamic import leaflet (avoid SSR)
    import("leaflet").then((leaflet) => {
      setL(leaflet.default || leaflet);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded || !L || !mapContainer.current || mapRef.current) return;

    const center: [number, number] = latitude && longitude
      ? [latitude, longitude]
      : DEFAULT_CENTER;

    const map = L.map(mapContainer.current, {
      center,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Delivery zone circle
    L.circle(DELIVERY_CENTER, {
      radius: DELIVERY_RADIUS,
      color: "#e67e22",
      fillColor: "#e67e22",
      fillOpacity: 0.08,
      weight: 2,
      dashArray: "8 4",
    }).addTo(map);

    // Custom marker icon
    const icon = L.divIcon({
      html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e67e22;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(230,126,34,0.4)">
        <div style="transform:rotate(45deg);color:white;font-size:18px;font-weight:bold">&#8226;</div>
      </div>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    // Initial marker
    if (latitude && longitude) {
      markerRef.current = L.marker([latitude, longitude], { icon }).addTo(map);
    }

    // Click to place marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
      }
      onLocationSelect(Math.round(lat * 1e6) / 1e6, Math.round(lng * 1e6) / 1e6);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, L]);

  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapRef.current || !L) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        mapRef.current!.setView([lat, lng], 16);
        const icon = L.divIcon({
          html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;background:#e67e22;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 12px rgba(230,126,34,0.4)">
            <div style="transform:rotate(45deg);color:white;font-size:18px;font-weight:bold">&#8226;</div>
          </div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current!);
        }
        onLocationSelect(Math.round(lat * 1e6) / 1e6, Math.round(lng * 1e6) / 1e6);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const handleZoom = (dir: number) => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(mapRef.current.getZoom() + dir);
  };

  return (
    <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-black/10 bg-zinc-100">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 z-20">
          <MapPin className="w-6 h-6 text-zinc-300 animate-pulse" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full z-10" />

      {/* Controls */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => handleZoom(1)}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-1)}
          className="w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-zinc-50 active:scale-90 transition-all"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleLocateMe}
        className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-md text-[11px] font-bold hover:bg-primary/10 hover:text-primary active:scale-95 transition-all"
      >
        <Navigation className="w-3.5 h-3.5" />
        مکان من
      </button>

      <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-zinc-500 shadow-sm">
        روی نقشه بزنید
      </div>
    </div>
  );
}
