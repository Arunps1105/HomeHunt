import React, { useEffect, useState } from "react";
import Styles from "./FavouritesPage.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FavouritesPage = () => {
  const [favourites, setFavourites] = useState([]);
  const uid = sessionStorage.getItem("uid");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ===== LOAD FAVOURITES ===== */
  const loadFavourites = async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    try {
      const favRes = await axios.get(`http://127.0.0.1:8000/Fav/?user_id=${uid}`);
      const userFavs = favRes.data?.data || [];

      if (userFavs.length === 0) {
        setFavourites([]);
        setLoading(false);
        return;
      }

      const houseRes = await axios.get("http://127.0.0.1:8000/House/");
      const houses = houseRes.data?.data || [];

      const merged = userFavs
        .map(fav => {
          const house = houses.find(h => h.id === fav.house_id_id);
          if (!house) return null;
          return {
            ...house,               // spread first
            house_id: fav.house_id_id,
            fav_id: fav.id          // ✅ fav_id last — never overwritten
          };
        })
        .filter(Boolean);

      setFavourites(merged);
    } catch (err) {
      console.error("Failed to load favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, [uid]);

  const removeFavourite = (favId) => {
    console.log("Deleting fav_id:", favId); // ✅ debug

    if (!favId) {
      console.error("fav_id is undefined! Cannot delete.");
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/FavDelete/${favId}/`)
      .then(() => {
        console.log("Deleted successfully!");
        setFavourites(prev => prev.filter(f => f.fav_id !== favId));
      })
      .catch(err => console.log("Delete error:", err));
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.container}>

        {/* HEADER */}
        <div className={Styles.header}>
          <h2>My Favourites</h2>
          <p>Houses you loved and saved for later</p>

          <div className={Styles.statsBar}>
            <div className={Styles.statItem}>
              <div className={Styles.statIcon}>♥</div>
              <div className={Styles.statText}>
                <span className={Styles.statNumber}>{favourites.length}</span>
                <span className={Styles.statLabel}>Saved Houses</span>
              </div>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {loading ? (
          <div className={Styles.emptyState}>
            <p>Loading favourites...</p>
          </div>
        ) : favourites.length === 0 ? (
          <div className={Styles.emptyState}>
            <div className={Styles.emptyHeart}>♥</div>
            <h3>No favourites yet</h3>
            <p>Start exploring houses and save the ones you love</p>
          </div>
        ) : (
          <div className={Styles.grid}>
            {favourites.map(house => (
              <div key={house.fav_id} className={Styles.card}>

                <div className={Styles.imageWrapper}>
                  <img
                    src={`http://127.0.0.1:8000/${house.house_photo}?v=${house.id}`}
                    alt="House"
                  />
                  <button
                    className={Styles.removeBtn}
                    onClick={() => removeFavourite(house.fav_id)}
                  >
                    ♥
                  </button>
                </div>

                <div className={Styles.details}>
                  <h3>{house.bhktype__bhktype_name}</h3>
                  <p className={Styles.location}>
                    {house.place__place_name}
                  </p>
                  <p className={Styles.price}>
                    ₹{house.house_price}/month
                  </p>

                  <button
                    className={Styles.viewBtn}
                    onClick={() =>
                      navigate(`/User/UserGallery/${house.house_id}`)
                    }
                  >
                    View Details
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FavouritesPage;
