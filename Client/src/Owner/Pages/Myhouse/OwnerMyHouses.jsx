import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Styles from "./OwnerMyHouses.module.css";

const OwnerMyHouses = () => {
    const [houses, setHouses] = useState([]);

    const BASE_URL = "http://127.0.0.1:8000";
    const ownerId = sessionStorage.getItem("oid"); // ✅ single source
    const navigate = useNavigate();

    // ================= STATUS UPDATE =================
    const updateHouseStatus = async (id, status) => {
        const actionText = status === "Inactive" ? "disable" : "enable";

        if (!window.confirm(`Are you sure you want to ${actionText} this house?`)) return;

        try {
            await axios.post(
                `${BASE_URL}/HouseStatus/${id}/`,
                {
                    house_status: status,
                    owner_id: ownerId   // ✅ VERY IMPORTANT
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );

            // Update UI instantly
            setHouses(prev =>
                prev.map(h =>
                    h.id === id ? { ...h, house_status: status } : h
                )
            );

            alert(`House ${status === "Inactive" ? "disabled" : "enabled"} successfully`);
        } catch (err) {
            console.error(err);
            alert("Status update failed");
        }
    };

    // ================= FETCH OWNER HOUSES =================
    useEffect(() => {
        if (!ownerId) return;

        axios
            .get(`${BASE_URL}/House/?owner_id=${ownerId}`)
            .then((res) => {
                setHouses(res.data.data || []);
            })
            .catch(() => {
                setHouses([]);
            });
    }, [ownerId]);

    return (
        <div className={Styles.container}>
            <h2 className={Styles.pageTitle}>My Houses</h2>

            {houses.length === 0 ? (
                <p className={Styles.empty}>No houses added yet</p>
            ) : (
                <div className={Styles.houseGrid}>
                    {houses.map((house) => (
                        <div key={house.id} className={Styles.houseCard}>

                            {/* HOUSE IMAGE */}
                            <img
                                src={`${BASE_URL}//${house.house_photo}`}
                                alt="House"
                                width="100%"
                                height="200px"
                                onError={(e) => {
                                    e.target.src = "/no-image.png";
                                }}
                            />

                            {/* DETAILS */}
                            <div className={Styles.houseInfo}>
                                <h3>{house.house_details}</h3>
                                <p><b>₹ {house.house_price}</b></p>
                                <p>BHK: {house.bhktype__bhktype_name}</p>
                                <p>Floor: {house.floortype__floortype_name}</p>
                                <p>Place: {house.place__place_name}</p>
                                <p>Status: {house.house_status}</p>
                            </div>

                            <div className={Styles.actions}>
                                <button
                                    className={Styles.editBtn}
                                    onClick={() =>
                                        navigate(`/Owner/EditHouse/${house.id}`)
                                    }
                                >
                                    Edit
                                </button>

                                {house.house_status === "Active" ? (
                                    <button
                                        className={Styles.disableBtn}
                                        onClick={() =>
                                            updateHouseStatus(house.id, "Inactive")
                                        }
                                    >
                                        Disable
                                    </button>
                                ) : (
                                    <button
                                        className={Styles.enableBtn}
                                        onClick={() =>
                                            updateHouseStatus(house.id, "Active")
                                        }
                                    >
                                        Enable
                                    </button>
                                )}
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OwnerMyHouses;