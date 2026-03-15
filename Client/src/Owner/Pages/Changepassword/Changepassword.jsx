import React, { useState } from 'react';
import axios from 'axios';
import styles from "./Changepassword.module.css";
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const nav = useNavigate();
  const oid = sessionStorage.getItem('oid');

  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confPwd, setConfPwd] = useState('');

  const handleChange = () => {

    if (!oldPwd || !newPwd || !confPwd) {
      alert("All fields are required");
      return;
    }

    if (newPwd.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }

    if (oldPwd === newPwd) {
      alert("New password must be different from current password");
      return;
    }

    if (newPwd !== confPwd) {
      alert("New passwords do not match");
      return;
    }

    axios.put(`http://127.0.0.1:8000/Ownerpassword/${oid}/`,
      { old_password: oldPwd, new_password: newPwd })
      .then(res => {
        alert(res.data.message);
        setOldPwd('');
        setNewPwd('');
        setConfPwd('');
      })
      .catch(() => alert('Update failed'));
  };
  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.watermark}>🔒</div>
          <div className={styles.icon}>🔒</div>
          <div>
            <h2>Change Password</h2>
            <p>Keep your account secure</p>
          </div>
        </div>


        <div className={styles.field}>
          <label>Current Password</label>
          <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>New Password</label>
          <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confPwd}
            onChange={e => setConfPwd(e.target.value)}
          />

        </div>

        <div className={styles.actions}>
          <button
            onClick={handleChange}
            className={styles.saveBtn}
            disabled={!oldPwd || !newPwd || !confPwd}
          >
            Update Password
          </button>
          <button type="reset" className={styles.cancelBtn}>
            Cancel
          </button>
        </div>


      </div>
    </div>
  )
}

export default ChangePassword
