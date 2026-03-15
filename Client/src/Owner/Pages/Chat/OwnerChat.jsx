import React, { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./OwnerChat.module.css";

const BASE = "http://127.0.0.1:8000";
const GIPHY_KEY = "YOUR_GIPHY_API_KEY";

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const initials = (s = "") =>
  s.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const isImage = (path = "") => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);

const mediaUrl = (path = "") => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^\/+/, "").replace(/^media\//, "");
  return `${BASE}/media/${clean}`;
};

const shortName = (path = "") => {
  const name = path.split("/").pop() || "File";
  return name.length > 26 ? name.slice(0, 24) + "…" : name;
};

const fileExt = (path = "") => (path.split(".").pop()?.toUpperCase() || "FILE").slice(0, 5);

const fileEmoji = (path = "") => {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "📄";
  if (["doc","docx"].includes(ext)) return "📝";
  if (["xls","xlsx","csv"].includes(ext)) return "📊";
  if (["zip","rar","7z"].includes(ext)) return "🗜️";
  if (["mp4","mov","avi","mkv"].includes(ext)) return "🎬";
  if (["mp3","wav","ogg"].includes(ext)) return "🎵";
  return "📎";
};

const EMOJI_CATS = [
  { label:"😀", name:"Smileys", emojis:["😀","😂","🤣","😊","😍","🥰","😘","😎","🤔","😅","🫡","🥳","😭","😤","🤯","🥺","😬","🫠","😴","🤗","🫢","🥱","🤩","😇","🤪","😜","😏","🙄","😑","🫣","😋","🤭","🙃","😳","😱","🤫","😮","🫤","😐","🤐"] },
  { label:"👍", name:"Gestures", emojis:["👍","👎","👏","🙌","🤝","🤜","🤛","✌️","🤞","🤟","🤙","💪","🫶","❤️","🔥","💯","⭐","✅","❌","🎉","🎊","🎁","🏆","💰","💎","🚀","✨","💥","⚡","🌟"] },
  { label:"🏠", name:"Places", emojis:["🏠","🏡","🏢","🏗️","🏘️","🏚️","🏛️","🗺️","📍","📌","🔑","🗝️","🚪","🛋️","🪑","🛏️","🚿","🛁","🪟","🖼️","🧹","🧺","🧻","🪣","💡","🔌","📦","📬","🛒","🏷️"] },
  { label:"📱", name:"Objects", emojis:["📱","💻","🖥️","⌨️","🖱️","📷","📸","🎥","📹","📞","☎️","📟","📠","📺","📻","🎙️","🎚️","🎛️","🧭","⏰","⌚","🔋","🔌","💾","💿","📀","🖨️","🖲️","📡"] },
];

const Ticks = ({ seen }) => (
  <span className={`${styles.ticks} ${seen ? styles.seen : ""}`}>{seen ? "✓✓" : "✓"}</span>
);

const FileBubble = ({ file, onImageClick }) => {
  const url = mediaUrl(file);
  const handleDownload = async (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl; a.download = file.split("/").pop() || "download";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(blobUrl);
    } catch { window.open(url, "_blank"); }
  };
  if (isImage(file)) {
    return (
      <div>
        <img className={styles.chatImg} src={url} alt="attachment"
          onClick={() => onImageClick && onImageClick(url)}
          onError={(e) => { e.target.style.display = "none"; }} />
        <div className={styles.fileLink} style={{ marginTop: 4 }}>
          <div className={styles.fileIconWrap} style={{ fontSize: 16 }}>🖼️</div>
          <div className={styles.fileInfo}>
            <div className={styles.fileLabel}>{shortName(file)}</div>
            <div className={styles.fileSize}>Image</div>
          </div>
          <button className={styles.downloadBtn} onClick={handleDownload} title="Download">⬇️</button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.fileLink}>
      <div className={styles.fileIconWrap}>{fileEmoji(file)}</div>
      <div className={styles.fileInfo}>
        <div className={styles.fileLabel}>{shortName(file)}</div>
        <div className={styles.fileSize}>{fileExt(file)} File</div>
      </div>
      <button className={styles.downloadBtn} onClick={handleDownload} title="Download">⬇️</button>
    </div>
  );
};

