import React, { useState } from 'react';
import axios from 'axios';
import styles from "./Changepassword.module.css";
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const nav = useNavigate();
  const uid = sessionStorage.getItem('uid');

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

    if (newPwd !== confPwd) {
      alert("New passwords do not match");
      return;
    }

    axios.put(`http://127.0.0.1:8000/Userpassword/${uid}/`, {
      old_password: oldPwd,
      new_password: newPwd
    })
      .then(res => {
        alert(res.data.message);
        setOldPwd('');
        setNewPwd('');
        setConfPwd('');
      })
      .catch(() => alert('Update failed'));
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleChange(); }}>
      <div className={styles.container}>
        <div className={styles.card}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.icon}>🔒</div>
            <div>
              <h2>Change Password</h2>
              <p>Keep your account secure</p>
            </div>
          </div>


          <div className={styles.field}>
            <label>Current Password</label>
            <input
              type="password"
              required
              value={oldPwd}
              onChange={e => setOldPwd(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>New Password</label>
            <input
              type="password"
              required
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confPwd}
              required
              onChange={e => setConfPwd(e.target.value)}
            />    </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              Update Password
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => nav(-1)}
            >
              Cancel
            </button>
          </div>


        </div>
      </div>
    </form>
  )
}

export default ChangePassword