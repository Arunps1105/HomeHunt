import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Styles from "./Registeration.module.css";
import axios from "axios";

const Registeration = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    dob: "",
    tenenttype: "",
    photo: null,
    proof: null
  });
  const navigate = useNavigate();

  const [tenentTypes, setTenentTypes] = useState([]);
  const [fileName, setFileName] = useState("No file chosen");
  const [proofFileName, setProofFileName] = useState("No file chosen");

  useEffect(() => {
    loadTenentTypes();
  }, []);

  const loadTenentTypes = () => {
    axios
      .get("http://127.0.0.1:8000/tenenttype/")
      .then((res) => {
        setTenentTypes(res.data.data || []);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        photo: file
      });
      setFileName(file.name);
    }
  };
  const handleProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        proof: file
      });
      setProofFileName(file.name);
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
    alert("Enter a valid email");
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

  if (!/^[0-9]{10}$/.test(form.contact)) {
    alert("Enter a valid 10 digit mobile number");
    return false;
  }

  if (!form.address.trim()) {
    alert("Address is required");
    return false;
  }

  if (!form.dob) {
    alert("Date of birth is required");
    return false;
  }

  const today = new Date();
  const dobDate = new Date(form.dob);

  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }

  if (age < 18) {
    alert("You must be at least 18 years old to register");
    return false;
  }

  if (!form.tenenttype) {
    alert("Please select tenant type");
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
    alert("Photo must be under 2MB");
    return false;
  }

  if (!form.proof) {
    alert("Please upload ID proof");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("user_name", form.name);
    formData.append("user_email", form.email);
    formData.append("user_password", form.password);
    formData.append("user_contact", form.contact);
    formData.append("user_address", form.address);
    formData.append("user_dob", form.dob);
    formData.append("tenenttype_id", form.tenenttype);
    formData.append("user_photo", form.photo);
    formData.append("user_proof", form.proof);

    console.log(formData);


    axios
      .post("http://127.0.0.1:8000/User/", formData)
      .then(() => {
        alert("User Registered Successfully");
        navigate("/Guest/Login"); // Redirect to login after successful registration
        setForm({
          name: "",
          email: "",
          password: "",
          contact: "",
          address: "",
          dob: "",
          tenenttype: "", // Fixed: consistent with state key
          photo: null,
          proof: null
        });
        setFileName("No file chosen");
        setProofFileName("No file chosen");
      })
      .catch((error) => {
        console.log(error);
        alert("Registration Failed");
      });
  };

  return (
    <div className={Styles.background}>
      <div className={Styles.wrapper}>

        {/* LEFT PANEL */}
        <div className={Styles.leftPanel}>
          <img src="/join-illustration.png" className={Styles.joinImage} alt="" />
          <h2>Join Our Platform</h2>
          <p>Create your account to manage your profile securely.</p>
        </div>

        {/* RIGHT PANEL */}
        <form className={Styles.registercontainer} onSubmit={handleSubmit}>
          <h2 className={Styles.title}>Create Account</h2>

          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>Full Name</label>
              <input
                className={Styles.input}
                placeholder="Enter your full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={Styles.field}>
              <label className={Styles.label}>Email Address</label>
              <input
                className={Styles.input}
                placeholder="Enter your email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>Password</label>
              <input
                className={Styles.input}
                placeholder="Create a password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className={Styles.field}>
              <label className={Styles.label}>Contact Number</label>
              <input
                className={Styles.input}
                placeholder="Enter contact number"
                name="contact"
                value={form.contact}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handleChange(e)
                  }
                }}
              />
            </div>
          </div>

          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>Address</label>
              <input
                className={Styles.input}
                placeholder="Enter your address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>Date of Birth</label>
              <div className={Styles.dateField}>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    .toISOString()
                    .split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className={Styles.field}>
              <label className={Styles.label}>Tenant Type</label>
              <select
                className={Styles.input}
                name="tenenttype"
                value={form.tenenttype}
                onChange={handleChange}
                required
              >
                <option value="">Select tenant type</option>
                {tenentTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tenanttype_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>Profile Photo</label>
              <div className={Styles.inputLike}>
                <input
                  type="file"
                  id="fileInput"
                  className={Styles.fileInput}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <label htmlFor="fileInput" className={Styles.fileUpload}>
                  <span className={Styles.fileText}>
                    📷 {fileName}
                  </span>

                </label>
              </div>
            </div>
          </div>
          <div className={Styles.row}>
            <div className={Styles.field}>
              <label className={Styles.label}>ID Proof</label>

              <div className={Styles.inputLike}>
                <input
                  type="file"
                  id="proofInput"
                  className={Styles.fileInput}
                  onChange={handleProofChange}
                  accept=".pdf,image/*"
                />

                <label htmlFor="proofInput" className={Styles.fileUpload}>
                  <span className={Styles.fileText}>📄 {proofFileName}</span>
                </label>
              </div>
            </div>
          </div>

          <button className={Styles.button} type="submit">
            Register
          </button>
        </form>

      </div>
    </div>
  );
};

export default Registeration;