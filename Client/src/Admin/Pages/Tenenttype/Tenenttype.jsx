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
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./Tenenttype.module.css";
import axios from "axios";

const TenantType = () => {
  const [tenantType, setTenantType] = useState("");
  const [tenantTypes, setTenantTypes] = useState([

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
    loadTenentType();
  }, []);
  const loadTenentType = () => {
    axios
      .get("http://127.0.0.1:8000/tenenttype/")
      .then((res) => {
        setTenantTypes(res.data.data || []); // ✅ FIXED
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to load tenant types ❌",
          severity: "error",
        });
      });
  };
  // ================= VALIDATION =================
  const validateTenantType = () => {

    if (!tenantType.trim()) {
      setSnackbar({
        open: true,
        message: "Tenant type is required",
        severity: "warning",
      });
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(tenantType)) {
      setSnackbar({
        open: true,
        message: "Tenant type should contain only letters",
        severity: "error",
      });
      return false;
    }

    if (tenantType.length > 30) {
      setSnackbar({
        open: true,
        message: "Tenant type is too long",
        severity: "error",
      });
      return false;
    }

    return true;
  };


  /* ================= ADD BHK TYPE ================= */
  const handleSave = () => {

    if (!validateTenantType()) return;

    const formData = new FormData();
    formData.append("tenanttype_name", tenantType.trim());

    axios
      .post("http://127.0.0.1:8000/tenenttype/", formData)
      .then(() => {
        setTenantType("");
        loadTenentType();

        setSnackbar({
          open: true,
          message: "Tenant type added successfully 🎉",
          severity: "success",
        });
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to add Tenant type ❌",
          severity: "error",
        });
      });
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        {/* ================= ATTRACTIVE CREATE TENANT TYPE CARD ================= */}
        <div className={styles.createTenantTypeCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <PeopleAltIcon sx={{
                  fontSize: 42,
                  color: "white"
                }} />
              </div>
              <div>
                <Typography className={styles.cardTitle}>
                  Create New Tenant Type
                </Typography>
                <Typography className={styles.cardSubtitle}>
                  Add a new tenant type to your system. Enter the tenant type name and click "Save Tenant Type" to add it.
                </Typography>
              </div>
            </div>

            <div className={styles.createForm}>
              <TextField
                label="Tenant Type Name"
                variant="outlined"
                value={tenantType}
                onChange={(e) => setTenantType(e.target.value)}
                className={styles.tenantTypeInput}
                fullWidth
                placeholder="Enter tenant type (e.g., Individual, Family, Corporate)..."
              />

              <Button
                className={styles.saveButton}
                onClick={handleSave}
                disabled={!tenantType.trim()}
              >
                Save Tenant Type
              </Button>
            </div>
          </div>
        </div>

        {/* ================= TENANT TYPE TABLE CARD ================= */}
        <div className={styles.tenantTypeTableCard}>
          <div className={styles.tableHeader}>
            <Typography className={styles.tableTitle}>
              <GroupsIcon sx={{
                mr: 2,
                fontSize: 24,
                verticalAlign: 'middle'
              }} />
              Tenant Types List
            </Typography>

            <div className={styles.countBadge}>
              {tenantTypes.length} {tenantTypes.length === 1 ? 'Type' : 'Types'}
            </div>
          </div>

          <div className={styles.tableContainer}>
            <Table className={styles.tenantTypeTable}>
              <TableHead>
                <TableRow className={styles.tableHeaderRow}>
                  <TableCell className={styles.tableHeaderCell}>#</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Tenant Type Name</TableCell>
                  <TableCell className={styles.tableHeaderCell}>Added On</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenantTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className={styles.emptyState}>
                      <InfoIcon className={styles.emptyIcon} />
                      <Typography className={styles.emptyText}>
                        No tenant types found
                      </Typography>
                      <Typography className={styles.emptySubtext}>
                        Add your first tenant type above
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tenantTypes.map((item, index) => (
                    <TableRow key={item.id} className={styles.tableRow}>
                      <TableCell className={styles.tableCell}>
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
                              {item.tenanttype_name}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#64748b',
                              marginTop: '2px'
                            }}>
                              ID: TNT{item.id.toString().padStart(3, '0')}
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
        </div>

      </div>
    </div>
  );
};

export default TenantType;