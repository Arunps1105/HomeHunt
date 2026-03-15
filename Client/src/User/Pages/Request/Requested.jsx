import React, { useState, useEffect } from "react";
import Styles from "./Requested.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Requested = () => {

  const [requestText, setRequestText] = useState("");
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();

  const userId = sessionStorage.getItem("uid");
  const houseId = sessionStorage.getItem("house_id");

  const handlePayment = (req) => {
    sessionStorage.setItem("request_id", req.id);
    sessionStorage.setItem("advance_amount", req.amount);
    navigate(`/User/Payment/${req.id}`);
  };
  const handleChat = (req) => {
    sessionStorage.setItem("request_id", req.id);
    sessionStorage.setItem("house_id", houseId);
    navigate(`/User/Chat/${req.id}`);
  };

  /* ================= FETCH REQUEST HISTORY ================= */
  useEffect(() => {
    fetchRequests();
  }, []);
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/Requested/?user_id=${userId}&house_id=${houseId}`
      );


      const data = res.data.data.map((item) => ({
        id: item.id,
        message: item.requested_details,
        reply: item.requested_reply,
        status: item.requested_status,
        amount: item.requested_amount,
        payment: item.advance_status,
        date: item.requested_date
          ? item.requested_date.split("T")[0]
          : "-"
      }));

      setRequests(data.reverse());
    } catch (err) {
      console.error("Error loading requests", err);
    }
  };


  /* ================= SEND REQUEST ================= */
  const handleSend = async () => {
    if (!requestText.trim()) {
      alert("Please enter your request message");
      return;
    }

    if (!userId || !houseId) {
      alert("User or House not found");
      return;
    }

    const formData = new FormData();
    formData.append("requested_details", requestText);
    formData.append("requested_reply", "");
    formData.append("requested_status", "Pending");
    formData.append("user_id", userId);
    formData.append("house_id", houseId);
    formData.append("requested_amount", "0");

    try {
      await axios.post("http://127.0.0.1:8000/Requested/", formData);
      alert("Request sent successfully");
      setRequestText("");
      fetchRequests();
    } catch (error) {
      alert("Failed to send request. Please try again.");
    }
  };

  return (
    <div className={Styles.page}>
      <div className={Styles.container}>

        {/* ================= HEADER ================= */}
        <div className={Styles.header}>
          <h2>Request</h2>
          <p>Send your request and track its status</p>
        </div>

        {/* ================= GLASS CARD ================= */}
        <div className={Styles.card}>
          <div className={Styles.field}>
            <label className={Styles.label}>Your Request</label>
            <textarea
              className={Styles.textarea}
              placeholder="Enter request..."
              rows="4"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
            />
          </div>

          <div className={Styles.sendRow}>
            <button className={Styles.sendBtn} onClick={handleSend}>
              Send Request
            </button>
          </div>

          <div className={Styles.statusBox}>
            <span className={Styles.statusLabel}>Latest Status</span>
            <span
              className={`${Styles.statusBadge} ${requests[0]?.status === "Approved"
                ? Styles.approved
                : requests[0]?.status === "Rejected"
                  ? Styles.rejected
                  : Styles.pending
                }`}
            >
              {requests[0]?.status || "Pending"}
            </span>
          </div>
        </div>

        {/* ================= REQUEST HISTORY TABLE ================= */}
        <div className={Styles.tableCard}>
          <h3 className={Styles.tableTitle}>Request History</h3>

          <table className={Styles.table}>
            <thead>
              <tr>
                <th>Message</th>
                <th>Owner Reply</th>
                <th>Advance Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Chat</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="7" className={Styles.empty}>
                    No requests sent yet
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id}>
                    <td className={Styles.messageCell}>
                      <p className={Styles.clampText}>{req.message}</p>
                    </td>

                    <td className={Styles.messageCell}>
                      {req.reply ? (
                        <p className={Styles.clampText}>{req.reply}</p>
                      ) : (
                        <span style={{ color: "#999" }}>Waiting for reply</span>
                      )}
                    </td>

                    {/* 💰 ADVANCE AMOUNT */}
                    <td>
                      {req.amount && req.amount !== "0" ? `₹ ${req.amount}` : "Not Set"}
                    </td>

                    {/* 💳 PAYMENT */}
                    <td>
                      {req.status === "Approved" && req.payment === "Not Paid" ? (
                        <button
                          className={Styles.payBtn}
                          onClick={() => handlePayment(req)}
                        >
                          Pay Now
                        </button>
                      ) : req.payment === "Paid" ? (
                        <span style={{ color: "green" }}>Paid</span>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>
                      <span
                        className={`${Styles.statusBadge} ${req.status === "Approved"
                          ? Styles.approved
                          : req.status === "Rejected"
                            ? Styles.rejected
                            : Styles.pending
                          }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={Styles.chatBtn}
                        onClick={() => handleChat(req)}
                      >
                        Chat
                      </button>
                    </td>

                    <td className={Styles.dateCell}>{req.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Requested;
