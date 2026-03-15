import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/* ─── TILE THEMES ─────────────────────────────────────── */
const TILES = {
  street: {
    label: "Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attr: "© OpenStreetMap",
  },
  dark: {
    label: "Dark",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attr: "© Stadia Maps © OpenStreetMap",
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attr: "© Esri",
  },
};

/* ─── PRICE TIER → COLOR ──────────────────────────────── */
const getPriceTier = (price) => {
  const p = Number(price);
  if (p < 5000)  return { color: "#10b981", label: "Budget",   ring: "#6ee7b7" };
  if (p < 12000) return { color: "#f59e0b", label: "Mid",      ring: "#fde68a" };
  if (p < 25000) return { color: "#ef4444", label: "Premium",  ring: "#fca5a5" };
  return           { color: "#8b5cf6", label: "Luxury",         ring: "#c4b5fd" };
};

/* ─── DYNAMIC SVG MARKER ──────────────────────────────── */
const makeIcon = (price, isSelected) => {
  const { color } = getPriceTier(price);
  const size = isSelected ? 48 : 36;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 48 56">
      <defs>
        <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#00000055"/>
        </filter>
        <radialGradient id="grad" cx="40%" cy="30%">
          <stop offset="0%" stop-color="#ffffff44"/>
          <stop offset="100%" stop-color="#00000022"/>
        </radialGradient>
      </defs>
      <path d="M24 2C13.5 2 5 10.5 5 21c0 14 19 33 19 33s19-19 19-33C43 10.5 34.5 2 24 2z"
        fill="${color}" filter="url(#shadow)"/>
      <path d="M24 2C13.5 2 5 10.5 5 21c0 14 19 33 19 33s19-19 19-33C43 10.5 34.5 2 24 2z"
        fill="url(#grad)"/>
      <circle cx="24" cy="21" r="9" fill="white" opacity="0.92"/>
      <text x="24" y="25" text-anchor="middle" font-size="9" font-weight="700"
        font-family="sans-serif" fill="${color}">₹</text>
      ${isSelected ? `<circle cx="24" cy="21" r="13" fill="none" stroke="white" stroke-width="2" opacity="0.6"/>` : ""}
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size * 1.17],
    iconAnchor: [size / 2, size * 1.17],
    popupAnchor: [0, -(size * 1.17)],
  });
};

/* ─── FIT BOUNDS ──────────────────────────────────────── */
function FitBounds({ houses }) {
  const map = useMap();
  const fitted = useRef(false);
  useEffect(() => {
    if (fitted.current || houses.length === 0) return;
    const bounds = L.latLngBounds(
      houses.map((h) => [+h.house_langtitude, +h.house_longtitude])
    );
    map.fitBounds(bounds, { padding: [60, 60] });
    fitted.current = true;
  }, [houses, map]);
  return null;
}

/* ─── FLY TO SELECTED ─────────────────────────────────── */
function FlyTo({ house }) {
  const map = useMap();
  useEffect(() => {
    if (!house) return;
    map.flyTo([+house.house_langtitude, +house.house_longtitude], 15, {
      duration: 1.2,
    });
  }, [house, map]);
  return null;
}

/* ─── CLUSTER COUNTER OVERLAY ─────────────────────────── */
function StatsBar({ houses, filtered }) {
  const avg =
    filtered.length
      ? Math.round(
          filtered.reduce((s, h) => s + Number(h.house_price), 0) /
            filtered.length
        )
      : 0;
  return (
    <div style={styles.statsBar}>
      <span style={styles.statChip}>
        🏠 <b>{filtered.length}</b>/{houses.length} shown
      </span>
      {avg > 0 && (
        <span style={styles.statChip}>
          ₹ avg <b>{avg.toLocaleString("en-IN")}</b>
        </span>
      )}
    </div>
  );
}

