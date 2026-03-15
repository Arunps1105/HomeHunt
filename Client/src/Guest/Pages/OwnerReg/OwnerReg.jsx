import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./OwnerReg.module.css";
import axios from "axios";

const OwnerReg = () => {

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contact: "",
    photo: null,
    proof: null
  });
  const navigate = useNavigate();
  const [photoName, setPhotoName] = useState("Upload Profile Picture");
  const [proofName, setProofName] = useState("Upload Proof");

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // PHOTO
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, photo: file });
      setPhotoName(file.name);
    }
  };

  // PROOF
  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, proof: file });
      setProofName(file.name);
    }
  };
  const validateForm = () => {

    if (!form.name.trim()) {
      alert("Full name is required");
      return false;
    }

    if (!/^[A-Za-z ]+$/.test(form.name)) {
      alert("Name should contain only letters");
      return false;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Enter a valid email address");
      return false;
    }

    if (!form.password.trim()) {
      alert("Password is required");
      return false;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    if (!form.address.trim()) {
      alert("Address is required");
      return false;
    }
    if (!form.contact.trim()) {
      alert("Mobile number is required");
      return false;
    }
    if (!/^[0-9]{10}$/.test(form.contact)) {
      alert("Enter a valid 10-digit mobile number");
      return false;
    }
    if (!form.photo) {
      alert("Please upload profile photo");
      return false;
    }

    if (!form.photo.type.startsWith("image/")) {
      alert("Profile photo must be an image");
      return false;
    }

    if (form.photo.size > 2000000) {
      alert("Profile photo must be under 2MB");
      return false;
    }

    if (!form.proof) {
      alert("Please upload proof document");
      return false;
    }
    if (!form.proof.type.match(/(pdf|jpg|jpeg|png)$/)) {
      alert("Proof must be PDF or Image");
      return false;
    }

    if (form.proof.size > 2000000) {
      alert("Proof file must be under 2MB");
      return false;
    }

    return true;
  };
  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("owner_name", form.name);
    formData.append("owner_email", form.email);
    formData.append("owner_password", form.password);
    formData.append("owner_address", form.address);
    formData.append("owner_contact", form.contact);
    formData.append("owner_photo", form.photo);
    formData.append("owner_proof", form.proof);

    axios.post("http://127.0.0.1:8000/Owner/", formData)
      .then(() => {
        alert("Owner Registered Successfully");
        navigate("/Guest/Login");
      })
      .catch(() => {
        alert("Registration Failed");
      });
  };
  return (
    <div className={Styles.background}>
      <div className={Styles.wrapper}>

        {/* LEFT PANEL */}
        <div className={Styles.leftPanel}>
          <div className={Styles.logo}>
            <div className={Styles.logoIcon}>🏠</div>
            <h1 className={Styles.logoText}>HOMEHUNT</h1>
          </div>

          <div className={Styles.leftImageContainer}>
            <img
              src="https://www.truechip.net/registration/interns/interns_reg.png"
              alt="Register Here"
              className={Styles.illustrationImage}
            />
          </div>

          <div className={Styles.tagline}>
            <h2>Simple Registration</h2>
            <p>Join thousands managing properties with ease</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className={Styles.formPanel}>
          <form onSubmit={handleSubmit} className={Styles.form}>

            <div className={Styles.formHeader}>
              <h2>Create Account</h2>
              <p>Fill in your details</p>
            </div>

            {/* Name & Email */}
            <div className={Styles.formGrid}>
              <div className={Styles.inputGroup}>
                <input
                  className={Styles.input}
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.inputGroup}>
                <input
                  className={Styles.input}
                  placeholder="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className={Styles.formGrid}>
              <div className={Styles.inputGroup}>
                <div className={Styles.passwordContainer}>
                  <input
                    className={Styles.input}
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className={Styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className={Styles.inputGroup}>
                <textarea
                  className={Styles.input}
                  placeholder="Full Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={Styles.inputGroup}>
                <input
                  className={Styles.input}
                  placeholder="Mobile Number"
                  type="tel"
                  name="contact"
                  value={form.contact}
                  onChange={(e) => {
                    if (e.target.value.length <= 10) {
                      handleChange(e);
                    }
                  }}
                  required
                />
              </div>
            </div>

            {/* PHOTO */}
            <div className={Styles.uploadSection}>
              <label className={Styles.uploadLabel}>
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                <div className={Styles.uploadBox}>
                  <span className={Styles.uploadIcon}>📷</span>
                  <span>{photoName}</span>
                </div>
              </label>
            </div>

            {/* PROOF */}
            <div className={Styles.uploadSection}>
              <label className={Styles.uploadLabel}>
                <input type="file" hidden onChange={handleProofChange} />
                <div className={Styles.uploadBox}>
                  <span className={Styles.uploadIcon}>📄</span>
                  <span>{proofName}</span>
                </div>
              </label>
            </div>

            <button type="submit" className={Styles.submitButton}>
              Create Account
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default OwnerReg;
