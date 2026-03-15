import React, { useState, useEffect, useCallback } from "react";
import {
  Button, Typography, Snackbar, Alert, Slide,
  Select, MenuItem, FormControl, InputLabel,
  CircularProgress
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LayersIcon from "@mui/icons-material/Layers";
import styles from "./UserFloorType.module.css";
import axios from "axios";

const API = "http://127.0.0.1:8000";

// ✅ Defined outside component — not recreated on every render
const SlideDown = (props) => <Slide {...props} direction="down" />;

const UserFloorType = () => {
  const [floortypeId, setFloortypeId]   = useState("");
  const [floorTypes, setFloorTypes]     = useState([]);
  const [userFloors, setUserFloors]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [listLoading, setListLoading]   = useState(true);  // ✅ list fetch state
  const [confirmId, setConfirmId]       = useState(null);  // ✅ inline confirm

  const [snackbar, setSnackbar] = useState({
    open: false, message: "", severity: "success",
  });

  const userId = sessionStorage.getItem("uid");

  const showSnack = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  /* ── LOAD FLOOR TYPES ── */
  const loadFloorTypes = useCallback(() => {
    axios
      .get(`${API}/floortype/`)
      .then((res) => setFloorTypes(res.data.data || []))
      .catch(() => showSnack("Failed to load floor types ❌", "error"));
  }, []);

  /* ── LOAD USER FLOORS ── */
  const loadUserFloorTypes = useCallback(() => {
    setListLoading(true);
    axios
      .get(`${API}/UserFloortype/?user_id=${userId}`)
      .then((res) => setUserFloors(res.data.data || []))
      .catch(() => showSnack("Failed to load your preferences ❌", "error"))
      .finally(() => setListLoading(false));
  }, [userId]);

  useEffect(() => {
    loadFloorTypes();
    loadUserFloorTypes();
  }, [loadFloorTypes, loadUserFloorTypes]);

  /* ── SUBMIT ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!floortypeId) {
      showSnack("Please select a floor type", "warning");
      return;
    }
    const alreadySelected = userFloors.some(
  f => f.floortype_id == floortypeId
);

if (alreadySelected) {
  setSnackbar({
    open: true,
    message: "Floor type already selected",
    severity: "warning",
  });
  return;
}
    


    setLoading(true);
    const fd = new FormData();
    fd.append("user_id", userId);
    fd.append("floortype_id", floortypeId);

    axios
      .post(`${API}/UserFloortype/`, fd)
      .then(() => {
        setFloortypeId("");
        loadUserFloorTypes();
        showSnack("Floor type added successfully! ✅");
      })
      .catch(() => showSnack("Failed to assign floor type ❌", "error"))
      .finally(() => setLoading(false));
  };

  /* ── DELETE with inline confirm ── */
  const handleDeleteClick = (id) => setConfirmId(id); // ✅ show inline confirm

  const handleDeleteConfirm = () => {
    axios
      .delete(`${API}/UserFloortypeDelete/${confirmId}/`)
      .then(() => {
        setConfirmId(null);
        loadUserFloorTypes();
        showSnack("Floor preference removed 🗑️");
      })
      .catch(() => showSnack("Failed to delete preference ❌", "error"));
  };

  // ✅ Dropdown only shows floor types not yet added
  const availableFloors = floorTypes.filter(
    (ft) => !userFloors.some(
      (uf) => uf.floortype_id__floortype_name === ft.floortype_name
    )
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.createFloorTypeCard}>
          <div className={styles.cardContent}>

            {/* ── HEADER ── */}
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <LayersIcon sx={{ fontSize: 42, color: "white" }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Floor Type Preferences
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Select floor types to personalize your search results.
                </Typography>
              </div>
            </div>

            {/* ── FORM ── */}
            <form onSubmit={handleSubmit} className={styles.createForm}>
              <FormControl fullWidth className={styles.floorTypeInput}>
                <InputLabel>Floor Type</InputLabel>
                <Select
                  value={floortypeId}
                  onChange={(e) => setFloortypeId(e.target.value)}
                  label="Floor Type"
                >
                  <MenuItem value=""><em>-- Select Floor Type --</em></MenuItem>
                  {availableFloors.length === 0 ? (
                    // ✅ All added state in dropdown
                    <MenuItem disabled>All floor types added ✓</MenuItem>
                  ) : (
                    availableFloors.map((floor) => (
                      <MenuItem key={floor.id} value={floor.id}>
                        {floor.floortype_name}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  className={styles.saveButton}
                  disabled={!floortypeId || loading}
                  startIcon={loading && <CircularProgress size={16} color="inherit" />}
                >
                  {loading ? "Saving..." : "Save Preference"}
                </Button>

                <Button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setFloortypeId("")}
                  disabled={!floortypeId || loading}
                >
                  Clear
                </Button>
              </div>
            </form>

            {/* ── SAVED LIST ── */}
            <div className={styles.savedSection}>
              <Typography className={styles.savedTitle}>
                Your Floor Preferences
                {/* ✅ Count badge */}
                {userFloors.length > 0 && (
                  <span className={styles.countBadge}>{userFloors.length}</span>
                )}
              </Typography>

              {listLoading ? (
                <div className={styles.listLoading}>
                  <CircularProgress size={24} />
                </div>
              ) : userFloors.length === 0 ? (
                <Typography className={styles.emptyText}>
                  No floor type selected yet. Add one above!
                </Typography>
              ) : (
                <div className={styles.savedList}>
                  {userFloors.map((item, index) => (
                    <div key={item.id} className={styles.savedItem}>
                      <div className={styles.savedItemLeft}>
                        <span className={styles.indexBadge}>{index + 1}</span>
                        <span className={styles.itemName}>
                          {item.floortype_id__floortype_name}
                        </span>
                      </div>

                      {/* ✅ Inline confirm instead of window.confirm */}
                      {confirmId === item.id ? (
                        <div className={styles.confirmRow}>
                          <span className={styles.confirmText}>Remove?</span>
                          <Button
                            size="small"
                            color="error"
                            variant="contained"
                            onClick={handleDeleteConfirm}
                            sx={{ minWidth: 0, px: 1.5 }}
                          >
                            Yes
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => setConfirmId(null)}
                            sx={{ minWidth: 0, px: 1.5 }}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── SNACKBAR ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideDown}
        sx={{ zIndex: 3000, mt: "70px" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserFloorType;