import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Ownerreq.module.css";

const STATUS_CONFIG = {
  Pending: { icon: "⏳", color: "amber", label: "Awaiting Review" },
  Approved: { icon: "✦", color: "emerald", label: "Approved" },
  Rejected: { icon: "✕", color: "rose", label: "Declined" },
};

const OwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [replies, setReplies] = useState({});
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const ownerId = sessionStorage.getItem("oid");
      const res = await axios.get(`http://127.0.0.1:8000/Requested/?owner_id=${ownerId}`);
      setRequests(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateRequest = async (id, status) => {
    if (!replies[id]?.trim()) { alert("Please enter a reply message"); return; }
    if (status === "Approved" && !amounts[id]) { alert("Please enter advance amount"); return; }
    try {
      await axios.post(`http://127.0.0.1:8000/OwnerRequestUpdate/${id}/`, {
        requested_status: status,
        requested_reply: replies[id],
        requested_amount: amounts[id] || 0,
      });
      setReplies(p => ({ ...p, [id]: "" }));
      setAmounts(p => ({ ...p, [id]: "" }));
      fetchRequests();
    } catch { alert("Update failed"); }
  };

  const sorted = () => {
    let list = [...requests];
    if (filterBy !== "all") list = list.filter(r => r.requested_status === filterBy);
    list.sort((a, b) =>
      sortBy === "newest" ? b.id - a.id :
        sortBy === "oldest" ? a.id - b.id :
          (a.user_id__user_name ?? "").localeCompare(b.user_id__user_name ?? "")
    );
    return list;
  };

  const count = s => requests.filter(r => r.requested_status === s).length;

  return (
    <div className={styles.page}>

      {/* ── HERO ── */}
      <div className={styles.hero}>
        <div className={styles.heroGlow1}></div>
        <div className={styles.heroGlow2}></div>
        <div className={styles.heroGlow3}></div>

        <div className={styles.heroLeft}>
          <div className={styles.heroPill}>
            <span className={styles.heroPillDot}></span>
            Property Dashboard
          </div>
          <h1 className={styles.heroTitle}>
            Tenant <span className={styles.heroAccent}>Requests</span>
          </h1>
          <p className={styles.heroDesc}>
            Review and manage all incoming booking requests for your properties with ease.
          </p>
        </div>

        <div className={styles.heroStats}>
          {[
            { num: requests.length, label: "Total", color: "#a78bfa" },
            { num: count("Pending"), label: "Pending", color: "#fbbf24" },
            { num: count("Approved"), label: "Approved", color: "#34d399" },
            { num: count("Rejected"), label: "Rejected", color: "#f87171" },
          ].map(s => (
            <div key={s.label} className={styles.heroStat}>
              <span className={styles.heroStatNum} style={{ color: s.color }}>{s.num}</span>
              <span className={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY CONTROLS ── */}
      <div className={styles.controls}>
        <div className={styles.pills}>
          {["all", "Pending", "Approved", "Rejected"].map(t => (
            <button
              key={t}
              onClick={() => setFilterBy(t)}
              className={`${styles.pill} ${filterBy === t ? styles.pillOn : ""} ${styles["pill_" + t]}`}
            >
              {t === "all" ? "All Requests" : t}
              {t !== "all" && <em>{count(t)}</em>}
            </button>
          ))}
        </div>
        <select className={styles.sort} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* ── LIST ── */}
      <div className={styles.body}>
        {loading ? (
          <div className={styles.loader}>
            <div className={styles.spin}></div>
            <p>Loading requests…</p>
          </div>
        ) : sorted().length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyCircle}>🏠</div>
            <h3>No requests found</h3>
            <p>Tenant booking requests will show up here</p>
          </div>
        ) : (
          sorted().map((req, i) => {
            const cfg = STATUS_CONFIG[req.requested_status] || STATUS_CONFIG.Pending;
            return (
              <div key={req.id} className={`${styles.card} ${styles["card_" + cfg.color]}`} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={styles.cardUpper}>

                  {/* LEFT IMAGE */}
                  <div className={styles.imgWrap}>
                    <img
                      className={styles.houseImg}
                      src={`http://127.0.0.1:8000/${req.house_id__house_photo}`}
                      alt="House"
                    />
                    <div className={styles.imgOverlay}>
                      <span className={styles.priceTag}>
                        ₹{Number(req.house_id__house_price).toLocaleString()}
                        <small>/mo</small>
                      </span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className={styles.cardContent}>

                    {/* ROW 1 */}
                    <div className={styles.row1}>
                      <div className={styles.tenantInfo}>
                        <img
                          className={styles.avatar}
                          src={req.user_id__user_photo
                            ? `http://127.0.0.1:8000/${req.user_id__user_photo}`
                            : `https://api.dicebear.com/7.x/initials/svg?seed=${req.user_id__user_name}&backgroundColor=6366f1&fontColor=ffffff`}
                          alt="Tenant"
                        />
                        <div>
                          <span className={styles.tenantName}>{req.user_id__user_name}</span>
                          <span className={styles.tenantSub}>
                            {req.user_id__user_contact} &middot; {req.user_id__tententtype__tenanttype_name}
                          </span>
                        </div>
                      </div>
                      <div className={styles.row1Right}>
                        <span className={`${styles.statusBadge} ${styles["badge_" + cfg.color]}`}>
                          {cfg.icon} {req.requested_status}
                        </span>
                        <span className={styles.reqId}>#{String(req.id).padStart(4, "0")}</span>
                      </div>
                    </div>

                    {/* HOUSE DESC */}
                    <p className={styles.houseDesc}>
                      {req.house_id__house_details?.slice(0, 100)}…
                    </p>

                    {/* MESSAGE */}
                    <div className={styles.msgBox}>
                      <span className={styles.msgIcon}>"</span>
                      <p className={styles.msgText}>{req.requested_details}</p>
                    </div>

                  </div>{/* end cardUpper */}

                  {/* BOTTOM BAR */}
                  <div className={styles.bottomBar}>

                    {/* Advance */}
                    <div className={styles.advBox}>
                      <label className={styles.advLabel}>Advance Amount</label>
                      {req.requested_status === "Pending" ? (
                        <div className={styles.advInputRow}>
                          <span className={styles.advRupee}>₹</span>
                          <input
                            type="number"
                            className={styles.advInput}
                            placeholder="Enter amount"
                            value={amounts[req.id] || ""}
                            onChange={e => setAmounts({ ...amounts, [req.id]: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div className={styles.advPaid}>
                          <span className={styles.advAmt}>₹{Number(req.requested_amount).toLocaleString()}</span>
                          <span className={`${styles.payBadge} ${req.advance_status === "Paid" ? styles.paid : styles.unpaid}`}>
                            {req.advance_status}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Proof */}
                    {req.user_id__user_proof && (
                      <a
                        href={`http://127.0.0.1:8000/${req.user_id__user_proof}`}
                        target="_blank" rel="noreferrer"
                        className={styles.proofLink}
                      >
                        📄 ID Proof
                      </a>
                    )}

                    {/* Reply + Buttons */}
                    <div className={styles.replySection}>
                      {req.requested_status === "Pending" ? (
                        <>
                          <textarea
                            className={styles.replyArea}
                            rows={2}
                            placeholder="Write your reply…"
                            value={replies[req.id] || ""}
                            onChange={e => setReplies({ ...replies, [req.id]: e.target.value })}
                          />
                          <div className={styles.btnRow}>
                            <button className={styles.btnApprove} onClick={() => updateRequest(req.id, "Approved")}>
                              ✓ Approve
                            </button>
                            <button className={styles.btnReject} onClick={() => updateRequest(req.id, "Rejected")}>
                              ✕ Decline
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className={styles.replyDone}>
                          <span className={styles.replyDoneLabel}>Reply sent</span>
                          <p className={styles.replyDoneText}>"{req.requested_reply}"</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OwnerRequests;