/* ─── MAIN ────────────────────────────────────────────── */
const UserMapView = ({ houses = [] }) => {
  const [tile, setTile]         = useState("street");
  const [selected, setSelected] = useState(null);
  const [search, setSearch]     = useState("");
  const [priceFilter, setPrice] = useState("all");
  const [showRadius, setRadius] = useState(false);

  const valid = houses.filter(
    (h) =>
      h.house_langtitude &&
      h.house_longtitude &&
      !isNaN(+h.house_langtitude) &&
      !isNaN(+h.house_longtitude)
  );

  const filtered = valid.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      h.place__place_name?.toLowerCase().includes(q) ||
      h.bhktype__bhktype_name?.toLowerCase().includes(q) ||
      String(h.house_price).includes(q);
    const tier = getPriceTier(h.house_price).label.toLowerCase();
    const matchPrice = priceFilter === "all" || tier === priceFilter;
    return matchSearch && matchPrice;
  });

  if (valid.length === 0)
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>📍</div>
        <p style={styles.emptyText}>No properties with location data found.</p>
      </div>
    );

  return (
    <div style={styles.wrapper}>
      {/* ── TOOLBAR ── */}
      <div style={styles.toolbar}>
        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Search place, BHK, price…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* Price filter */}
        <div style={styles.filterGroup}>
          {["all", "budget", "mid", "premium", "luxury"].map((p) => (
            <button
              key={p}
              style={{
                ...styles.filterBtn,
                ...(priceFilter === p ? styles.filterBtnActive : {}),
              }}
              onClick={() => setPrice(p)}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Tile switcher */}
        <div style={styles.filterGroup}>
          {Object.entries(TILES).map(([key, t]) => (
            <button
              key={key}
              style={{
                ...styles.filterBtn,
                ...(tile === key ? styles.filterBtnActive : {}),
              }}
              onClick={() => setTile(key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Radius toggle */}
        <button
          style={{
            ...styles.filterBtn,
            ...(showRadius ? styles.filterBtnActive : {}),
          }}
          onClick={() => setRadius((r) => !r)}
          title="Show 2km radius around selected"
        >
          📡 Radius
        </button>
      </div>

      {/* ── LEGEND ── */}
      <div style={styles.legend}>
        {[
          { label: "Budget <₹5k",     color: "#10b981" },
          { label: "Mid ₹5k–12k",     color: "#f59e0b" },
          { label: "Premium ₹12k–25k",color: "#ef4444" },
          { label: "Luxury ₹25k+",    color: "#8b5cf6" },
        ].map((l) => (
          <span key={l.label} style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: l.color }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* ── STATS ── */}
      <StatsBar houses={valid} filtered={filtered} />

      {/* ── MAP ── */}
      <div style={styles.mapWrap}>
        <MapContainer
          center={[10.8505, 76.2711]}
          zoom={8}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <TileLayer
            key={tile}
            url={TILES[tile].url}
            attribution={TILES[tile].attr}
          />

          <FitBounds houses={filtered} />
          <FlyTo house={selected} />

          {/* Radius circle around selected */}
          {showRadius && selected && (
            <Circle
              center={[+selected.house_langtitude, +selected.house_longtitude]}
              radius={2000}
              pathOptions={{
                color: getPriceTier(selected.house_price).color,
                fillOpacity: 0.08,
                dashArray: "6 4",
              }}
            />
          )}

          {filtered.map((house) => (
            <Marker
              key={house.id}
              position={[+house.house_langtitude, +house.house_longtitude]}
              icon={makeIcon(house.house_price, selected?.id === house.id)}
              eventHandlers={{
                click: () => setSelected(house),
              }}
            >
              <Popup maxWidth={240} className="custom-popup">
                <HouseCard house={house} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* ── SELECTED SIDE PANEL ── */}
        {selected && (
          <SidePanel
            house={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
};

/* ─── HOUSE CARD (inside popup) ───────────────────────── */
const HouseCard = ({ house }) => {
  const tier = getPriceTier(house.house_price);
  return (
    <div style={styles.card}>
      <div style={styles.cardImgWrap}>
        <img
          src={`${API_BASE}/${house.house_photo}`}
          alt={house.bhktype__bhktype_name}
          style={styles.cardImg}
          onError={(e) => (e.target.src = "/placeholder-house.png")}
        />
        <span style={{ ...styles.tierBadge, background: tier.color }}>
          {tier.label}
        </span>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.cardTitle}>{house.bhktype__bhktype_name}</div>
        <div style={styles.cardPrice}>
          ₹{Number(house.house_price).toLocaleString("en-IN")}
          <span style={styles.cardPriceSub}>/mo</span>
        </div>
        <div style={styles.cardPlace}>📍 {house.place__place_name}</div>
        <a href={`/User/UserGallery/${house.id}`} style={styles.cardCTA}>
          View Details →
        </a>
      </div>
    </div>
  );
};

/* ─── SIDE PANEL (slide-in) ───────────────────────────── */
const SidePanel = ({ house, onClose }) => {
  const tier = getPriceTier(house.house_price);
  return (
    <div style={styles.panel}>
      <button style={styles.panelClose} onClick={onClose}>✕</button>
      <img
        src={`${API_BASE}/${house.house_photo}`}
        alt=""
        style={styles.panelImg}
        onError={(e) => (e.target.src = "/placeholder-house.png")}
      />
      <div style={styles.panelBody}>
        <span style={{ ...styles.tierBadge, background: tier.color, marginBottom: 8, display:"inline-block" }}>
          {tier.label}
        </span>
        <div style={styles.panelTitle}>{house.bhktype__bhktype_name}</div>
        <div style={styles.panelPrice}>
          ₹{Number(house.house_price).toLocaleString("en-IN")}
          <span style={styles.cardPriceSub}>/month</span>
        </div>
        <div style={styles.panelMeta}>📍 {house.place__place_name}</div>
        {house.floortype__floortype_name && (
          <div style={styles.panelMeta}>🏢 {house.floortype__floortype_name}</div>
        )}
        {house.tenanttype__tenanttype_name && (
          <div style={styles.panelMeta}>👤 {house.tenanttype__tenanttype_name}</div>
        )}
        <div style={styles.panelCoords}>
          🌐 {(+house.house_langtitude).toFixed(4)}, {(+house.house_longtitude).toFixed(4)}
        </div>
        <a href={`/User/UserGallery/${house.id}`} style={{ ...styles.cardCTA, marginTop: 14, display: "block", textAlign:"center" }}>
          View Full Details →
        </a>
      </div>
    </div>
  );
};

/* ─── STYLES ──────────────────────────────────────────── */
const styles = {
  wrapper:        { display: "flex", flexDirection: "column", gap: 10, fontFamily: "'Segoe UI', sans-serif" },
  toolbar:        { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", padding: "10px 0" },
  searchWrap:     { position: "relative", display: "flex", alignItems: "center", flex: "1 1 200px", minWidth: 180 },
  searchIcon:     { position: "absolute", left: 10, fontSize: 14, pointerEvents: "none" },
  searchInput:    { width: "100%", padding: "8px 32px 8px 32px", borderRadius: 20, border: "1.5px solid #d1d5db", fontSize: 13, outline: "none", background: "#f9fafb" },
  clearBtn:       { position: "absolute", right: 8, background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 12 },
  filterGroup:    { display: "flex", gap: 4 },
  filterBtn:      { padding: "6px 12px", borderRadius: 16, border: "1.5px solid #e5e7eb", background: "white", cursor: "pointer", fontSize: 12, color: "#374151", transition: "all 0.15s" },
  filterBtnActive:{ background: "#1d4ed8", color: "white", borderColor: "#1d4ed8" },
  legend:         { display: "flex", flexWrap: "wrap", gap: 10, fontSize: 11, color: "#6b7280" },
  legendItem:     { display: "flex", alignItems: "center", gap: 5 },
  legendDot:      { width: 10, height: 10, borderRadius: "50%", display: "inline-block" },
  statsBar:       { display: "flex", gap: 10 },
  statChip:       { background: "#f3f4f6", borderRadius: 12, padding: "4px 12px", fontSize: 12, color: "#374151" },
  mapWrap:        { position: "relative", height: 600, borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px #0000001a" },
  card:           { width: 210, fontFamily: "'Segoe UI', sans-serif" },
  cardImgWrap:    { position: "relative" },
  cardImg:        { width: "100%", height: 120, objectFit: "cover", borderRadius: 6 },
  tierBadge:      { position: "absolute", top: 6, right: 6, color: "white", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 10 },
  cardBody:       { padding: "8px 2px 2px" },
  cardTitle:      { fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 2 },
  cardPrice:      { fontSize: 18, fontWeight: 800, color: "#1d4ed8" },
  cardPriceSub:   { fontSize: 11, color: "#9ca3af", fontWeight: 400, marginLeft: 2 },
  cardPlace:      { fontSize: 12, color: "#6b7280", margin: "4px 0 8px" },
  cardCTA:        { display: "inline-block", background: "#1d4ed8", color: "white", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: 600, textDecoration: "none" },
  panel:          { position: "absolute", top: 0, right: 0, width: 260, height: "100%", background: "white", boxShadow: "-4px 0 20px #0000001a", zIndex: 1000, overflowY: "auto" },
  panelClose:     { position: "absolute", top: 10, right: 10, background: "#f3f4f6", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, zIndex: 10 },
  panelImg:       { width: "100%", height: 160, objectFit: "cover" },
  panelBody:      { padding: 16 },
  panelTitle:     { fontWeight: 800, fontSize: 16, color: "#111827", margin: "6px 0 4px" },
  panelPrice:     { fontSize: 22, fontWeight: 800, color: "#1d4ed8", marginBottom: 10 },
  panelMeta:      { fontSize: 13, color: "#6b7280", marginBottom: 4 },
  panelCoords:    { fontSize: 11, color: "#9ca3af", marginTop: 8, fontFamily: "monospace" },
  empty:          { display: "flex", flexDirection: "column", alignItems: "center", padding: 60, color: "#9ca3af" },
  emptyIcon:      { fontSize: 40, marginBottom: 12 },
  emptyText:      { fontSize: 15 },
};

export default UserMapView;