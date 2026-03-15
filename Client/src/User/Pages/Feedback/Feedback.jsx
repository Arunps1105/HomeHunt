import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Feedback.module.css";

const Feedback = () => {
  const [content, setContent] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  const userId = sessionStorage.getItem("uid");

  // 🔹 Fetch feedbacks (USER ONLY – backend filtered)
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/Feedback/?user_id=${userId}`
      );
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Error fetching feedbacks", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFeedbacks();
    }
  }, [userId]);

  // 🔹 Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Please enter feedback");
      return;
    }

    if (!userId) {
      alert("User not logged in");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("feedback_details", content);

    try {
      await axios.post("http://127.0.0.1:8000/Feedback/", formData);
      alert("Feedback sent successfully");
      setContent("");
      fetchFeedbacks();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Error sending feedback");
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Minimal decorative dots */}
      <div className={styles.decorationDot} style={{ top: '15%', left: '8%' }}></div>
      <div className={styles.decorationDot} style={{ top: '75%', right: '12%' }}></div>
      <div className={styles.decorationDot} style={{ bottom: '20%', left: '25%' }}></div>

      <div className={styles.mainContent}>
        {/* ===== CREATE FEEDBACK CARD ===== */}
        <div className={styles.createFeedbackCard}>
          <div className={styles.cardContent}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Send Feedback</h2>
              <p className={styles.cardSubtitle}>
                Help us improve by sharing your thoughts and suggestions
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.createForm}>
              <div className={styles.feedbackInput}>
                <textarea
                  rows="4"
                  placeholder="Write your feedback here... "
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={styles.feedbackTextarea}
                ></textarea>
              </div>

              <div className={styles.buttonWrapper}>
                <button type="submit" className={styles.saveButton}>
                  <span>Submit Feedback</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== FEEDBACK TABLE CARD ===== */}
        <div className={styles.feedbackTableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>My Feedback History</h3>
            <span className={styles.countBadge}>
              <span>{feedbacks.length} entries</span>
            </span>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.feedbackTable}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHeaderCell}>#</th>
                  <th className={styles.tableHeaderCell}>Feedback</th>
                </tr>
              </thead>

              <tbody>
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="2" className={styles.emptyState}>
                      <div className={styles.emptyIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <circle cx="12" cy="16" r="1"></circle>
                        </svg>
                      </div>
                      <p className={styles.emptyText}>No feedback yet</p>
                      <p className={styles.emptySubtext}>Be the first to share your thoughts</p>
                    </td>
                  </tr>
                ) : (
                  feedbacks.map((f, index) => (
                    <tr key={f.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.feedbackContent}>
                          {f.feedback_details}
                        </div>
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
  );
};

export default Feedback;