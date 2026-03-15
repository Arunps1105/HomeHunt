import React, { useEffect, useState } from "react";
import Styles from "./Myprofile.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = sessionStorage.getItem("uid");
    if (!uid) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/Userprofile/${uid}/`)
      .then((res) => {
        setProfile(res.data.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className={Styles.loadingContainer}>
        <div className={Styles.loadingSpinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={Styles.errorContainer}>
        <div className={Styles.errorIcon}>😕</div>
        <h3>Profile Not Found</h3>
        <p>Unable to load your profile information</p>
        <button onClick={() => navigate("/User")} className={Styles.errorBtn}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={Styles.background}>
      {/* Decorative Elements */}
      <div className={Styles.decorativeCircle1}></div>
      <div className={Styles.decorativeCircle2}></div>
      <div className={Styles.decorativeCircle3}></div>

      <div className={Styles.wrapper}>
        {/* LEFT PROFILE CARD */}
        <div className={Styles.leftPanel}>
          <div className={Styles.patternOverlay}></div>

          <div className={Styles.avatarContainer}>
            <div className={Styles.avatarWrapper}>
              <div className={Styles.avatar}>
                {profile.user_photo ? (
                  <img
                    src={`http://127.0.0.1:8000/${profile.user_photo}`}
                    alt="user Profile"
                    className={Styles.profileImage}
                  />
                ) : (
                  <span className={Styles.avatarText}>
                    {profile.user_name?.charAt(0)}
                  </span>
                )}
              </div>
              <div className={Styles.avatarRing}></div>
              <div className={Styles.avatarRing2}></div>
            </div>
          </div>

          <h2 className={Styles.userName}>{profile.user_name}</h2>
          <p className={Styles.userEmail}>{profile.user_email}</p>

          <div className={Styles.userStats}>
            <div className={Styles.statItem}>
              <span className={Styles.statNumber}>24</span>
              <span className={Styles.statLabel}>Properties</span>
            </div>
            <div className={Styles.statDivider}></div>
            <div className={Styles.statItem}>
              <span className={Styles.statNumber}>12</span>
              <span className={Styles.statLabel}>Favorites</span>
            </div>
            <div className={Styles.statDivider}></div>
            <div className={Styles.statItem}>
              <span className={Styles.statNumber}>3</span>
              <span className={Styles.statLabel}>Bookings</span>
            </div>
          </div>

          <button
            className={Styles.editBtn}
            onClick={() => navigate("/User/EditProfile")}
          >
            <span className={Styles.editBtnIcon}>✏️</span>
            <span>Edit Profile</span>
          </button>

          <div className={Styles.memberSince}>
            Member since {new Date().getFullYear() - 1}
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className={Styles.profileContainer}>
          <div className={Styles.headerSection}>
            <div>
              <h2 className={Styles.title}>Profile Information</h2>
              <p className={Styles.subtitle}>
                Manage your personal information and preferences
              </p>
            </div>
            <div className={Styles.headerBadge}>
              <span className={Styles.badgeDot}></span>
              Profile Active
            </div>
          </div>

          <div className={Styles.formSection}>
            <div className={Styles.row}>
              <div className={Styles.field}>
                <label>
                  <span className={Styles.fieldIcon}>👤</span>
                  Full Name
                </label>
                <div className={Styles.inputWrapper}>
                  <input
                    type="text"
                    value={profile.user_name || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className={Styles.field}>
                <label>
                  <span className={Styles.fieldIcon}>📧</span>
                  Email Address
                </label>
                <div className={Styles.inputWrapper}>
                  <input
                    type="email"
                    value={profile.user_email || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className={Styles.row}>
              <div className={Styles.field}>
                <label>
                  <span className={Styles.fieldIcon}>📱</span>
                  Contact Number
                </label>
                <div className={Styles.inputWrapper}>
                  <input
                    type="text"
                    value={profile.user_contact || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className={Styles.field}>
                <label>
                  <span className={Styles.fieldIcon}>🏠</span>
                  Address
                </label>
                <div className={Styles.inputWrapper}>
                  <input
                    type="text"
                    value={profile.user_address || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className={Styles.additionalInfo}>
              <h3>
                <span className={Styles.infoTitleIcon}>📊</span>
                Account Overview
              </h3>

              <div className={Styles.infoGrid}>
                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>🔐</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Account Status</span>
                    <span className={`${Styles.infoCardValue} ${Styles.statusActive}`}>
                      <span className={Styles.statusDot}></span>
                      Active
                    </span>
                  </div>
                </div>

                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>⭐</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Member Tier</span>
                    <span className={Styles.infoCardValue}>Gold Member</span>
                  </div>
                </div>

                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>📅</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Last Login</span>
                    <span className={Styles.infoCardValue}>Today, 10:30 AM</span>
                  </div>
                </div>

                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>✅</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Email Verified</span>
                    <span className={Styles.infoCardValue}>Yes</span>
                  </div>
                </div>

                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>📱</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Phone Verified</span>
                    <span className={Styles.infoCardValue}>Yes</span>
                  </div>
                </div>

                <div className={Styles.infoCard}>
                  <div className={Styles.infoCardIcon}>🎯</div>
                  <div className={Styles.infoCardContent}>
                    <span className={Styles.infoCardLabel}>Profile Completeness</span>
                    <span className={Styles.infoCardValue}>
                      <div className={Styles.progressBar}>
                        <div className={Styles.progressFill} style={{ width: '85%' }}></div>
                      </div>
                      85%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={Styles.recentActivity}>
              <h3>
                <span className={Styles.activityIcon}>⏱️</span>
                Recent Activity
              </h3>

              <div className={Styles.activityList}>
                <div className={Styles.activityItem}>
                  <div className={Styles.activityDot}></div>
                  <div className={Styles.activityContent}>
                    <span className={Styles.activityText}>Viewed 3 properties</span>
                    <span className={Styles.activityTime}>2 hours ago</span>
                  </div>
                </div>

                <div className={Styles.activityItem}>
                  <div className={Styles.activityDot}></div>
                  <div className={Styles.activityContent}>
                    <span className={Styles.activityText}>Added property to favorites</span>
                    <span className={Styles.activityTime}>Yesterday</span>
                  </div>
                </div>

                <div className={Styles.activityItem}>
                  <div className={Styles.activityDot}></div>
                  <div className={Styles.activityContent}>
                    <span className={Styles.activityText}>Profile information updated</span>
                    <span className={Styles.activityTime}>3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;