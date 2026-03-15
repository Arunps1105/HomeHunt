import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Styles from "./EditHouse.module.css";

const EditHouse = () => {
  const { id } = useParams(); // house id
  const navigate = useNavigate();
  const ownerId = sessionStorage.getItem("oid");

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    house_details: "",
    house_price: ""
  });

  // ================= FETCH HOUSE =================
  useEffect(() => {
    if (!ownerId) return;

    axios
      .get(`http://127.0.0.1:8000/House/?owner_id=${ownerId}`)
      .then((res) => {

        const house = res.data.data.find(h => String(h.id) === String(id));

        if (!house) {
          alert("Unauthorized access");
          navigate("/Owner/OwnerMyHouses");
          return;
        }

        setForm({
          house_details: house.house_details,
          house_price: house.house_price
        });

        setLoading(false);

      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load house details");
      });
  }, [id, ownerId, navigate]);

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("house_details", form.house_details);
    formData.append("house_price", form.house_price);

    // 🔥 VERY IMPORTANT
    formData.append("owner_id", ownerId);

    try {
      await axios.post(
        `http://127.0.0.1:8000/HouseUpdate/${id}/`,
        formData
      );

      alert("House updated successfully");
      navigate("/Owner/OwnerMyHouses");

    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  if (loading) {
    return <div className={Styles.loading}>Loading house details...</div>;
  }

  return (
    <div className={Styles.container}>
      <div className={Styles.formCard}>
        <div className={Styles.header}>
          <h2>Edit House</h2>
          <p>Update your house details</p>
        </div>

        <form onSubmit={submit} className={Styles.form}>
          <div className={Styles.formGroup}>
            <label>House Details</label>
            <input
              className={Styles.input}
              value={form.house_details}
              onChange={(e) =>
                setForm({ ...form, house_details: e.target.value })
              }
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <label>House Price</label>
            <input
              type="number"
              className={Styles.input}
              value={form.house_price}
              onChange={(e) =>
                setForm({ ...form, house_price: e.target.value })
              }
              required
            />
          </div>

          <div className={Styles.buttonGroup}>
            <button type="submit" className={Styles.submitBtn}>
              Update
            </button>
            <button
              type="button"
              className={Styles.cancelBtn}
              onClick={() => navigate("/Owner/OwnerMyHouses")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditHouse;