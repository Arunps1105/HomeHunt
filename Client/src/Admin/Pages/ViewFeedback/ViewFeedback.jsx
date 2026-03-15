import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Viewfeedback.module.css";

const AdminViewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch ALL feedback (ADMIN)
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/Feedback/");
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Error loading feedback", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className={styles.feedbackContainer}>
      <h2> User Feedbacks</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sl No</th>
            <th>User </th>
            <th>Feedback</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.length === 0 ? (
            <tr>
              <td colSpan="3">No feedback found</td>
            </tr>
          ) : (
            feedbacks.map((f, index) => (
              <tr key={f.id}>
                <td>{index + 1}</td>
                <td>{f.user_id__user_name}</td>
                <td>{f.feedback_details}</td>
              </tr>
            ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default AdminViewFeedback;
