import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOtp = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/SendOTP/", { email });
      alert("OTP sent to your email");
    } catch {
      alert("Email not found");
    }
  };

const resetPassword = async () => {

  if(password !== confirmPassword){
    alert("Passwords do not match");
    return;
  }

  try {

    const res = await axios.post(
      "http://127.0.0.1:8000/ResetPassword/",
      { email, otp, password }
    );

    alert(res.data.message);

    navigate("/guest/Login");

  } catch (error) {

    alert(error.response?.data?.message || "Reset failed");

  }

};
  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <h2>Forgot Password</h2>
        <p>Enter your email to reset your password</p>

        <input
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button onClick={sendOtp} className={styles.btn}>
          Send OTP
        </button>

        <input
          type="text"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
  type="password"
  placeholder="Confirm Password"
  onChange={(e) => setConfirmPassword(e.target.value)}
/>

        <button onClick={resetPassword} className={styles.resetBtn}>
          Reset Password
        </button>

      </div>
    </div>
  );
};

export default ForgotPassword;