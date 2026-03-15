import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./OwnerChats.module.css";

const OwnerChatView = () => {

  const [chats, setChats] = useState([]);
  const [deleting, setDeleting] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();
  const ownerId = sessionStorage.getItem("oid");

  useEffect(() => {

    if (!ownerId) {
      navigate("/Guest/Login");
      return;
    }

    fetchChats();

  }, [ownerId]);

  const fetchChats = async () => {

    try {

      const res = await axios.get(
        `http://127.0.0.1:8000/OwnerChats/?owner_id=${ownerId}`
      );

      setChats(res.data?.data || []);
      setLoaded(true);

    } catch (error) {

      console.error("Error loading chats", error);
      setLoaded(true);

    }

  };

  const deleteChat = async (id) => {

    if (!window.confirm("Delete this conversation?")) return;

    setDeleting(id);

    try {

      await axios.delete(
        `http://127.0.0.1:8000/DeleteChatRequest/${id}/`
      );

      setChats(prev => prev.filter(c => c.id !== id));

    } catch (error) {

      console.error("Delete error", error);

    }

    setDeleting(null);

  };

  return (

    <div className={styles.page}>

      <div className={styles.container}>

        <h2 className={styles.title}>Messages</h2>

        {!loaded ? (

          <p>Loading chats...</p>

        ) : chats.length === 0 ? (

          <p className={styles.empty}>No messages yet</p>

        ) : (

          <div className={styles.chatList}>

            {chats.map((chat) => (

              <div
                key={chat.id}
                className={styles.chatCard}
                onClick={() => navigate(`/Owner/Chat/${chat.id}`)}
              >

                {/* USER AVATAR */}

                {chat.user_photo ? (

                  <img
                    src={`http://127.0.0.1:8000/${chat.user_photo}`}
                    alt="user"
                    className={styles.avatar}
                  />

                ) : (

                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="user"
                    className={styles.avatar}
                  />

                )}

                {/* CHAT INFO */}

                <div className={styles.chatInfo}>

                  <div className={styles.userName}>
                    {chat.user_name}
                  </div>

                  <div className={styles.newMessage}>
                    New message from {chat.user_name}
                  </div>

                  <div className={styles.houseDetails}>
                    {chat.house_details}
                  </div>

                </div>

                {/* HOUSE IMAGE */}

                {chat.house_photo && (

                  <img
                    src={`http://127.0.0.1:8000/${chat.house_photo}`}
                    alt="house"
                    className={styles.houseImage}
                  />

                )}

                {/* DELETE BUTTON */}

                <button
                  className={styles.deleteBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  disabled={deleting === chat.id}
                >
                  {deleting === chat.id ? "Deleting..." : "Delete"}
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );

};

export default OwnerChatView;