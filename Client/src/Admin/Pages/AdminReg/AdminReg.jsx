import React, { useState } from "react";
import styles from "./AdminReg.module.css";
import axios from "axios";
import { Snackbar, Alert, Slide } from "@mui/material";

const AdminReg = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });


  //validation//
  const validateForm = () => {

    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Name is required",
        severity: "error",
      });
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(formData.name)) {
      setSnackbar({
        open: true,
        message: "Name should contain only letters",
        severity: "error",
      });
      return false;
    }

    if (!formData.email.trim()) {
      setSnackbar({
        open: true,
        message: "Email is required",
        severity: "error",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setSnackbar({
        open: true,
        message: "Enter a valid email address",
        severity: "error",
      });
      return false;
    }

    if (!formData.password) {
      setSnackbar({
        open: true,
        message: "Password is required",
        severity: "error",
      });
      return false;
    }

    if (formData.password.length < 6) {
      setSnackbar({
        open: true,
        message: "Password must be at least 6 characters",
        severity: "error",
      });
      return false;
    }

    return true;
  };
  //
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const SlideDown = (props) => <Slide {...props} direction="down" />;

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "name") {
    // allow only letters and spaces
    if (!/^[A-Za-z ]*$/.test(value)) return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("admin_name", formData.name.trim());
    data.append("admin_email", formData.email.trim());
    data.append("admin_password", formData.password.trim());

    axios
      .post("http://127.0.0.1:8000/Admin/", data)
      .then(() => {
        setFormData({
          name: "",
          email: "",
          password: "",
          contact: "",
        });

        setSnackbar({
          open: true,
          message: "Admin registered successfully 🎉",
          severity: "success",
        });
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: "Failed to register admin ❌",
          severity: "error",
        });
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Admin Registration</h2>
        <p className={styles.subtitle}>Create a new administrator account</p>

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              pattern="[A-Za-z ]+"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>



          <button type="submit" className={styles.button}>
            Register Admin
          </button>
        </form>
      </div>

      {/* Snackbar (same behavior as TenantType) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideDown}
        sx={{ zIndex: 3000, mt: "70px" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminReg;
