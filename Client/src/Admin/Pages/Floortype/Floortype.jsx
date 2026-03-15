import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Snackbar,
  Alert,
  Slide,
  TableRow
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import CategoryIcon from "@mui/icons-material/Category";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./FloorType.module.css";
import axios from "axios";


const FloorType = () => {
  const [floorType, setFloorType] = useState("");
  const [floorTypes, setFloorTypes] = useState([

  ]);
  // Snackbar state (same as District)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const SlideDown = (props) => {
    return <Slide {...props} direction="down" />;
  };


  useEffect(() => {
    loadFloorTypes();
  }, []);

  const loadFloorTypes = () => {
    axios
      .get("http://127.0.0.1:8000/floortype/")
      .then((res) => {
        setFloorTypes(res.data.data || []);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load floor types ❌",
          severity: "error",
        });
      });
  };
  //validation//
  const validateFloorType = () => {
    if (!floorType.trim()) {
      setSnackbar({
        open: true,
        message: "Floor type is required",
        severity: "error",
      });
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(floorType)) {
      setSnackbar({
        open: true,
        message: "Floor type should contain only letters",
        severity: "error",
      });
      return false;
    }

    if (floorType.length > 30) {
      setSnackbar({
        open: true,
        message: "Floor type is too long",
        severity: "error",
      });
      return false;
    }

    return true;
  };
  //

  /* ================= ADD BHK TYPE ================= */
  const handleSave = () => {

    if (!validateFloorType()) return;

    const formData = new FormData();
    formData.append("floortype_name", floorType.trim());

    axios
      .post("http://127.0.0.1:8000/floortype/", formData)
      .then(() => {
        setFloorType("");
        loadFloorTypes();

        setSnackbar({
          open: true,
          message: "Floor type added successfully 🎉",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to add Floor type ❌",
          severity: "error",
        });
      });
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* ================= ATTRACTIVE CREATE FLOOR TYPE CARD ================= */}
        <div className={styles.createFloorTypeCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <LayersIcon sx={{
                  fontSize: 42,
                  color: "white"
                }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Add New Floor Type
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Add a new floor type to your system. Enter the floor type name and click "Save Floor Type" to add it.
                </Typography>
              </div>
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

            <div className={styles.createForm}>
              <TextField
                label="Floor Type Name"
                variant="outlined"
                value={floorType}
                onChange={(e) => setFloorType(e.target.value)}
                className={styles.floorTypeInput}
                fullWidth
                placeholder="Enter floor type (e.g., Wooden, Marble, Carpet)..."
              />

              <Button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!floorType.trim()}
              >
                Save Floor Type
              </Button>
            </div>
          </div>
        </div>

        {/* ================= FLOOR TYPE TABLE CARD ================= */}
        <div className={styles.floorTypeTableCard}>
          <div className={styles.tableHeader}>
            <Typography className={styles.tableTitle}>
              <CategoryIcon sx={{
                mr: 2,
                fontSize: 24,
                verticalAlign: 'middle'
              }} />
              Floor Types List
            </Typography>

            <div className={styles.countBadge}>
              {floorTypes.length} {floorTypes.length === 1 ? 'Type' : 'Types'}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <Table className={styles.floorTypeTable}>
              <TableHead>
                <TableRow className={styles.tableHeaderRow}>
                  <TableCell className={styles.tableHeaderCell}>#</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Floor Type Name</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Added On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {floorTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={styles.emptyState}>
                      <InfoIcon className={styles.emptyIcon} />
                      <Typography className={styles.emptyText}>
                        No floor types found
                      </Typography>
                      <Typography className={styles.emptySubtext}>
                        Add your first floor type above
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  floorTypes.map((item, index) => (
                    <TableRow key={item.id} className={styles.tableRow}>
                      <TableCell className={`${styles.tableCell} ${styles.indexCell}`}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <CheckCircleIcon sx={{
                            fontSize: 20,
                            color: '#10b981',
                            filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.3))'
                          }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>
                              {item.floortype_name}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              marginTop: '2px'
                            }}>

                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className={styles.tableCell}>
                        <div style={{
                          background: 'rgba(99, 102, 241, 0.1)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          display: 'inline-block',
                          fontSize: '14px',
                          color: '#6366f1',
                          fontWeight: 500
                        }}>
                          {item.created_at}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

          </div>
        </div>

      </div>
    </div>
  );
};

export default FloorType;