const GifPanel = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const fetchGifs = useCallback(async (q) => {
    setLoading(true);
    try {
      const endpoint = q.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${encodeURIComponent(q)}&limit=12`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}&limit=12`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setGifs(json.data || []);
    } catch { setGifs([]); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchGifs(""); }, []);
  const handleInput = (e) => {
    const val = e.target.value; setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchGifs(val), 500);
  };
  return (
   <div className={styles.gifPanel} onMouseDown={(e) => e.preventDefault()}>
      <input className={styles.gifSearch} placeholder="Search GIFs…" value={query} onChange={handleInput} autoFocus />
      {loading ? <div className={styles.gifLoading}>Loading…</div> : (
        <div className={styles.gifGrid}>
          {gifs.map((g) => (
            <div key={g.id} className={styles.gifItem} onClick={() => onSelect(g.images.fixed_height.url)}>
              <img src={g.images.fixed_height_small.url} alt={g.title} loading="lazy" />
            </div>
          ))}
          {gifs.length === 0 && <div className={styles.gifLoading}>No GIFs found</div>}
        </div>
      )}
    </div>
  );
};

const EmojiPanel = ({ onSelect }) => {
  const [cat, setCat] = useState(0);
  return (
 <div className={styles.emojiPanel} onMouseDown={(e) => e.preventDefault()}>
      <div className={styles.emojiTabs}>
        {EMOJI_CATS.map((c, i) => (
          <button key={i} className={`${styles.emojiTab} ${cat === i ? styles.active : ""}`}
            onClick={() => setCat(i)} title={c.name}>{c.label}</button>
        ))}
      </div>
      <div className={styles.emojiGrid}>
        {EMOJI_CATS[cat].emojis.map((em) => (
          <button key={em} className={styles.emojiBtn} onClick={() => onSelect(em)}>{em}</button>
        ))}
      </div>
    </div>
  );
};

const CtxMenu = ({ x, y, isMe, onCopy, onDelete, onClose }) => {
  useEffect(() => {
    const h = () => onClose();
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [onClose]);
  return (
    <div className={styles.ctxMenu} style={{ top: y, left: x }}>
      <div className={styles.ctxItem} onClick={onCopy}>📋 Copy text</div>
      {isMe && <div className={`${styles.ctxItem} ${styles.danger}`} onClick={onDelete}>🗑️ Delete</div>}
    </div>
  );
};

const Lightbox = ({ src, onClose }) => (
  <div className={styles.lightbox} onClick={onClose}>
    <a className={styles.lightboxDownload} href={src} download onClick={(e) => e.stopPropagation()} title="Download">⬇️</a>
    <button className={styles.lightboxClose} onClick={onClose}>✕</button>
    <img src={src} alt="preview" onClick={(e) => e.stopPropagation()} />
  </div>
);

/* ─── MAIN COMPONENT ─── */
const OwnerChat = () => {
  const { id } = useParams();
  const ownerId = Number(sessionStorage.getItem("oid"));
  const userId  = ownerId;
  const role    = "owner";

  const [messages, setMessages]       = useState([]);
  const [text, setText]               = useState("");
  const [isTyping, setIsTyping]       = useState(false);
  const [connected, setConnected]     = useState(false);
  const [peerName, setPeerName]       = useState("");
  const [peerPhoto, setPeerPhoto]     = useState("");
  const [myName, setMyName]           = useState("");
  const [myPhoto, setMyPhoto]         = useState("");
  const [showEmoji, setShowEmoji]     = useState(false);
  const [showGif, setShowGif]         = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [previewUrl, setPreviewUrl]   = useState(null);
  const [reactions, setReactions]     = useState({});
  const [ctxMenu, setCtxMenu]         = useState(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isAtBottom, setIsAtBottom]   = useState(true);

  const socketRef   = useRef(null);
  const bottomRef   = useRef(null);
  const messagesRef = useRef(null);
  const typingTimer = useRef(null);
  const inputRef    = useRef(null);

  const scrollToBottom = () => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); setUnreadCount(0); setIsAtBottom(true); };
  const handleScroll = () => {
    const el = messagesRef.current; if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setIsAtBottom(atBottom); setShowScrollBtn(!atBottom);
    if (atBottom) setUnreadCount(0);
  };

  useEffect(() => {
    if (isAtBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    else setUnreadCount((n) => n + 1);
  }, [messages]);

  useEffect(() => {
    if (ownerId) {
      axios.get(`${BASE}/OwnerProfile/${ownerId}/`).then((res) => {
        const owner = res.data.data?.[0]; if (!owner) return;
        if (owner.owner_photo) setMyPhoto(owner.owner_photo);
        if (owner.owner_name)  setMyName(owner.owner_name);
      });
    }
    axios.get(`${BASE}/Requested/?request_id=${id}`).then((res) => {
      const req = res.data.data?.[0]; if (!req) return;
      setPeerName(req.user_id__user_name   || "");
      setPeerPhoto(req.user_id__user_photo || "");
    });
    axios.get(`${BASE}/ChatMessages/?request_id=${id}`).then((res) => {
      setMessages(res.data.data || []);
      axios.post(`${BASE}/MarkSeen/${id}/`);
    });
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);
    socketRef.current = ws;
    ws.onopen  = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type === "typing") { setIsTyping(data.is_typing && String(data.sender_id) !== String(userId)); return; }
  if (data.type === "seen")   { setMessages((prev) => prev.map((m) => ({ ...m, is_seen: true }))); return; }
  if (data.type === "file_uploaded") {
    // only add on the OTHER person's side (uploader already added it above)
    if (String(data.sender_id) !== String(userId)) {
      setMessages((prev) => [...prev, data]);
    }
    return;
  }
  if (data.type === "message") { setMessages((prev) => [...prev, data]); setIsTyping(false); axios.post(`${BASE}/MarkSeen/${id}/`); }
};
    return () => ws.close();
  }, [id]);

  const sendTyping = (val) => { if (socketRef.current?.readyState === 1) socketRef.current.send(JSON.stringify({ type: "typing", sender_id: userId, is_typing: val })); };
  const handleTextChange = (e) => { setText(e.target.value); sendTyping(true); clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => sendTyping(false), 2000); };
  const send = (overrideText) => {
    const msg = overrideText ?? text.trim();
    if (!msg || socketRef.current?.readyState !== 1) return;
    socketRef.current.send(JSON.stringify({ type: "message", message: msg, sender: role, sender_id: userId }));
    sendTyping(false); clearTimeout(typingTimer.current);
    if (!overrideText) setText("");
    setShowEmoji(false); setShowGif(false);
  };
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
  const insertEmoji = (em) => { setText((t) => t + em); inputRef.current?.focus(); };
  const sendGif = (url) => {
    if (socketRef.current?.readyState !== 1) return;
    socketRef.current.send(JSON.stringify({ type: "message", message: `[GIF]${url}`, sender: role, sender_id: userId }));
    setShowGif(false);
  };
  const selectFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    setPendingFile(file);
    if (file.type.startsWith("image/")) { const r = new FileReader(); r.onload = (ev) => setPreviewUrl(ev.target.result); r.readAsDataURL(file); }
    else setPreviewUrl(null);
    e.target.value = "";
  };
  const cancelUpload = () => { setPendingFile(null); setPreviewUrl(null); };
 const uploadFile = async () => {
  if (!pendingFile) return;
  const fd = new FormData();
  fd.append("file", pendingFile); fd.append("request_id", id);
  fd.append("sender_id", userId); fd.append("sender", role);
  
  const uploadRes = await axios.post(`${BASE}/UploadChatFile/`, fd);
  const newMsg = uploadRes.data.data;

  // broadcast via WebSocket so other side sees it instantly
  if (socketRef.current?.readyState === 1) {
    socketRef.current.send(JSON.stringify({
      type: "file_uploaded",
      id: newMsg?.id,
      file: newMsg?.file || "",
      message: "",
      sender: role,
      sender_id: userId,
      created_at: newMsg?.created_at || new Date().toISOString(),
    }));
  }

  setMessages((prev) => [...prev, {
    id: newMsg?.id,
    file: newMsg?.file || "",
    message: "",
    sender: role,
    sender_id: userId,
    created_at: newMsg?.created_at || new Date().toISOString(),
    is_seen: false,
  }]);

  setPendingFile(null); setPreviewUrl(null);
};
  const addReaction = (idx, emoji) => setReactions((prev) => { const cur = prev[idx] || {}; return { ...prev, [idx]: { ...cur, [emoji]: (cur[emoji] || 0) + 1 } }; });
  const handleRightClick = (e, msg, idx) => { e.preventDefault(); setCtxMenu({ x: e.clientX, y: e.clientY, msg, idx }); };
