import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { FiHeart, FiMapPin, FiGrid, FiMap, FiX } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import styles from "./ViewHouse.module.css";
import UserMapView from "../usermapview/UserMapView";

const API = "http://127.0.0.1:8000";

/* ── debounce hook ── */
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ── skeleton card ── */
const SkeletonCard = () => (
  <div className={styles.card} style={{ opacity: 0.5 }}>
    <div style={{ height: 200, background: "#e5e7eb", borderRadius: 12, marginBottom: 12, animation: "pulse 1.5s infinite" }} />
    <div style={{ height: 16, background: "#e5e7eb", borderRadius: 6, marginBottom: 8, width: "60%" }} />
    <div style={{ height: 14, background: "#e5e7eb", borderRadius: 6, marginBottom: 8, width: "40%" }} />
    <div style={{ height: 14, background: "#e5e7eb", borderRadius: 6, width: "80%" }} />
  </div>
);

const ViewHouse = () => {
  const [districts, setDistricts]   = useState([]);
  const [places, setPlaces]         = useState([]);
  const [bhkTypes, setBhkTypes]     = useState([]);
  const [floorTypes, setFloorTypes] = useState([]);
  const [houses, setHouses]         = useState([]);
  const [saved, setSaved]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [mapView, setMapView]       = useState(false);
  const [filterKey, setFilterKey]   = useState(0); // ✅ forces selects to reset

  // ✅ Separate raw price state so debounce doesn't block other filters
  const [rawFilters, setRawFilters] = useState({});
  const [priceMin, setPriceMin]     = useState("");
  const [priceMax, setPriceMax]     = useState("");

  const debouncedMin = useDebounce(priceMin);
  const debouncedMax = useDebounce(priceMax);

  const uid      = sessionStorage.getItem("uid");
  const navigate = useNavigate();

  // ✅ Merge debounced prices into final filters
  const filters = {
    ...rawFilters,
    ...(debouncedMin ? { min_price: debouncedMin } : {}),
    ...(debouncedMax ? { max_price: debouncedMax } : {}),
  };

  /* ── LOAD HOUSES ── */
  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(filters).toString();
    axios
      .get(`${API}/House/${query ? `?${query}` : ""}`)
      .then((res) => setHouses(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]); // ✅ stable dependency

  /* ── LOAD DROPDOWNS ── */
  useEffect(() => {
    axios.get(`${API}/District/`).then((r) => setDistricts(r.data.data));
    axios.get(`${API}/floortype/`).then((r) => setFloorTypes(r.data.data));
    axios.get(`${API}/bhktype/`).then((r)  => setBhkTypes(r.data.data));
  }, []);

  /* ── LOAD FAVOURITES ── */
  useEffect(() => {
    if (!uid) return;
    axios
      .get(`${API}/Fav/?user_id=${uid}`)
      .then((r) => setSaved(r.data.data))
      .catch(console.error);
  }, [uid]);

  const isLiked = useCallback(
    (houseId) => saved.some((f) => f.house_id_id === houseId),
    [saved]
  );

  /* ── TOGGLE SAVE ── */
  const toggleSave = useCallback(
    (houseId) => {
      if (!uid) { alert("Please login first"); return; }
      const fav = saved.find((f) => f.house_id_id === houseId);
      if (fav) {
        setSaved((p) => p.filter((f) => f.house_id_id !== houseId));
        axios.delete(`${API}/FavDelete/${fav.id}/`).catch(() =>
          axios.get(`${API}/Fav/?user_id=${uid}`).then((r) => setSaved(r.data.data))
        );
      } else {
        const fd = new FormData();
        fd.append("user_id", uid);
        fd.append("house_id", houseId);
        setSaved((p) => [...p, { house_id_id: houseId, user_id_id: +uid }]);
        axios.post(`${API}/Fav/`, fd).catch(() =>
          setSaved((p) => p.filter((f) => f.house_id_id !== houseId))
        );
      }
    },
    [saved, uid]
  );

  /* ── FILTER HANDLING ── */
  const handleFilter = useCallback((key, value) => {
    setRawFilters((prev) => {
      const next = { ...prev };
      value === "" ? delete next[key] : (next[key] = value);
      return next;
    });
  }, []);

  const handleDistrictChange = useCallback((districtId) => {
    setRawFilters((prev) => {
      const next = { ...prev };
      if (districtId === "") {
        delete next.district_id;
        delete next.place_id;
        setPlaces([]);
      } else {
        next.district_id = districtId;
        delete next.place_id;
        axios
          .get(`${API}/Place/?district_id=${districtId}`)
          .then((r) => setPlaces(r.data.data));
      }
      return next;
    });
  }, []);

  const clearFilters = () => {
    setRawFilters({});
    setPriceMin("");
    setPriceMax("");
    setPlaces([]);
    setFilterKey((k) => k + 1); // ✅ resets all select elements
  };

  const activeFilterCount = Object.keys(filters).length;

  /* ── UI ── */
  return (
    <div className={styles.container}>
      {/* HEADER ROW */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 className={styles.title}>Available Properties</h2>
          {/* ✅ Result count */}
          {!loading && (
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              {houses.length} {houses.length === 1 ? "property" : "properties"} found
            </p>
          )}
        </div>

        {/* ✅ Styled map/grid toggle */}
        <button
          className={styles.viewToggleBtn}
          onClick={() => setMapView((v) => !v)}
        >
          {mapView ? <><FiGrid /> Grid View</> : <><FiMap /> Map View</>}
        </button>
      </div>

      {/* FILTER SECTION */}
      <div className={styles.filterSection} key={filterKey}>
        <select onChange={(e) => handleDistrictChange(e.target.value)}>
          <option value="">All Districts</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.district_name}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilter("place_id", e.target.value)} disabled={places.length === 0}>
          <option value="">All Places</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>{p.place_name}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilter("bhktype_id", e.target.value)}>
          <option value="">All BHK</option>
          {bhkTypes.map((b) => (
            <option key={b.id} value={b.id}>{b.bhktype_name}</option>
          ))}
        </select>

        <select onChange={(e) => handleFilter("floortype_id", e.target.value)}>
          <option value="">All Floors</option>
          {floorTypes.map((f) => (
            <option key={f.id} value={f.id}>{f.floortype_name}</option>
          ))}
        </select>

        {/* ✅ Controlled price inputs with debounce */}
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
        />

        <select onChange={(e) => handleFilter("sort", e.target.value)}>
          <option value="">Sort By Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>

        {/* ✅ Shows badge with active filter count */}
        <button className={styles.clearBtn} onClick={clearFilters}>
          <FiX />
          Clear {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* MAP OR GRID */}
      {mapView ? (
        <UserMapView houses={houses} />
      ) : (
        <div className={styles.grid}>
          {loading ? (
            // ✅ Skeleton loading
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : houses.length === 0 ? (
            <div className={styles.emptyState}>
              <p style={{ fontSize: 40 }}>🏚️</p>
              <p>No properties match your filters.</p>
              <button className={styles.clearBtn} onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          ) : (
            houses.map((house) => (
              <div key={house.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={`${API}/${house.house_photo}?v=${house.id}`}
                    alt="House"
                  />
                  <button
                    type="button"
                    className={styles.heart}
                    onClick={() => toggleSave(house.id)}
                    aria-label={isLiked(house.id) ? "Remove from favourites" : "Add to favourites"}
                  >
                    {isLiked(house.id)
                      ? <AiFillHeart className={styles.redHeart} />
                      : <FiHeart />}
                  </button>
                </div>

                <div className={styles.content}>
                  <h3>{house.bhktype__bhktype_name}</h3>
                  <p><FiMapPin /> {house.place__place_name}</p>
                  <p>{house.house_details}</p>
                  <p><strong>Floor:</strong> {house.floortype__floortype_name}</p>

                  {/* ✅ Formatted Indian price */}
                  <div className={styles.price}>
                    ₹{Number(house.house_price).toLocaleString("en-IN")}
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}> /month</span>
                  </div>

                  <button
                    className={styles.galleryBtn}
                    onClick={() => navigate(`/User/UserGallery/${house.id}`)}
                  >
                    View More
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewHouse;