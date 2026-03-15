import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Viewcomplaint.module.css";

const ViewComplaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [replyText, setReplyText] = useState({});

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/Complaint/");
      setComplaints(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const submitReply = async (id) => {
    if (!replyText[id]) return alert("Enter reply");

    try {
      await axios.post(`http://127.0.0.1:8000/ComplaintReply/${id}/`, {
        complaint_reply: replyText[id],
      });
      setReplyText({});
      fetchComplaints();
    } catch (err) {
      alert("Reply failed");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Complaints</h2>
          <p>Manage and respond to user complaints</p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Details</th>
                <th>Reply</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>

                  <td className={styles.title}>{c.complaint_title}</td>

                  <td className={styles.details}>{c.complaint_details}</td>

                  <td>
                    {c.complaint_status === "Completed" ? (
                      <span className={styles.replyText}>
                        {c.complaint_reply}
                      </span>
                    ) : (
                      <textarea
                        className={styles.replyBox}
                        placeholder="Type reply..."
                        value={replyText[c.id] || ""}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [c.id]: e.target.value })
                        }
                      />
                    )}
                  </td>

                  <td>
                    <span
                      className={`${styles.status} ${c.complaint_status === "Pending"
                          ? styles.pending
                          : styles.completed
                        }`}
                    >
                      {c.complaint_status}
                    </span>
                  </td>

                  <td>
                    {c.complaint_status === "Pending" && (
                      <button
                        className={styles.btn}
                        onClick={() => submitReply(c.id)}
                      >
                        Submit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewComplaint;
