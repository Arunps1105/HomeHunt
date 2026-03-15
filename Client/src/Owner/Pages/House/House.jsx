import React, { useState, useEffect } from "react";
import axios from "axios";
import Styles from "./House.module.css";
import {
  FiHome,
  FiUpload,
  FiLock,
  FiTrendingUp,
  FiStar
} from "react-icons/fi";
import { Alert, Snackbar, Slide } from "@mui/material";

const House = () => {

  /* ---------------- STATE ---------------- */

  const [formData, setFormData] = useState({
    house_details: "",
    house_price: "",
    bhktype_id: "",
    floortype_id: "",
    place_id: "",
    tenanttype_id: "",
    owner_id: sessionStorage.getItem("oid"),
    house_langtitude: "",
    house_longtitude: ""
  });

  const [housePhoto, setHousePhoto] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);

  const [bhkTypes, setBhkTypes] = useState([]);
  const [floorTypes, setFloorTypes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [tenantTypes, setTenantTypes] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const SlideDown = (props) => <Slide {...props} direction="down" />;

  /* ---------------- FETCH DATA ---------------- */

  useEffect(() => {
    fetchProperties();
    fetchMasterData();
  }, []);

  const fetchProperties = async () => {
    try {
      const ownerId = sessionStorage.getItem("oid");

      const res = await axios.get(
        `http://127.0.0.1:8000/House/?owner_id=${ownerId}`
      );

      setProperties(res.data.data || []);
    } catch (err) {
      console.error("Fetch properties error", err);
      setProperties([]);
    }
  };


  const fetchMasterData = async () => {
    try {
      const [bhkRes, floorRes, placeRes, tenantRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/bhktype/"),
        axios.get("http://127.0.0.1:8000/floortype/"),
        axios.get("http://127.0.0.1:8000/Place/"),
        axios.get("http://127.0.0.1:8000/tenenttype/")
      ]);

      setBhkTypes(bhkRes.data.data || []);
      setFloorTypes(floorRes.data.data || []);
      setPlaces(placeRes.data.data || []);
      setTenantTypes(tenantRes.data.data || []);

    } catch (err) {
      console.error("Master data error:", err);
    }
  };

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setHousePhoto(file);
    setUploadedFileName(file.name);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.house_details ||
      !formData.house_price ||
      !formData.bhktype_id ||
      !formData.floortype_id ||
      !formData.place_id ||
      !formData.tenanttype_id ||
      !formData.owner_id
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    if (!housePhoto) {
      setSnackbar({
        open: true,
        message: "Please upload image",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    data.append("house_photo", housePhoto);

    try {
      await axios.post("http://127.0.0.1:8000/House/", data);

      /* show success message */
      setSnackbar({
        open: true,
        message: "Property added successfully!",
        severity: "success",
      });

      /* reset form AFTER snackbar appears */
      setTimeout(() => {
        setFormData({
          house_details: "",
          house_price: "",
          bhktype_id: "",
          floortype_id: "",
          place_id: "",
          tenanttype_id: "",
          owner_id: sessionStorage.getItem("oid"),
          house_langtitude: "",
          house_longtitude: ""
        });

        setHousePhoto(null);
        setUploadedFileName("");

        fetchProperties();
      }, 300);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Submission failed",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;

    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };
  /* ---------------- UI ---------------- */

  return (
    <div className={Styles.houseContainer}>
      <div className={Styles.mainContainer}>

        <div className={Styles.header}>
          <div className={Styles.brand}>
            <FiHome className={Styles.brandIcon} />
            <div>
              <h1 className={Styles.brandName}>
                HomeHunt<span className={Styles.brandPro}>Pro</span>
              </h1>
              <p className={Styles.brandTag}>Property Management Dashboard</p>
            </div>
          </div>

          <div className={Styles.headerStats}>
            <div className={Styles.stat}>
              <FiStar /> {properties.length} Properties
            </div>
            <div className={Styles.stat}>
              <FiTrendingUp /> Active Listings
            </div>
          </div>
        </div>

        <div className={Styles.content}>
          <div className={Styles.formPanel}>

            <div className={Styles.formHeader}>
              <h2>Add New Property</h2>
              <p>Fill all required fields</p>
            </div>

            <form onSubmit={handleSubmit}>

              <textarea
                name="house_details"
                className={Styles.textarea}
                value={formData.house_details}
                onChange={handleChange}
                placeholder="Property Description"
              />

              <input
                name="house_price"
                type="number"
                placeholder="Monthly Rent (₹)"
                className={Styles.input}
                value={formData.house_price}
                onChange={handleChange}
              />

              <select name="bhktype_id" className={Styles.select}
                value={formData.bhktype_id}
                onChange={handleChange}>
                <option value="">BHK Type</option>
                {bhkTypes.map(bhk => (
                  <option key={bhk.id} value={bhk.id}>
                    {bhk.bhktype_name}
                  </option>
                ))}
              </select>

              <select name="floortype_id" className={Styles.select}
                value={formData.floortype_id}
                onChange={handleChange}>
                <option value="">Floor Type</option>
                {floorTypes.map(floor => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floortype_name}
                  </option>
                ))}
              </select>

              <select name="place_id" className={Styles.select}
                value={formData.place_id}
                onChange={handleChange}>
                <option value="">Location</option>
                {places.map(place => (
                  <option key={place.id} value={place.id}>
                    {place.place_name}
                  </option>
                ))}
              </select>

              <select name="tenanttype_id" className={Styles.select}
                value={formData.tenanttype_id}
                onChange={handleChange}>
                <option value="">Preferred Tenant</option>
                {tenantTypes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.tenanttype_name}
                  </option>
                ))}
              </select>

              <label className={Styles.uploadArea}>
                <FiUpload />
                {uploadedFileName || "Upload Property Image"}
                <input type="file" hidden onChange={handleFileChange} />
              </label>

              <div className={Styles.securityNote}>
                <FiLock /> Secure submission
              </div>

              <button className={Styles.submitBtn} disabled={loading}>
                {loading ? "Publishing..." : "Publish Property"}
              </button>
            </form>

          </div>
        </div>

        {/* PROPERTY TABLE */}
        <div className={Styles.tableSection}>
          {properties.length === 0 ? (
            <div className={Styles.emptyState}>No Properties Listed</div>
          ) : (
            <table className={Styles.propertiesTable}>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {properties.map(property => (
                  <tr key={property.id}>
                    <td>{property.house_details}</td>
                    <td>₹ {property.house_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
        </div>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          TransitionComponent={SlideDown}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </div>
    </div>
  );
};

export default House;
