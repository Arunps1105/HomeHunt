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
  Slide,
  Alert,
} from "@mui/material";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import styles from "./Bhktype.module.css";
import axios from "axios";

const Bhktype = () => {
  const [bhkType, setBhkType] = useState("");
  const [bhkTypes, setBhkTypes] = useState([]);
  const SlideDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  // Snackbar state (same as District)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* ================= LOAD BHK TYPES ================= */
  useEffect(() => {
    loadBhkTypes();
  }, []);

  const loadBhkTypes = () => {
    axios
      .get("http://127.0.0.1:8000/bhktype/")
      .then((res) => {
        setBhkTypes(res.data.data || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load BHK types ❌",
          severity: "error",
        });
      });
  };
  //validation//
  const validateBhkType = () => {
    if (!bhkType.trim()) {
      setSnackbar({
        open: true,
        message: "BHK Type is required",
        severity: "error",
      });
      return false;
    }

    if (!/^[A-Za-z0-9 ]+$/.test(bhkType)) {
      setSnackbar({
        open: true,
        message: "BHK Type should contain only letters and numbers",
        severity: "error",
      });
      return false;
    }

    if (bhkType.length > 20) {
      setSnackbar({
        open: true,
        message: "BHK Type is too long",
        severity: "error",
      });
      return false;
    }

    return true;
  };
  //
  /* ================= ADD BHK TYPE ================= */
  const handleSave = () => {

    if (!validateBhkType()) return;

    const formData = new FormData();
    formData.append("bhktype_name", bhkType.trim());

    axios
      .post("http://127.0.0.1:8000/bhktype/", formData)
      .then((res) => {
        setBhkTypes(res.data.data || []);
        setBhkType("");

        setSnackbar({
          open: true,
          message: "BHK type added successfully 🎉",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to add BHK type ❌",
          severity: "error",
        });
      });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* ================= CREATE BHK TYPE CARD ================= */}
        <div className={styles.createBhkTypeCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <HomeWorkIcon sx={{ fontSize: 42, color: "white" }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Create New BHK Type
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Enter BHK type name and click Save BHK Type
                </Typography>
              </div>
            </div>

            <div className={styles.createForm}>
              <TextField
                label="BHK Type Name"
                variant="outlined"
                value={bhkType}
                onChange={(e) => setBhkType(e.target.value)}
                className={styles.bhkTypeInput}
                fullWidth
                placeholder="1 BHK, 2 BHK, Studio..."
              />

              <Button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!bhkType.trim()}
              >
                Save BHK Type
              </Button>
            </div>
          </div>
        </div>

        {/* ================= BHK TYPE TABLE ================= */}
        <div className={styles.bhkTypeTableCard}>
          <div className={styles.tableHeader}>
            <Typography className={styles.tableTitle}>
              <ApartmentIcon sx={{ mr: 2 }} />
              BHK Types List
            </Typography>

            <div className={styles.countBadge}>
              {bhkTypes.length}{" "}
              {bhkTypes.length === 1 ? "Type" : "Types"}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <Table className={styles.bhkTypeTable}>
              <TableHead>
                <TableRow className={styles.tableHeaderRow}>
                  <TableCell>#</TableCell>
                  <TableCell>BHK Type Name</TableCell>
                  <TableCell>Added On</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {bhkTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={styles.emptyState}>
                      <InfoIcon />
                      <Typography>No BHK types found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  bhkTypes.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <CheckCircleIcon sx={{ color: "#10b981", mr: 1 }} />
                        {item.bhktype_name}

                      </TableCell>
                      <TableCell>
                        {item.created_at || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ================= SNACKBAR ================= */}
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

export default Bhktype;
