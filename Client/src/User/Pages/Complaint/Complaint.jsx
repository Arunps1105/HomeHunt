import React, { useState, useEffect } from "react";
import styles from "./Complaint.module.css";
import axios from "axios";

const Complaint = () => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [complaints, setComplaints] = useState([]);

  const userId = sessionStorage.getItem("uid");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/Complaint/?user_id=${userId}`
      );
      setComplaints(res.data.data);
    } catch (error) {
      console.error("Error fetching complaints", error);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !details) {
      alert("Please fill all fields");
      return;
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("complaint_title", title);
    formData.append("complaint_details", details);
    formData.append("complaint_reply", "Not replied");
    formData.append("complaint_status", "Pending");

    try {
      await axios.post("http://127.0.0.1:8000/Complaint/", formData);
      alert("Complaint submitted successfully");
      setTitle("");
      setDetails("");
      fetchComplaints();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Backend error – check Django console");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDetails("");
  };

  return (
    <div className={styles.pageContainer}>
      {/* Decorations */}
      <div className={styles.decorationDot} style={{ top: "15%", left: "8%" }} />
      <div className={styles.decorationDot} style={{ top: "75%", right: "12%" }} />
      <div className={styles.decorationDot} style={{ bottom: "20%", left: "25%" }} />

      <div className={styles.mainContent}>
        {/* WIDTH CONTROLLER (NEW – IMPORTANT) */}
        <div className={styles.contentWrapper}>

          {/* ===== CREATE COMPLAINT CARD ===== */}
          <div className={styles.createComplaintCard}>
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Raise a Complaint</h2>
                <p className={styles.cardSubtitle}>
                  Let us know about your concerns and we'll address them promptly
                </p>
              </div>

              <form onSubmit={handleSubmit} className={styles.createForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Complaint Title</label>
                  <input
                    type="text"
                    placeholder=" Security concern..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Complaint Details</label>
                  <textarea
                    placeholder="Please describe your complaint in detail..."
                    rows="4"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className={styles.formTextarea}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.submitBtn}>
                    <span>Submit Complaint</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={handleCancel}
                  >
                    <span>Clear</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* ===== COMPLAINT TABLE CARD ===== */}
          <div className={styles.complaintTableCard}>
            <div className={styles.tableHeader}>
              <h3 className={styles.tableTitle}>My Complaint History</h3>
              <span className={styles.countBadge}>
                {complaints.length} {complaints.length === 1 ? "entry" : "entries"}
              </span>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.complaintTable}>
                <thead>
                  <tr className={styles.tableHeaderRow}>
                    <th className={styles.tableHeaderCell}>#</th>
                    <th className={styles.tableHeaderCell}>Title</th>
                    <th className={styles.tableHeaderCell}>Reply</th>
                    <th className={styles.tableHeaderCell}>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {complaints.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyState}>
                        <p className={styles.emptyText}>No complaints yet</p>
                        <p className={styles.emptySubtext}>
                          Your complaint history will appear here
                        </p>
                      </td>
                    </tr>
                  ) : (
                    complaints.map((c, index) => (
                      <tr key={c.id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <span className={styles.rowNumber}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>
                        <td className={styles.tableCell}>
                          {c.complaint_title}
                        </td>
                        <td className={styles.tableCell}>
                          {c.complaint_reply === "Not replied"
                            ? "⏳ Awaiting reply"
                            : c.complaint_reply}
                        </td>
                        <td className={styles.tableCell}>
                          <span
                            className={
                              c.complaint_status === "Pending"
                                ? styles.statusPending
                                : styles.statusCompleted
                            }
                          >
                            {c.complaint_status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Complaint;
