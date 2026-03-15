import React, { useEffect, useState } from "react";
import Styles from "./Myprofile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import {
  FiUser,
  FiMail,
  FiEdit,
  FiLock
} from "react-icons/fi";


const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const oid = sessionStorage.getItem("oid");
    if (!oid) return;

    axios
      .get(`http://127.0.0.1:8000/OwnerProfile/${oid}/`)
      .then((res) => {
        if (res.data.data && res.data.data.length > 0) {
          setProfile(res.data.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className={Styles.page}>
      <div className={Styles.glow1}></div>
      <div className={Styles.glow2}></div>

      <div className={Styles.profileCard}>
        {/* Avatar */}
        <div className={Styles.avatarWrapper}>
          <img src={`http://127.0.0.1:8000/${profile.owner_photo}`} alt="Owner Profile" width="120" />        </div>

        <h2 className={Styles.heading}>OWNER</h2>
        <div className={Styles.line}></div>

        {/* Owner Name */}
        <div className={Styles.infoBox}>
          <FiUser className={Styles.icon} />
          <div>
            <span className={Styles.label}>OWNER NAME</span>
            <p>{profile.owner_name}</p>
          </div>
        </div>


        <div className={Styles.infoBox}>
          <FiMail className={Styles.icon} />
          <div>
            <span className={Styles.label}>EMAIL</span>
            <input
              type="email"
              value={profile.owner_email || ""}
              readOnly
              className={Styles.inputField}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={Styles.buttonRow}>
          <button
            className={Styles.editBtn}
            onClick={() => navigate("/Owner/EditProfile")}
          >
            <FiEdit className={Styles.btnIcon} />
            EDIT PROFILE
          </button>

          <button
            className={Styles.passwordBtn}
            onClick={() => navigate("/Owner/ChangePassword")}
          >
            <FiLock className={Styles.btnIcon} />
            CHANGE PASSWORD
          </button>

        </div>

        <div className={Styles.socials}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
