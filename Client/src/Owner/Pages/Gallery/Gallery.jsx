import React, { useEffect, useState, useRef } from "react";
import styles from "./Gallery.module.css";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [houses, setHouses] = useState([]);
  const [selectedHouse, setSelectedHouse] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const fileInputRef = useRef(null);

  /* ---------------- FETCH GALLERY (BY HOUSE ID) ---------------- */

  const fetchGallery = (houseId) => {
    if (!houseId) {
      setGallery([]);
      return;
    }

    const ownerId = sessionStorage.getItem("oid");
    if (!ownerId) return;

    setLoading(true);

    axios
      .get(
        `http://127.0.0.1:8000/Gallery/?house_id=${houseId}&owner_id=${ownerId}`
      )
      .then((res) => {
        setGallery(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load gallery images",
          severity: "error"
        });
        setLoading(false);
      });
  };

  /* ---------------- LOAD HOUSES ---------------- */

  useEffect(() => {
    const ownerId = sessionStorage.getItem("oid");
    if (!ownerId) return;

    axios
      .get(`http://127.0.0.1:8000/House/?owner_id=${ownerId}`)
      .then((res) => {
        setHouses(res.data.data || []);
      })
      .catch(() => {
        setHouses([]);
      });
  }, []);


  /* ---------------- FILE HANDLER ---------------- */

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.match("image.*")) {
      setSnackbar({
        open: true,
        message: "Please select image file",
        severity: "warning"
      });
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setSnackbar({
        open: true,
        message: "File must be under 5MB",
        severity: "warning"
      });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      setSnackbar({
        open: true,
        message: "Please select image first",
        severity: "warning"
      });
      return;
    }

    if (!selectedHouse) {
      setSnackbar({
        open: true,
        message: "Please select a house",
        severity: "warning"
      });
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("gallery_file", file);
    data.append("house_id", Number(selectedHouse));
    data.append("owner_id", sessionStorage.getItem("oid")); // ✅ REQUIRED

    axios
      .post("http://127.0.0.1:8000/Gallery/", data)
      .then(() => {
        setSnackbar({
          open: true,
          message: "Image uploaded successfully!",
          severity: "success"
        });

        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        setTimeout(() => {
          fetchGallery(selectedHouse);
        }, 300);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Upload failed",
          severity: "error"
        });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const closeModal = () => setSelectedImage(null);

  const handleSnackbarClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar({ ...snackbar, open: false });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>

        {/* HEADER */}
        <div className={styles.headerSection}>
          <h1 className={styles.headerTitle}>Gallery Upload</h1>
          <p className={styles.headerSubtitle}>Upload and manage house images</p>
        </div>

        {/* HOUSE SELECT */}
        <div className={styles.uploadSection}>
          <select
            className={styles.selectInput}
            value={selectedHouse}
            onChange={(e) => {
              setSelectedHouse(e.target.value);
              fetchGallery(e.target.value);
            }}
          >
            <option value="">Select House</option>
            {houses.map((house) => (
              <option key={house.id} value={house.id}>
                {house.bhktype__bhktype_name} - {house.place__place_name}
              </option>
            ))}
          </select>
        </div>

        {/* UPLOAD */}
        <div className={styles.uploadCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.uploadArea} onClick={triggerFileInput}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className={styles.fileInput}
              />

              {preview ? (
                <img src={preview} alt="Preview" className={styles.previewImage} />
              ) : (
                <p>Click to select image</p>
              )}
            </div>

            <button
              type="submit"
              className={styles.uploadButton}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </form>
        </div>

        {/* GALLERY */}
        <div className={styles.gallerySection}>
          {loading ? (
            <p>Loading...</p>
          ) : gallery.length > 0 ? (
            <div className={styles.galleryGrid}>
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className={styles.galleryItem}
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={`http://127.0.0.1:8000/${item.gallery_file}`}
                    alt="Gallery"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              ))}


            </div>
          ) : (
            <p>No images found</p>
          )}
        </div>

        {/* MODAL */}
        {selectedImage && (
          <div className={styles.imageModal} onClick={closeModal}>
            <img
              src={`http://127.0.0.1:8000/${selectedImage.gallery_file}`}
              alt="Full"
              className={styles.modalImage}
            />
          </div>
        )}
      </div>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Gallery;
