import React, { useEffect, useState } from "react";
import styles from "./EditProfile.module.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const nav = useNavigate();
  const oid = sessionStorage.getItem('oid');
  if (!oid) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/OwnerProfile/${oid}/`)
      .then(res => {
        if (res.data.data && res.data.data.length > 0) {
          const u = res.data.data[0];
          setName(u.owner_name);
          setEmail(u.owner_email);
          setPhone(u.owner_contact);
          setAddress(u.owner_address);
        }
      })
      .catch(err => console.error(err));
  }, [oid]);

  const handleSave = () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("owner_name", name);
    fd.append("owner_email", email);
    fd.append("owner_contact", phone);
    fd.append("owner_address", address);
    axios.post(`http://127.0.0.1:8000/OwnerUpdate/${oid}/`, fd)
      .then(() => { setSaving(false); setSaved(true); })
      .catch(err => { console.error(err); setSaving(false); alert("Update failed"); });
  };

  return (
    <div className={styles.container}>

      {/* ══ PROFILE HERO CARD ══ */}
      <div className={styles.heroCard}>

        {/* gradient banner */}
        <div className={styles.heroBanner}>
          <div className={styles.bannerCircle} />
          <div className={styles.bannerCircle2} />
        </div>

        {/* bottom section: avatar + info + stats */}
        <div className={styles.heroBottom}>

          {/* avatar */}
          <div className={styles.avatarWrap}>
            <div className={styles.avatarPulse} />
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>🏠</div>
            </div>
          </div>

          {/* info */}
          <div className={styles.heroInfo}>
            <h1>Edit <em>Profile</em></h1>
            <p>Manage your personal information &amp; keep details up to date</p>
            <div className={styles.badges}>
              <span className={`${styles.pill} ${styles.pillGreen}`}>
                <span className={styles.pillDot} /> Active Owner
              </span>
              <span className={`${styles.pill} ${styles.pillBlue}`}>
                ⭐ Verified
              </span>
              <span className={`${styles.pill} ${styles.pillAmber}`}>
                🔒 Secured
              </span>
            </div>
          </div>

          {/* stats */}
          <div className={styles.heroStats}>
            <div className={styles.statChip}>
              <strong>3</strong>
              <span>Properties</span>
            </div>
            <div className={styles.statChip}>
              <strong>Active</strong>
              <span>Status</span>
            </div>
            <div className={styles.statChip}>
              <strong>✓</strong>
              <span>Verified</span>
            </div>
          </div>

        </div>
      </div>

      {/* ══ FORM CARD ══ */}
      <div className={styles.formCard}>
        <div className={styles.formInner}>

          <div className={styles.sHead}>
            <div className={styles.sHeadTitle}>
              <h2>Personal Information</h2>
              <p>Fill all required fields to update your profile</p>
            </div>
            <div className={styles.editBadge}>✏️ Edit Mode</div>
          </div>

          <div className={styles.grid}>

            {/* Full Name */}
            <div className={styles.field}>
              <label><span className={styles.lbar} />Full Name</label>
              <div className={styles.inputBox}>
                <span className={styles.inputIcon}>👤</span>
                <input
                  value={name}
                  onChange={e => { setName(e.target.value); setSaved(false); }}
                  placeholder="Your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.field}>
              <label><span className={styles.lbar} />Email Address</label>
              <div className={styles.inputBox}>
                <span className={styles.inputIcon}>✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setSaved(false); }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div className={styles.field}>
              <label><span className={styles.lbar} />Mobile Number</label>
              <div className={styles.inputBox}>
                <span className={styles.inputIcon}>📱</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setSaved(false); }}
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>

            {/* Address */}
            <div className={styles.field}>
              <label><span className={styles.lbar} />Address</label>
              <div className={styles.inputBox}>
                <span className={styles.inputIcon}>📍</span>
                <input
                  value={address}
                  onChange={e => { setAddress(e.target.value); setSaved(false); }}
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* divider */}
            <div className={styles.divider}>
              <hr /><span>ready to save</span><hr />
            </div>

            {/* actions */}
            <div className={styles.actions}>
              <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                <span className={styles.btnInner}>
                  {saving ? '⏳ Saving…' : saved ? '✅ Saved!' : '💾 Save Changes'}
                </span>
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => nav("/Owner/MyProfile")}
              >
                Cancel
              </button>
            </div>

            {/* foot */}
            <div className={styles.foot}>🔒 Your data is encrypted and secure</div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default EditProfile;
