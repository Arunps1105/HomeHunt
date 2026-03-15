import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Snackbar,
  Alert,
  Slide,
  CircularProgress,
} from "@mui/material";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import PlaceIcon from "@mui/icons-material/Place";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import styles from "./Place.module.css";
import axios from "axios";

const Place = () => {
  const [place, setPlace] = useState("");
  const [district, setDistrict] = useState("");
  const [districts, setDistricts] = useState([]);
  const [places, setPlaces] = useState([]);
  const SlideDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  // State for feedback messages
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info" | "warning"
  });

  // State for loading
  const [loading, setLoading] = useState({
    districts: false,
    places: false,
    submitting: false,
  });

  /* ================= LOAD DISTRICTS ================= */
  useEffect(() => {
    setLoading(prev => ({ ...prev, districts: true }));
    axios
      .get("http://127.0.0.1:8000/District/")
      .then((res) => {
        setDistricts(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error loading districts:", err);
        showMessage("Failed to load districts", "error");
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, districts: false }));
      });
  }, []);

  /* ================= LOAD PLACES ================= */
  useEffect(() => {
    setLoading(prev => ({ ...prev, places: true }));
    axios
      .get("http://127.0.0.1:8000/Place/")
      .then((res) => {
        setPlaces(res.data.data || []);
      })
      .catch((err) => {
        console.error("Error loading places:", err);
        showMessage("Failed to load places", "error");
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, places: false }));
      });
  }, []);

  // Helper function to get district name by ID
  const getDistrictName = (districtId) => {
    const foundDistrict = districts.find(d => d.id === districtId);
    return foundDistrict ? foundDistrict.district_name : "Unknown District";
  };

  // Helper function to show messages
  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };
  // ================= VALIDATION =================
  const validatePlace = () => {

    if (!district) {
      showMessage("Please select a district", "warning");
      return false;
    }

    if (!place.trim()) {
      showMessage("Place name is required", "warning");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(place)) {
      showMessage("Place name should contain only letters", "error");
      return false;
    }

    if (place.length > 30) {
      showMessage("Place name is too long", "error");
      return false;
    }

    return true;
  };
  /* ================= ADD PLACE ================= */
  const handleAddPlace = () => {

    if (!validatePlace()) return;

    setLoading(prev => ({ ...prev, submitting: true }));

    const formData = new FormData();
    formData.append("place_name", place.trim());
    formData.append("district_id", district);

    axios
      .post("http://127.0.0.1:8000/Place/", formData)
      .then((res) => {
        // Refresh places list
        setLoading(prev => ({ ...prev, places: true }));
        axios
          .get("http://127.0.0.1:8000/Place/")
          .then((res) => {
            setPlaces(res.data.data || []);
            showMessage("Place added successfully!");
          })
          .catch((err) => {
            console.error("Error refreshing places:", err);
            showMessage("Place added but failed to refresh list", "warning");
          })
          .finally(() => {
            setLoading(prev => ({ ...prev, places: false }));
          });

        // Clear form
        setPlace("");
        setDistrict("");
      })
      .catch((err) => {
        console.error("Error adding place:", err);
        const errorMsg = err.response?.data?.message || "Failed to add place";
        showMessage(errorMsg, "error");
      })
      .finally(() => {
        setLoading(prev => ({ ...prev, submitting: false }));
      });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* ================= CREATE PLACE CARD ================= */}
        <div className={styles.createPlaceCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <LocationOnIcon sx={{ fontSize: 42, color: "white" }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Add New Place
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Select district, enter place name and save
                </Typography>
              </div>
            </div>

            <div className={styles.createForm}>
              {loading.districts ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <CircularProgress size={24} />
                </div>
              ) : (
                <TextField
                  select
                  label="Select District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  fullWidth
                  disabled={loading.submitting}
                >
                  {districts.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.district_name}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                label="Place Name"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                fullWidth
                disabled={loading.submitting}
              />

              <Button
                className={styles.saveButton}
                onClick={handleAddPlace}
                startIcon={
                  loading.submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                disabled={!place.trim() || !district || loading.submitting}
              >
                {loading.submitting ? "Saving..." : "Save Place"}
              </Button>
            </div>
          </div>
        </div>

        {/* ================= PLACE TABLE ================= */}
        <div className={styles.placeTableCard}>
          <div className={styles.tableHeader}>
            <Typography className={styles.tableTitle}>
              <PlaceIcon sx={{ mr: 1 }} />
              Places List
            </Typography>
            <div className={styles.countBadge}>
              {loading.places ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                `${places.length} Places`
              )}
            </div>
          </div>

          {loading.places ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <CircularProgress />
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Place</TableCell>
                  <TableCell>District</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {places.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <InfoIcon />
                      <Typography>No places found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  places.map((p, i) => (
                    <TableRow key={p.id}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>
                        <CheckCircleIcon sx={{ color: "#10b981", mr: 1 }} />
                        {p.place_name}
                      </TableCell>
                      {/* Fixed: Get district name from districts data */}
                      <TableCell>
                        {getDistrictName(p.district_id)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* ================= FEEDBACK SNACKBAR ================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideDown}
        sx={{
          zIndex: 3000,
          mt: "70px", // keeps it nicely below navbar
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
            borderRadius: "14px",
            minWidth: "320px",
            boxShadow:
              "0 15px 35px rgba(0,0,0,0.25), 0 5px 15px rgba(0,0,0,0.15)",
            alignItems: "center",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </div>
  );
};

export default Place;