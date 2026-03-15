import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FiMapPin, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import styles from "./UserGallery.module.css";

const API = "http://127.0.0.1:8000";

const UserGallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [house, setHouse]       = useState(null);
  const [gallery, setGallery]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);

  // ✅ Lightbox state
  const [lightbox, setLightbox] = useState(null); // index or null

  /* ── LOAD ── */
  useEffect(() => {
    const data = new FormData();
    data.append("house_id", id);

    axios
      .post(`${API}/UserGallery/`, data)
      .then((res) => {
        setHouse(res.data.house);
        setGallery(res.data.gallery);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── ENQUIRY ── */
  const handleEnquiry = () => {
    sessionStorage.removeItem("house_id");
    sessionStorage.setItem("house_id", id);
    navigate("/User/requested");
  };

  // ✅ Lightbox navigation
  const lightboxPrev = () =>
    setLightbox((i) => (i > 0 ? i - 1 : gallery.length - 1));
  const lightboxNext = () =>
    setLightbox((i) => (i < gallery.length - 1 ? i + 1 : 0));

  // ✅ Close lightbox on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowLeft")  lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [gallery]);

  /* ── LOADING SKELETON ── */
  if (loading) return (
    <div className={styles.container}>
      <div className={styles.skeletonCard}>
        <div className={styles.skeletonImg} />
        <div className={styles.skeletonInfo}>
          <div className={styles.skeletonLine} style={{ width: "50%" }} />
          <div className={styles.skeletonLine} style={{ width: "30%" }} />
          <div className={styles.skeletonLine} style={{ width: "80%" }} />
          <div className={styles.skeletonLine} style={{ width: "40%" }} />
        </div>
      </div>
    </div>
  );

  /* ── ERROR STATE ── */
  if (error) return (
    <div className={styles.container}>
      <div className={styles.errorState}>
        <p style={{ fontSize: 40 }}>⚠️</p>
        <p>Failed to load property details.</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ── MAIN DETAILS CARD ── */}
      <div className={styles.detailsCard}>
        <img
          src={`${API}/${house.house_photo}?v=${house.id}`}
          alt="House"
          className={styles.mainImage}
          onError={(e) => (e.target.src = "/placeholder-house.png")}
        />

        <div className={styles.info}>
          <h2>{house.bhktype__bhktype_name}</h2>

          <p className={styles.location}>
            <FiMapPin /> {house.place__place_name}
          </p>

          <p className={styles.description}>{house.house_details}</p>

          <div className={styles.extra}>
            <span><strong>Floor:</strong> {house.floortype__floortype_name}</span>
            <span><strong>Tenant:</strong> {house.tenanttype__tenanttype_name}</span>
          </div>

          {/* ✅ Formatted price */}
          <div className={styles.price}>
            ₹{Number(house.house_price).toLocaleString("en-IN")}
            <span className={styles.priceSub}> / month</span>
          </div>
        </div>

        <div className={styles.enquiryBox}>
          <button className={styles.enquiryBtn} onClick={handleEnquiry}>
            Request
          </button>
        </div>
      </div>

      {/* ── GALLERY SECTION ── */}
      <div className={styles.galleryHeader}>
        <h3 className={styles.galleryTitle}>More Images</h3>
        {/* ✅ Image count badge */}
        {gallery.length > 0 && (
          <span className={styles.galleryCount}>{gallery.length} photos</span>
        )}
      </div>

      <div className={styles.galleryGrid}>
        {gallery.length === 0 ? (
          <p className={styles.noImages}>No additional images available.</p>
        ) : (
          gallery.map((img, index) => (
            <div
              key={img.id}
              className={styles.imageCard}
              onClick={() => setLightbox(index)} // ✅ open lightbox
            >
              <img
                src={`${API}/${img.gallery_file}`}
                alt={`Gallery ${index + 1}`}
                onError={(e) => (e.target.src = "/placeholder-house.png")}
              />
              {/* ✅ hover zoom hint */}
              <div className={styles.imageOverlay}>🔍</div>
            </div>
          ))
        )}
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div className={styles.lightboxBackdrop} onClick={() => setLightbox(null)}>
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()} // don't close when clicking image
          >
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>
              <FiX />
            </button>

            <button className={styles.lightboxPrev} onClick={lightboxPrev}>
              <FiChevronLeft />
            </button>

            <img
              src={`${API}/${gallery[lightbox].gallery_file}`}
              alt="Full view"
              className={styles.lightboxImg}
            />

            <button className={styles.lightboxNext} onClick={lightboxNext}>
              <FiChevronRight />
            </button>

            {/* ✅ Counter: 2 / 5 */}
            <div className={styles.lightboxCounter}>
              {lightbox + 1} / {gallery.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserGallery;