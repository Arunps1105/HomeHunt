import React, { useEffect, useState } from "react";
import axios from "axios";
import Styles from "./AdminOwnerList.module.css";

const AdminOwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const BASE_URL = "http://127.0.0.1:8000";

  const fetchOwners = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/AdminOwnerList/`, {
        params: statusFilter ? { status: statusFilter } : {}
      });
      setOwners(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [statusFilter]);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.post(
        `${BASE_URL}/AdminOwnerStatus/${id}/`,
        { owner_status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchOwners();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={Styles.adminOwnerContainer}>
      <div className={Styles.mainContent}>

        <div className={Styles.userManagementCard}>
          <div className={Styles.cardContent}>

            <div className={Styles.cardHeader}>
              <div className={Styles.iconWrapper}>🏠</div>
              <h2 className={Styles.cardTitle}>Owner Management</h2>
              <p className={Styles.cardSubtitle}>
                Manage property owners and access control
              </p>
            </div>

            <div className={Styles.filterSection}>
              <div className={Styles.filterGroup}>
                <label>Status</label>
                <select
                  className={Styles.filterSelect}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className={Styles.userCount}>
                Total Owners
                <span className={Styles.countBadge}>
                  {owners.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={Styles.tableCard}>
          <div className={Styles.tableContainer}>
            <table className={Styles.userTable}>
              <thead>
                <tr className={Styles.tableHeaderRow}>
                  <th>#</th>
                  <th>Owner</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner, index) => (
                  <tr key={owner.id} className={Styles.tableRow}>
                    <td><span className={Styles.indexBadge}>{index + 1}</span></td>
                    <td>{owner.owner_name}</td>
                    <td>{owner.owner_contact || "-"}</td>
                    <td>{owner.owner_email}</td>
                    <td>
                      <span className={`${Styles.statusBadge} ${Styles[`status${owner.owner_status}`]}`}>
                        {owner.owner_status}
                      </span>
                    </td>
                    <td>
                      <button
                        className={Styles.actionBtn}
                        onClick={() =>
                          updateStatus(
                            owner.id,
                            owner.owner_status === "Active" ? "Blocked" : "Active"
                          )
                        }
                      >
                        {owner.owner_status === "Active" ? "Block" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOwnerList;