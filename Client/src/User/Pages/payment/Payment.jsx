import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";

const fmtCard = (v) => {
  const d = v.replace(/\D/g, "").slice(0, 16);
  return d.replace(/(.{4})/g, "$1 ").trim();
};
const fmtExp = (v) => {
  const d = v.replace(/\D/g, "");
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2, 4)}` : v;
};
const checkExp = (e) => {
  if (!e || e.length < 5) return "Invalid expiry";
  const [m, y] = e.split("/");
  if (!m || !y || m.length !== 2 || y.length !== 2) return "Use MM/YY";
  const mn = +m, yn = +y, cy = new Date().getFullYear() % 100, cm = new Date().getMonth() + 1;
  if (mn < 1 || mn > 12) return "Invalid month";
  if (yn < cy || (yn === cy && mn < cm)) return "Card expired";
  return "";
};

/* ── UPI LOGOS ── */
const GPay = () => (
  <svg width="40" height="40" viewBox="0 0 48 48">
    <path d="M43.6 20.1H24v7.8h11.1c-.5 2.6-2 4.8-4.2 6.2v5.1h6.8c4-3.7 6.3-9.2 5.9-19.1z" fill="#4285F4" />
    <path d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.5-5c-1.8 1.2-4.1 1.9-6.7 1.9-5.2 0-9.6-3.5-11.1-8.2H6.3v5.2C9.5 39.7 16.3 44 24 44z" fill="#34A853" />
    <path d="M12.9 27.9c-.4-1.2-.6-2.5-.6-3.9s.2-2.7.6-3.9v-5.2H6.3C4.9 17.7 4 20.7 4 24s.9 6.3 2.3 9.1l6.6-5.2z" fill="#FBBC05" />
    <path d="M24 11.9c2.9 0 5.5 1 7.6 3l5.7-5.7C33.9 5.9 29.3 4 24 4c-7.7 0-14.5 4.3-17.7 10.9l6.6 5.2C14.4 15.4 18.8 11.9 24 11.9z" fill="#EA4335" />
  </svg>
);
const PhonePe = () => (
  <svg width="40" height="40" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="12" fill="#5F259F" />
    <path d="M14 34V18c0-2.2 1.8-4 4-4h8c4.4 0 8 3.6 8 8s-3.6 8-8 8h-5v4H14zm7-10h5c2.2 0 4-1.8 4-4s-1.8-4-4-4h-5v8z" fill="white" />
  </svg>
);
const Paytm = () => (
  <svg width="40" height="40" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="12" fill="#00BAF2" />
    <rect x="8" y="8" width="16" height="16" rx="2" fill="white" />
    <rect x="26" y="8" width="14" height="7" rx="2" fill="white" />
    <rect x="26" y="17" width="14" height="7" rx="2" fill="#00BAF2" />
    <rect x="8" y="26" width="32" height="14" rx="2" fill="white" />
    <text x="24" y="36" textAnchor="middle" fill="#00BAF2" fontSize="7" fontWeight="800" fontFamily="Arial">paytm</text>
  </svg>
);
const BHIM = () => (
  <svg width="40" height="40" viewBox="0 0 48 48">
    <rect width="48" height="48" rx="12" fill="#00529B" />
    <text x="24" y="22" textAnchor="middle" fill="white" fontSize="9" fontWeight="800" fontFamily="Arial">BHIM</text>
    <text x="24" y="34" textAnchor="middle" fill="#FF9800" fontSize="8" fontWeight="700" fontFamily="Arial">UPI</text>
  </svg>
);

const APPS = [
  { name: "Google Pay", short: "GPay", Logo: GPay, suffix: "okaxis" },
  { name: "PhonePe", short: "PhonePe", Logo: PhonePe, suffix: "ybl" },
  { name: "Paytm", short: "Paytm", Logo: Paytm, suffix: "paytm" },
  { name: "BHIM", short: "BHIM", Logo: BHIM, suffix: "upi" },
];

/* ════════════════════════════════════ */
export default function PaymentGateway() {
  const { id } = useParams();
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  const [tab, setTab] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [upiErr, setUpiErr] = useState("");
  const [selApp, setSelApp] = useState(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errs, setErrs] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [touched, setTouched] = useState({ number: false, name: false, expiry: false, cvv: false });
  const [flipped, setFlipped] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confetti, setConfetti] = useState(false);

  const wrapRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const okRef = useRef(null);

  useEffect(() => {
    gsap.from(wrapRef.current, { opacity: 0, y: 32, duration: 0.65, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (flipped) {
      gsap.to(frontRef.current, { rotationY: 180, duration: 0.55 });
      gsap.to(backRef.current, { rotationY: 0, duration: 0.55 });
    } else {
      gsap.to(frontRef.current, { rotationY: 0, duration: 0.55 });
      gsap.to(backRef.current, { rotationY: -180, duration: 0.55 });
    }
  }, [flipped]);

  const checkUpi = (v) => {
    if (!v.trim()) return "Enter your UPI ID";
    if (!/^[\w.\-_]{2,}@[a-zA-Z]{2,}$/.test(v)) return "Invalid UPI ID (e.g. name@okaxis)";
    return "";
  };

  const handleCard = (e) => {
    const { name, value } = e.target;
    setTouched(p => ({ ...p, [name]: true }));
    if (name === "number") {
      const f = fmtCard(value);
      setCard(p => ({ ...p, number: f }));
      setErrs(p => ({ ...p, number: f.replace(/\s/g, "").length < 16 ? "16 digits required" : "" }));
    } else if (name === "expiry") {
      const f = fmtExp(value);
      setCard(p => ({ ...p, expiry: f }));
      setErrs(p => ({ ...p, expiry: checkExp(f) }));
    } else if (name === "cvv") {
      if (value.length > 3) return;
      setCard(p => ({ ...p, cvv: value }));
      setErrs(p => ({ ...p, cvv: value.length < 3 ? "3 digits required" : "" }));
    } else {
      setCard(p => ({ ...p, name: value }));
      setErrs(p => ({ ...p, name: !value.trim() ? "Required" : !/^[a-zA-Z\s]+$/.test(value) ? "Letters only" : "" }));
    }
  };

  const validateCard = () => {
    const e = { number: "", name: "", expiry: "", cvv: "" };
    const c = card.number.replace(/\s/g, "");
    if (!c) e.number = "Required"; else if (c.length < 16) e.number = "16 digits required";
    if (!card.name.trim()) e.name = "Required"; else if (!/^[a-zA-Z\s]+$/.test(card.name)) e.name = "Letters only";
    const ex = checkExp(card.expiry); if (ex) e.expiry = ex;
    if (!card.cvv) e.cvv = "Required"; else if (card.cvv.length < 3) e.cvv = "3 digits";
    setErrs(e);
    return !Object.values(e).some(Boolean);
  };

  const pay = async () => {
    if (tab === "upi") {
      const e = checkUpi(upiId); if (e) { setUpiErr(e); return; }
    } else {
      setTouched({ number: true, name: true, expiry: true, cvv: true });
      if (!validateCard()) return;
    }
    setPaying(true);
    try {
      await axios.post(`http://127.0.0.1:8000/AdvancePaymentUpdate/${id}/`);
      await new Promise(r => setTimeout(r, 1800));
      setSuccess(true); setConfetti(true); setPaying(false);
      gsap.from(okRef.current, { opacity: 0, scale: 0.6, duration: 0.85, ease: "elastic.out(1,0.5)" });
      setTimeout(() => navigate("/user/requested"), 3500);
    } catch {
      setPaying(false);
      Swal.fire({ title: "Payment Failed", text: "Please try again", icon: "error", confirmButtonColor: "#16a34a" });
    }
  };

  /* SUCCESS */
  if (success) return (
    <>
      <style>{css}</style>
      {confetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={700} gravity={0.13} colors={["#16a34a", "#22c55e", "#4ade80", "#bbf7d0", "#fbbf24", "#34d399"]} />}
      <div className="pg-page" style={{ alignItems: "center", justifyContent: "center" }}>
        <div className="pg-ok-card" ref={okRef}>
          <div className="pg-ok-ring">
            <svg width="88" height="88" viewBox="0 0 88 88">
              <circle cx="44" cy="44" r="40" fill="#f0fdf4" stroke="#16a34a" strokeWidth="3" />
              <path d="M26 44l14 14 22-22" fill="none" stroke="#16a34a" strokeWidth="4.5"
                strokeLinecap="round" strokeLinejoin="round" className="pg-check" />
            </svg>
          </div>
          <h2 className="pg-ok-title">Payment Successful!</h2>
          <p className="pg-ok-sub">REQ-{String(id).padStart(4, "0")} advance received.</p>
          <p className="pg-ok-note">Redirecting you back…</p>
          <div className="pg-bar"><div className="pg-bar-fill" /></div>
        </div>
      </div>
    </>
  );

  /* MAIN */
  return (
    <>
      <style>{css}</style>
      <div className="pg-page" ref={wrapRef}>

        {/* ══ LEFT ══ */}
        <div className="pg-left">
          <div className="pg-l-top">
            <div className="pg-logo-wrap">
              <span className="pg-logo-icon">🏠</span>
            </div>
            <h1 className="pg-brand">HomeHunt</h1>
            <p className="pg-tagline">Secure Advance Payment</p>
          </div>

          <div className="pg-amount-box">
            <p className="pg-amt-label">Request</p>
            <p className="pg-amt-id">REQ-{String(id).padStart(4, "0")}</p>
            <div className="pg-amt-divider" />
            <p className="pg-amt-label">Type</p>
            <p className="pg-amt-type">Advance Payment</p>
          </div>

          <div className="pg-features">
            {[
              { i: "🔐", t: "Bank-grade encryption" },
              { i: "⚡", t: "Instant confirmation" },
              { i: "🏦", t: "All UPI apps accepted" },
              { i: "✅", t: "RBI compliant" },
            ].map(x => (
              <div className="pg-feat" key={x.t}>
                <span className="pg-feat-dot" />
                <span className="pg-feat-icon">{x.i}</span>
                <span className="pg-feat-txt">{x.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="pg-right">

          {/* tabs */}
          <div className="pg-tabs">
            {["upi", "card"].map(t => (
              <button key={t} className={`pg-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>
                {t === "upi"
                  ? <><svg width="14" height="14" viewBox="0 0 48 24"><rect width="48" height="24" rx="4" fill={tab === "upi" ? "#16a34a" : "#9ca3af"} /><text x="24" y="17" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Arial">UPI</text></svg> UPI Pay</>
                  : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg> Card</>
                }
              </button>
            ))}
          </div>

          {/* ── UPI ── */}
          {tab === "upi" && (
            <div className="pg-body">
              <p className="pg-body-lbl">Tap to pay instantly</p>

              <div className="pg-apps">
                {APPS.map(({ name, short, Logo, suffix }) => (
                  <button
                    key={name}
                    className={`pg-app${selApp === name ? " picked" : ""}`}
                    onClick={() => { setSelApp(name); setUpiId(`yourname@${suffix}`); setUpiErr(""); }}
                  >
                    <Logo />
                    <span>{short}</span>
                    {selApp === name && (
                      <div className="pg-picked-dot">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 8l4 4 6-6" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pg-sep"><span>or type UPI ID</span></div>

              <label className="pg-lbl">UPI ID</label>
              <div className={`pg-inp-wrap${upiErr ? " err" : upiId && !upiErr ? " ok" : ""}`}>
                <div className="pg-upi-tag">
                  <svg width="32" height="16" viewBox="0 0 48 24"><rect width="48" height="24" rx="4" fill="#15803d" /><text x="24" y="17" textAnchor="middle" fill="white" fontSize="11" fontWeight="800" fontFamily="Arial">UPI</text></svg>
                </div>
                <input className="pg-inp" placeholder="name@okaxis" value={upiId}
                  onChange={e => { setUpiId(e.target.value); setUpiErr(checkUpi(e.target.value)); setSelApp(null); }} />
                {upiId && !upiErr && <div className="pg-tick"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 8l4 4 6-6" /></svg></div>}
              </div>
              {upiErr && <p className="pg-err">⚠ {upiErr}</p>}
              <p className="pg-hint">A payment request will appear on your UPI app</p>
            </div>
          )}

          {/* ── CARD ── */}
          {tab === "card" && (
            <div className="pg-body">
              {/* 3D card */}
              <div className="pg-card3d" onClick={() => setFlipped(!flipped)}>
                <div ref={frontRef} className="pg-cface pg-cf">
                  <div className="pg-ci">
                    <div className="pg-ctop">
                      <div className="pg-chip"><div className="pg-chipl" /></div>
                      <span className="pg-cfhint">tap to flip</span>
                    </div>
                    <p className="pg-cnum">{card.number || "•••• •••• •••• ••••"}</p>
                    <div className="pg-cbot">
                      <div><p className="pg-clbl">Holder</p><p className="pg-cval">{card.name ? card.name.toUpperCase() : "YOUR NAME"}</p></div>
                      <div><p className="pg-clbl">Expires</p><p className="pg-cval">{card.expiry || "••/••"}</p></div>
                    </div>
                  </div>
                </div>
                <div ref={backRef} className="pg-cface pg-cb">
                  <div className="pg-cstripe" />
                  <div className="pg-ccrow">
                    <div className="pg-ccbox"><span style={{ fontFamily: "monospace", letterSpacing: 3 }}>{showCvv ? (card.cvv || "•••") : "•••"}</span></div>
                    <span className="pg-cclbl">CVV</span>
                  </div>
                  <p className="pg-cbnote">For verification only</p>
                </div>
              </div>

              {/* number */}
              <label className="pg-lbl">Card Number</label>
              <div className={`pg-inp-wrap${touched.number && errs.number ? " err" : touched.number && !errs.number && card.number ? " ok" : ""}`}>
                <svg className="pg-inp-ico" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>
                <input className="pg-inp" name="number" placeholder="1234 5678 9012 3456"
                  value={card.number} onChange={handleCard} onBlur={e => setTouched(p => ({ ...p, [e.target.name]: true }))}
                  maxLength={19} style={{ fontFamily: "monospace", letterSpacing: 2 }} />
              </div>
              {touched.number && errs.number && <p className="pg-err">⚠ {errs.number}</p>}

              {/* name */}
              <label className="pg-lbl" style={{ marginTop: 12 }}>Name on Card</label>
              <div className={`pg-inp-wrap${touched.name && errs.name ? " err" : ""}`}>
                <svg className="pg-inp-ico" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input className="pg-inp" name="name" placeholder="John Doe"
                  value={card.name} onChange={handleCard} onBlur={e => setTouched(p => ({ ...p, [e.target.name]: true }))} />
              </div>
              {touched.name && errs.name && <p className="pg-err">⚠ {errs.name}</p>}

              <div className="pg-2col" style={{ marginTop: 12 }}>
                <div>
                  <label className="pg-lbl">Expiry</label>
                  <div className={`pg-inp-wrap${touched.expiry && errs.expiry ? " err" : ""}`}>
                    <svg className="pg-inp-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                    <input className="pg-inp" name="expiry" placeholder="MM/YY"
                      value={card.expiry} onChange={handleCard} onBlur={e => setTouched(p => ({ ...p, [e.target.name]: true }))} maxLength={5} />
                  </div>
                  {touched.expiry && errs.expiry && <p className="pg-err">⚠ {errs.expiry}</p>}
                </div>
                <div>
                  <label className="pg-lbl">CVV</label>
                  <div className={`pg-inp-wrap${touched.cvv && errs.cvv ? " err" : ""}`}>
                    <svg className="pg-inp-ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input className="pg-inp" name="cvv" type={showCvv ? "text" : "password"}
                      placeholder="•••" value={card.cvv} onChange={handleCard}
                      onFocus={() => setFlipped(true)}
                      onBlur={e => { setTouched(p => ({ ...p, [e.target.name]: true })); setFlipped(false); }}
                      maxLength={3} />
                    <button className="pg-eye" type="button" onClick={() => setShowCvv(!showCvv)}>
                      {showCvv
                        ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                        : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      }
                    </button>
                  </div>
                  {touched.cvv && errs.cvv && <p className="pg-err">⚠ {errs.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {/* PAY BTN */}
          <button className={`pg-pay${paying ? " busy" : ""}`} onClick={pay} disabled={paying}>
            {paying
              ? <><span className="pg-spin" /> Processing…</>
              : <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>{tab === "upi" ? "Pay with UPI" : "Pay Securely"}</>
            }
          </button>

          <div className="pg-ssl-row">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>Secured · 256-bit SSL · RBI Compliant</span>
          </div>

        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════
   CSS
══════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Google+Sans:wght@400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

/* PAGE */
.pg-page{
  font-family:'DM Sans',sans-serif;
  min-height:calc(100vh - 50px);
  display:flex;
  margin-left:0;
  margin-top:50px;
  background:#f8fdf9;
}

/* LEFT */
.pg-left{
  width:360px;
  flex-shrink:0;
  background:linear-gradient(160deg,#14532d 0%,#15803d 45%,#16a34a 100%);
  display:flex;
  flex-direction:column;
  padding:52px 40px;
  position:relative;
  overflow:hidden;
}
.pg-left::before{
  content:'';
  position:absolute;
  width:320px;height:320px;
  background:radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 70%);
  top:-80px;right:-80px;
  pointer-events:none;
}
.pg-left::after{
  content:'';
  position:absolute;
  width:200px;height:200px;
  background:radial-gradient(circle,rgba(255,255,255,0.06) 0%,transparent 70%);
  bottom:-40px;left:-40px;
  pointer-events:none;
}

.pg-l-top{margin-bottom:44px}

.pg-logo-wrap{
  width:60px;height:60px;
  background:rgba(255,255,255,0.18);
  border-radius:16px;
  display:grid;place-items:center;
  font-size:28px;
  margin-bottom:18px;
  backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.2);
}

.pg-brand{
  font-size:28px;font-weight:800;
  color:#fff;letter-spacing:-0.3px;
  margin-bottom:6px;
}
.pg-tagline{font-size:14px;color:rgba(255,255,255,0.6);font-weight:400}

.pg-amount-box{
  background:rgba(0,0,0,0.18);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:16px;
  padding:22px 24px;
  margin-bottom:36px;
  backdrop-filter:blur(10px);
}
.pg-amt-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin-bottom:4px}
.pg-amt-id{font-size:22px;font-weight:800;color:#fff;margin-bottom:16px;letter-spacing:0.5px}
.pg-amt-divider{height:1px;background:rgba(255,255,255,0.1);margin-bottom:16px}
.pg-amt-type{font-size:15px;font-weight:600;color:rgba(255,255,255,0.85)}

.pg-features{display:flex;flex-direction:column;gap:16px;margin-bottom:auto}
.pg-feat{display:flex;align-items:center;gap:12px}
.pg-feat-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;flex-shrink:0}
.pg-feat-icon{font-size:16px}
.pg-feat-txt{font-size:13.5px;color:rgba(255,255,255,0.7);font-weight:500}

/* RIGHT */
.pg-right{
  flex:1;
  display:flex;
  flex-direction:column;
  padding:48px 56px;
  overflow-y:auto;
  background:#fff;
}

/* TABS */
.pg-tabs{
  display:flex;gap:6px;
  padding:5px;
  background:#f1f5f9;
  border-radius:14px;
  margin-bottom:32px;
  width:fit-content;
}
.pg-tab{
  display:flex;align-items:center;gap:8px;
  padding:10px 22px;
  border:none;border-radius:10px;
  background:transparent;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  color:#64748b;cursor:pointer;
  transition:all 0.2s;
  white-space:nowrap;
}
.pg-tab.on{
  background:#fff;
  color:#15803d;
  box-shadow:0 1px 6px rgba(0,0,0,0.10);
}

/* BODY */
.pg-body{display:flex;flex-direction:column;flex:1}

.pg-body-lbl{
  font-size:12px;font-weight:700;color:#94a3b8;
  text-transform:uppercase;letter-spacing:1px;
  margin-bottom:16px;
}

/* UPI APPS */
.pg-apps{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:12px;margin-bottom:24px;
}
.pg-app{
  position:relative;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  padding:20px 8px 16px;
  border:2px solid #e2e8f0;
  border-radius:16px;
  background:#fafbfc;
  cursor:pointer;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:700;
  color:#374151;
  transition:all 0.2s;
}
.pg-app:hover{
  border-color:#16a34a;
  background:#f0fdf4;
  transform:translateY(-3px);
  box-shadow:0 8px 20px rgba(22,163,74,0.15);
}
.pg-app.picked{
  border-color:#16a34a;
  background:#f0fdf4;
  box-shadow:0 0 0 4px rgba(22,163,74,0.12);
}
.pg-picked-dot{
  position:absolute;top:8px;right:8px;
  width:20px;height:20px;
  background:#16a34a;border-radius:50%;
  display:grid;place-items:center;
}

/* SEPARATOR */
.pg-sep{
  display:flex;align-items:center;gap:12px;
  margin:4px 0 18px;font-size:12.5px;
}
.pg-sep::before,.pg-sep::after{content:'';flex:1;height:1px;background:#e2e8f0}
.pg-sep span{color:#94a3b8;font-weight:500;white-space:nowrap}

/* INPUT */
.pg-lbl{font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;display:block}

.pg-inp-wrap{
  display:flex;align-items:center;gap:10px;
  border:2px solid #e2e8f0;
  border-radius:12px;padding:0 14px;
  background:#fff;
  transition:all 0.2s;
}
.pg-inp-wrap:focus-within{
  border-color:#16a34a;
  box-shadow:0 0 0 4px rgba(22,163,74,0.1);
}
.pg-inp-wrap.err{border-color:#ef4444;box-shadow:0 0 0 4px rgba(239,68,68,0.08)}
.pg-inp-wrap.ok{border-color:#16a34a}

.pg-upi-tag{display:flex;align-items:center;flex-shrink:0}
.pg-inp-ico{flex-shrink:0}

.pg-inp{
  flex:1;border:none;outline:none;background:transparent;
  font-family:'DM Sans',sans-serif;font-size:15px;
  color:#111827;padding:14px 0;min-width:0;
}
.pg-inp::placeholder{color:#9ca3af}

.pg-tick{
  width:22px;height:22px;background:#16a34a;
  border-radius:50%;display:grid;place-items:center;flex-shrink:0;
}
.pg-eye{
  background:none;border:none;cursor:pointer;color:#9ca3af;
  display:grid;place-items:center;padding:4px;flex-shrink:0;
  transition:color 0.15s;
}
.pg-eye:hover{color:#374151}

.pg-err{font-size:12px;color:#ef4444;margin:5px 0 0 2px}
.pg-hint{font-size:12.5px;color:#94a3b8;margin:10px 0 0;line-height:1.5}

.pg-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* 3D CARD */
.pg-card3d{
  position:relative;height:185px;
  margin-bottom:22px;cursor:pointer;
  perspective:1000px;border-radius:18px;
}
.pg-cface{
  position:absolute;inset:0;border-radius:18px;
  backface-visibility:hidden;transform-style:preserve-3d;overflow:hidden;
}
.pg-cf{
  background:linear-gradient(135deg,#15803d 0%,#16a34a 55%,#22c55e 100%);
  color:white;z-index:2;
  box-shadow:0 12px 40px rgba(22,163,74,0.4);
}
.pg-cb{
  background:linear-gradient(135deg,#14532d 0%,#15803d 100%);
  transform:rotateY(-180deg);z-index:1;
  box-shadow:0 12px 40px rgba(22,163,74,0.4);
  display:flex;flex-direction:column;gap:14px;
}
.pg-ci{
  height:100%;display:flex;flex-direction:column;
  justify-content:space-between;padding:20px 24px;
}
.pg-ctop{display:flex;align-items:center;justify-content:space-between}
.pg-chip{
  width:38px;height:28px;
  background:linear-gradient(135deg,#fde68a,#d97706);
  border-radius:5px;position:relative;overflow:hidden;
}
.pg-chipl{
  position:absolute;inset:0;
  background:
    linear-gradient(0deg,transparent 44%,rgba(0,0,0,0.18) 44%,rgba(0,0,0,0.18) 56%,transparent 56%),
    linear-gradient(90deg,transparent 44%,rgba(0,0,0,0.18) 44%,rgba(0,0,0,0.18) 56%,transparent 56%);
}
.pg-cfhint{font-size:10px;opacity:0.55}
.pg-cnum{font-family:'Courier New',monospace;font-size:19px;letter-spacing:4px;opacity:0.95}
.pg-cbot{display:flex;justify-content:space-between;align-items:flex-end}
.pg-clbl{font-size:9px;opacity:0.55;text-transform:uppercase;letter-spacing:1px;margin:0}
.pg-cval{font-size:13px;font-weight:700;letter-spacing:1px;margin:4px 0 0;text-transform:uppercase}
.pg-cstripe{height:42px;background:rgba(0,0,0,0.45)}
.pg-ccrow{display:flex;align-items:center;justify-content:flex-end;gap:12px;padding:0 24px}
.pg-ccbox{
  background:rgba(255,255,255,0.15);
  padding:8px 18px;border-radius:6px;
  font-family:monospace;font-size:18px;color:white;letter-spacing:4px;
}
.pg-cclbl{font-size:12px;opacity:0.5;color:white}
.pg-cbnote{font-size:11px;opacity:0.4;color:white;text-align:center;padding:0 24px}

/* PAY BUTTON */
.pg-pay{
  display:flex;align-items:center;justify-content:center;gap:10px;
  width:100%;padding:17px;border:none;border-radius:14px;
  background:linear-gradient(135deg,#15803d 0%,#16a34a 100%);
  color:white;font-family:'DM Sans',sans-serif;
  font-size:17px;font-weight:700;letter-spacing:0.2px;
  cursor:pointer;margin-top:auto;padding-top:17px;
  box-shadow:0 6px 24px rgba(22,163,74,0.38);
  transition:all 0.2s;
  position:relative;overflow:hidden;
  margin-top:24px;
}
.pg-pay::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
  opacity:0;transition:opacity 0.2s;
}
.pg-pay:hover::after{opacity:1}
.pg-pay:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 32px rgba(22,163,74,0.45)}
.pg-pay:active:not(:disabled){transform:scale(0.99)}
.pg-pay:disabled{opacity:0.6;cursor:not-allowed}
.pg-pay.busy{pointer-events:none}

.pg-spin{
  width:20px;height:20px;
  border:2.5px solid rgba(255,255,255,0.35);
  border-top-color:white;border-radius:50%;
  animation:pgSpin 0.75s linear infinite;
}
@keyframes pgSpin{to{transform:rotate(360deg)}}

.pg-ssl-row{
  display:flex;align-items:center;justify-content:center;gap:6px;
  font-size:12px;color:#94a3b8;margin-top:12px;text-align:center;
}

/* SUCCESS */
.pg-ok-card{
  background:#fff;border-radius:24px;
  padding:56px 52px;text-align:center;
  max-width:400px;width:100%;
  box-shadow:0 0 0 1px rgba(0,0,0,0.04),0 16px 56px rgba(0,0,0,0.12);
}
.pg-ok-ring{display:flex;align-items:center;justify-content:center;margin-bottom:24px}
.pg-check{
  stroke-dasharray:65;stroke-dashoffset:65;
  animation:pgDraw 0.6s 0.35s ease forwards;
}
@keyframes pgDraw{to{stroke-dashoffset:0}}
.pg-ok-title{font-size:26px;font-weight:800;color:#111827;margin-bottom:10px}
.pg-ok-sub{font-size:14.5px;color:#4b5563;margin-bottom:6px}
.pg-ok-note{font-size:12px;color:#9ca3af;margin-bottom:28px}
.pg-bar{height:5px;background:#f0fdf4;border-radius:5px;overflow:hidden;border:1px solid #dcfce7}
.pg-bar-fill{
  height:100%;width:0;
  background:linear-gradient(90deg,#16a34a,#22c55e);
  border-radius:5px;
  animation:pgFill 3.2s linear forwards;
}
@keyframes pgFill{from{width:0%}to{width:100%}}

/* RESPONSIVE */
@media(max-width:960px){
  .pg-page{flex-direction:column;margin-left:0;margin-top:0}
  .pg-left{width:100%;padding:32px 24px}
  .pg-right{padding:28px 20px}
  .pg-apps{grid-template-columns:repeat(2,1fr)}
}
`;
