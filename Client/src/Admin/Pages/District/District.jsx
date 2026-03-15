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
  Snackbar,
  Alert,
  Slide,
} from "@mui/material";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import styles from "./District.module.css";
import axios from "axios";

const District = () => {
  const [value, setValue] = useState("");
  const [districts, setDistricts] = useState([]);
  const SlideDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= LOAD DISTRICTS ================= */
  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = () => {
    axios
      .get("http://127.0.0.1:8000/District/")
      .then((res) => {
        setDistricts(res.data.data || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load districts ❌",
          severity: "error",
        });
      });
  };
  //validation//
  const validateDistrict = () => {
    if (!value.trim()) {
      setSnackbar({
        open: true,
        message: "District name is required",
        severity: "error",
      });
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(value)) {
      setSnackbar({
        open: true,
        message: "District should contain only letters",
        severity: "error",
      });
      return false;
    }

    if (value.length > 30) {
      setSnackbar({
        open: true,
        message: "District name is too long",
        severity: "error",
      });
      return false;
    }

    return true;
  };
  //
  /* ================= ADD DISTRICT ================= */
  const handleSave = () => {

    if (!validateDistrict()) return;

    const formData = new FormData();
    formData.append("district_name", value.trim());

    axios
      .post("http://127.0.0.1:8000/District/", formData)
      .then((res) => {
        setDistricts(res.data.data || []);
        setValue("");

        setSnackbar({
          open: true,
          message: "District added successfully 🎉",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to add district ❌",
          severity: "error",
        });
      });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* ================= CREATE DISTRICT CARD ================= */}
        <div className={styles.createDistrictCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <AddLocationAltIcon sx={{ fontSize: 42, color: "white" }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Create New District
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Enter district name and click Add District
                </Typography>
              </div>
            </div>

            <div className={styles.createForm}>
              <TextField
                label="District Name"
                variant="outlined"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.districtInput}
                fullWidth
                placeholder="Enter district name"
              />

              <Button
                className={styles.addButton}
                onClick={handleSave}
                disabled={!value.trim()}
              >
                Add District
              </Button>
            </div>
          </div>
        </div>

        {/* ================= DISTRICT TABLE ================= */}
        <div className={styles.districtTableCard}>
          <div className={styles.tableHeader}>
            <Typography className={styles.tableTitle}>
              <LocationCityIcon sx={{ mr: 1 }} />
              District List
            </Typography>
            <div className={styles.countBadge}>
              {districts.length} Districts
            </div>
          </div>

          <div className={styles.tableContainer}>
            <Table className={styles.districtTable}>
              <TableHead>
                <TableRow className={styles.tableHeaderRow}>
                  <TableCell className={styles.tableHeaderCell}>#</TableCell>
                  <TableCell className={styles.tableHeaderCell}>
                    District Name
                  </TableCell>
                  <TableCell className={styles.tableHeaderCell}>
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {districts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={styles.emptyState}>
                      <InfoIcon className={styles.emptyIcon} />
                      <Typography className={styles.emptyText}>
                        No districts found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  districts.map((item, index) => (
                    <TableRow key={item.id} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <CheckCircleIcon sx={{ color: "#10b981" }} />
                          {item.district_name}
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        Active
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ================= SNACKBAR MESSAGE ================= */}
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

export default District;
