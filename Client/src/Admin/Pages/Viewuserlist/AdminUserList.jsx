import React, { useEffect, useState } from "react";
import axios from "axios";
import Styles from "./AdminUserList.module.css";


const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");

  const BASE_URL = "http://127.0.0.1:8000"; // change if needed

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/AdminUserList/`,
        {
          params: statusFilter ? { status: statusFilter } : {}
        }
      );
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  // 🔹 Update user status
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.post(
        `${BASE_URL}/AdminUserStatus/${id}/`,
        { user_status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className={Styles.pageContainer}>
      <div className={Styles.mainContent}>

        {/* USER MANAGEMENT CARD */}
        <div className={Styles.userManagementCard}>
          <div className={Styles.cardContent}>

            {/* HEADER */}
            <div className={Styles.cardHeader}>
              <div className={Styles.iconWrapper}>👤</div>
              <h2 className={Styles.cardTitle}>User Management</h2>
              <p className={Styles.cardSubtitle}>
                Manage users and control access
              </p>
            </div>

            {/* FILTER */}
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
                Total Users
                <span className={Styles.countBadge}>{users.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className={Styles.tableCard}>
          <div className={Styles.tableContainer}>
            <table className={Styles.userTable}>
              <thead>
                <tr className={Styles.tableHeaderRow}>
                  <th className={Styles.tableHeaderCell}>#</th>
                  <th className={Styles.tableHeaderCell}>User</th>
                  <th className={Styles.tableHeaderCell}>Contact</th>
                  <th className={Styles.tableHeaderCell}>Tenant</th>
                  <th className={Styles.tableHeaderCell}>Status</th>
                  <th className={Styles.tableHeaderCell}>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className={Styles.emptyState}>
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className={Styles.tableRow}>
                      <td className={Styles.tableCell}>
                        <span className={Styles.indexBadge}>{index + 1}</span>
                      </td>

                      <td className={Styles.tableCell}>
                        <div className={Styles.userInfo}>
                          <div className={Styles.userAvatar}>
                            {user.user_name[0]}
                          </div>
                          <div className={Styles.userDetails}>
                            <span className={Styles.userName}>
                              {user.user_name}
                            </span>
                            <span className={Styles.userEmail}>
                              {user.user_email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className={Styles.tableCell}>
                        {user.user_contact}
                      </td>

                      <td className={Styles.tableCell}>
                        <span className={Styles.tenantType}>
                          {user.tententtype__tenanttype_name}
                        </span>
                      </td>

                      <td className={Styles.tableCell}>
                        <span
                          className={`${Styles.statusBadge} ${user.user_status === "Active"
                              ? Styles.statusActive
                              : user.user_status === "Blocked"
                                ? Styles.statusBlocked
                                : Styles.statusInactive
                            }`}
                        >
                          {user.user_status}
                        </span>
                      </td>

                      <td className={Styles.tableCell}>
                        <div className={Styles.actionButtons}>
                          {user.user_status === "Active" ? (
                            <button
                              className={`${Styles.actionBtn} ${Styles.blockBtn}`}
                              onClick={() =>
                                updateStatus(user.id, "Blocked")
                              }
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              className={`${Styles.actionBtn} ${Styles.activateBtn}`}
                              onClick={() =>
                                updateStatus(user.id, "Active")
                              }
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
export default AdminUserList;