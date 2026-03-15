import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Recommend.module.css";

const Recommend = () => {
  const navigate = useNavigate();

  const [houses, setHouses] = useState([]);
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/RecommendHouses/?user_id=${uid}`)
      .then((res) => {
        setHouses(res.data.data);
      })
      .catch((err) => {
        console.log("Error fetching recommended houses", err);
      });
  }, [uid]);

  return (
    <div className={styles.page}>

      <h2 className={styles.title}>Recommended Houses</h2>

      {houses.length === 0 ? (
        <div className={styles.empty}>
          No houses match your preferences yet.
        </div>
      ) : (

        <div className={styles.grid}>

          {houses.map((house) => (
            <div className={styles.card} key={house.id}>

              <img
                src={
                  house.house_photo
                    ? `http://127.0.0.1:8000/${house.house_photo}`
                    : "/nohouse.png"
                }
                alt="house"
                className={styles.image}
              />
              <div className={styles.body}>

                <div className={styles.details}>
                  {house.house_details}
                </div>

                <div className={styles.meta}>
                  BHK : {house.bhktype__bhktype_name}
                </div>

                <div className={styles.meta}>
                  Floor : {house.floortype__floortype_name}
                </div>

                <div className={styles.meta}>
                  Place : {house.place__place_name}
                </div>

                <div className={styles.price}>
                  ₹{house.house_price}/month
                </div>

              </div>
              <button
                className={styles.viewBtn}
                onClick={() => navigate(`/User/UserGallery/${house.id}`)}
              >
                View Details
              </button>
            </div>
          ))}

        </div>

      )}

    </div>
  );
};

export default Recommend;