const copyText = () => { if (ctxMenu?.msg?.message) navigator.clipboard.writeText(ctxMenu.msg.message); setCtxMenu(null); };

const deleteMsg = async () => {
  if (ctxMenu?.msg?.id) {
    await axios.delete(`${BASE}/DeleteChatMessage/${ctxMenu.msg.id}/`);
    setMessages((prev) => prev.filter((m) => m.id !== ctxMenu.msg.id));
  }
  setCtxMenu(null);
};
  const renderMessage = (msg, i) => {
    const isMe  = String(msg.sender_id) === String(userId);
    const rxs   = reactions[i] || {};
    const isGif = msg.message?.startsWith("[GIF]");
    const gifUrl = isGif ? msg.message.slice(5) : null;
    return (
      <div key={msg.id || i} className={`${styles.row} ${isMe ? styles.mine : styles.theirs}`}
        style={{ marginBottom: Object.keys(rxs).length ? 20 : 4 }}>
        {!isMe && (peerPhoto
          ? <img src={`${BASE}/${peerPhoto}`} className={styles.avatar} alt="user" onError={(e) => { e.target.style.display = "none"; }} />
          : <div className={styles.av}>{initials(peerName)}</div>)}
        <div className={`${styles.bubble} ${isMe ? styles.mine : styles.theirs}`} onContextMenu={(e) => handleRightClick(e, msg, i)}>
          {isGif ? <img className={styles.gifImg} src={gifUrl} alt="GIF" /> : (<>{msg.message && <div>{msg.message}</div>}{msg.file && <FileBubble file={msg.file} onImageClick={setLightboxSrc} />}</>)}
          <div className={styles.meta}><span className={styles.time}>{fmt(msg.created_at)}</span>{isMe && <Ticks seen={msg.is_seen} />}</div>
        </div>
        <div className={styles.reactionPicker}>
          {["❤️","😂","👍","😮","😢","🙏"].map((em) => <button key={em} className={styles.rxBtn} onClick={() => addReaction(i, em)}>{em}</button>)}
        </div>
        {Object.keys(rxs).length > 0 && (
          <div className={styles.reactionBar}>
            {Object.entries(rxs).map(([em, count]) => <span key={em} className={styles.reactionChip}>{em}{count > 1 ? ` ${count}` : ""}</span>)}
          </div>
        )}
        {isMe && (myPhoto
          ? <img src={`${BASE}/${myPhoto}`} className={styles.avatar} alt="me" onError={(e) => { e.target.style.display = "none"; }} />
          : <div className={styles.av}>{initials(myName || "ME")}</div>)}
      </div>
    );
  };

  return (
    
    <div className={`${styles.chatWrapper} ${styles.ownerMode}`}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          {peerPhoto ? <img src={`${BASE}/${peerPhoto}`} className={styles.hAvatarImg} alt="user" onError={(e) => { e.target.style.display = "none"; }} /> : <div className={styles.hAvatar}>{initials(peerName)}</div>}
          <div className={styles.hInfo}>
            <div className={styles.hName}>{peerName || "Loading…"}</div>
            <div className={styles.hStatus}>{connected && <span className={styles.hDot} />}<span>{isTyping ? "typing…" : connected ? "online" : "connecting…"}</span></div>
          </div>
          <div className={styles.hActions}>
            <button className={styles.hBtn} title="Video call">📹</button>
            <button className={styles.hBtn} title="Voice call">📞</button>
            <button className={styles.hBtn} title="More">⋮</button>
          </div>
        </div>
        <div className={styles.chatMessages} ref={messagesRef} onScroll={handleScroll}>
          {messages.length === 0 && <div className={styles.empty}><div className={styles.emptyCircle}>💬</div><p>No messages yet — say hello!</p></div>}
          {messages.length > 0 && <div className={styles.dateSep}><span>TODAY</span></div>}
          {messages.map((msg, i) => renderMessage(msg, i))}
          {isTyping && (
            <div className={styles.typingRow}>
              {peerPhoto ? <img src={`${BASE}/${peerPhoto}`} className={styles.avatar} alt="user" /> : <div className={styles.av}>{initials(peerName)}</div>}
              <div className={styles.typingBubble}><div className={styles.dot} /><div className={styles.dot} /><div className={styles.dot} /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        {showScrollBtn && <button className={styles.scrollBtn} onClick={scrollToBottom}>{unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}↓</button>}
        {pendingFile && (
          <div className={styles.uploadPreview}>
            {previewUrl ? <img className={styles.uploadPreviewImg} src={previewUrl} alt="preview" /> : <span style={{ fontSize: 28 }}>{fileEmoji(pendingFile.name)}</span>}
            <div style={{ flex: 1, overflow: "hidden" }}><div className={styles.uploadPreviewFile}>{pendingFile.name}</div><div className={styles.uploadPreviewType}>{(pendingFile.size / 1024).toFixed(1)} KB</div></div>
            <button className={styles.uploadCancelBtn} onClick={cancelUpload}>✕</button>
            <button className={styles.sendBtn} style={{ width: 38, height: 38, fontSize: 16 }} onClick={uploadFile}>⬆️</button>
          </div>
        )}
        {showEmoji && <EmojiPanel onSelect={insertEmoji} />}
        {showGif && <GifPanel onSelect={sendGif} />}
        <div className={styles.inputBar}>
          <div className={styles.inputPill}>
            <button className={styles.icoBtn} title="Emoji" onClick={() => { setShowEmoji((v) => !v); setShowGif(false); }}>😊</button>
            <button className={styles.icoBtn} title="GIF" style={{ fontSize: 13, fontWeight: 700, color: showGif ? "#128C7E" : undefined }} onClick={() => { setShowGif((v) => !v); setShowEmoji(false); }}>GIF</button>
            <textarea ref={inputRef} className={styles.chatInput} placeholder="Type a message" value={text} onChange={handleTextChange} onKeyDown={onKey} rows={1} />
            <label className={styles.fileUpload} title="Attach file">📎<input type="file" onChange={selectFile} /></label>
          </div>
          <button className={styles.sendBtn} onClick={() => send()} disabled={!text.trim()} title="Send">➤</button>
        </div>
      </div>
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
{ctxMenu && <CtxMenu x={ctxMenu.x} y={ctxMenu.y} isMe={String(ctxMenu.msg?.sender_id) === String(userId)} onCopy={copyText} onDelete={deleteMsg} onClose={() => setCtxMenu(null)} />}    </div>
  );
};

export default OwnerChat;