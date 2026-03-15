import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./UserBhktype.module.css";

const API = "http://127.0.0.1:8000";

const UserBhktype = () => {
  const [bhkTypes, setBhkTypes] = useState([]);
  const [bhkTypeId, setBhkTypeId] = useState("");
  const [userBhks, setUserBhks] = useState([]);

  const uid = sessionStorage.getItem("uid");

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    loadBhkTypes();
    loadUserBhktype();
  }, []);

  const loadBhkTypes = () => {
    axios
      .get(`${API}/bhktype/`)
      .then((res) => {
        setBhkTypes(res.data?.data || []);
      })
      .catch((err) => {
        console.error("Failed to load BHK types", err);
      });
  };

  const loadUserBhktype = () => {
    axios
      .get(`${API}/UserBhktype/?user_id=${uid}`)
      .then((res) => {
        const data = res.data?.data || [];
        setUserBhks(data);
      })
      .catch((err) => console.error(err));
  };

  /* ================= AUTO SELECT SAVED BHK ================= */

  useEffect(() => {
    if (userBhks.length === 0) {
      setBhkTypeId("");
      return;
    }

    if (bhkTypes.length > 0) {
      const savedName = userBhks[0].bhktype_id__bhktype_name;

      const matched = bhkTypes.find(
        (b) => b.bhktype_name === savedName
      );

      if (matched) {
        setBhkTypeId(matched.id);
      }
    }
  }, [userBhks, bhkTypes]);

  /* ================= SAVE PREFERENCE ================= */

  const handleSubmit = () => {
    if (!bhkTypeId || !uid) return;

    const selectedBhk = bhkTypes.find(b => b.id === bhkTypeId);

    const alreadySelected = userBhks.some(
      (b) => b.bhktype_id__bhktype_name === selectedBhk?.bhktype_name
    );

    if (alreadySelected) {
      alert("BHK already selected");
      return;
    }

    const formData = new FormData();
    formData.append("bhktype_id", bhkTypeId);
    formData.append("user_id", uid);

    axios
      .post(`${API}/UserBhktype/`, formData)
      .then(() => {
        loadUserBhktype();
        alert("Preferred BHK Saved Successfully ✅");
      })
      .catch((err) => {
        console.error("Insert failed", err);
      });
  };

  /* ================= DELETE PREFERENCE ================= */

  const deletePreference = (id) => {
    if (!window.confirm("Delete this BHK preference?")) return;

    axios
      .delete(`${API}/UserBhktypeDelete/${id}/`)
      .then(() => {
        loadUserBhktype();
        setBhkTypeId("");
      })
      .catch((err) => {
        console.error("Delete failed", err);
      });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <Paper className={styles.createFloorTypeCard} elevation={4}>
          <div className={styles.cardContent}>

            {/* HEADER */}
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <HomeIcon sx={{ fontSize: 42, color: "white" }} />
              </div>

              <Typography className={styles.cardTitle}>
                Select Preferred BHK
              </Typography>

              <Typography className={styles.cardSubtitle}>
                Choose your preferred BHK type
              </Typography>
            </div>

            {/* DROPDOWN */}
            <FormControl fullWidth className={styles.floorTypeInput}>
              <InputLabel>BHK Type</InputLabel>

              <Select
                value={bhkTypeId}
                label="BHK Type"
                onChange={(e) => setBhkTypeId(e.target.value)}
              >
                <MenuItem value="">
                  <em>-- Select BHK Type --</em>
                </MenuItem>

                {bhkTypes.map((bhk) => {

                  const alreadySelected = userBhks.some(
                    (b) => b.bhktype_id__bhktype_name === bhk.bhktype_name
                  );

                  return (
                    <MenuItem
                      key={bhk.id}
                      value={bhk.id}
                      disabled={alreadySelected}
                    >
                      {bhk.bhktype_name} {alreadySelected && "✓"}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            {/* SAVE BUTTON */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!bhkTypeId}
              >
                Save Preference
              </Button>
            </div>

            {/* SAVED BHK TABLE */}
            <div style={{ marginTop: "30px" }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Your Selected BHK
              </Typography>

              {userBhks.length === 0 ? (
                <Typography>No BHK selected yet.</Typography>
              ) : (
                <Table className={styles.bhkTypeTable}>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>BHK Type</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {userBhks.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>
                          <CheckCircleIcon
                            sx={{ color: "#10b981", mr: 1 }}
                          />
                          {item.bhktype_id__bhktype_name}
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deletePreference(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

          </div>
        </Paper>
      </div>
    </div>
  );
};

export default UserBhktype;