import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiUsers,
  FiMapPin,
  FiHome,
  FiBell,
  FiTrendingUp,
  FiCalendar,
  FiChevronRight,
  FiRefreshCw,
  FiDownload,
  FiFilter
} from 'react-icons/fi';

import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');

  const [stats, setStats] = useState({
    total_users: 0,
    total_owners: 0,
    total_houses: 0,
    pending_requests: 0,
    pending_complaints: 0,
    active_houses: 0,
    booked_houses: 0,
    total_feedback: 0
  });
const statsData = [
  { id: 1, title: 'Total Users', value: stats.total_users, icon: <FiUsers />, color: '#4361ee' },
  { id: 2, title: 'Total Owners', value: stats.total_owners, icon: <FiHome />, color: '#7209b7' },
  { id: 3, title: 'Total Houses', value: stats.total_houses, icon: <FiMapPin />, color: '#f72585' },
  { id: 4, title: 'Pending Requests', value: stats.pending_requests, icon: <FiBell />, color: '#4cc9f0' },
];
const quickStats = [
  { label: 'Active Houses', value: stats.active_houses },
  { label: 'Booked Houses', value: stats.booked_houses },
  { label: 'Pending Complaints', value: stats.pending_complaints },
  { label: 'Feedback Received', value: stats.total_feedback },
];
const requestHouseData = [
  { month: 'Jan', houses: 12, requests: 30 },
  { month: 'Feb', houses: 18, requests: 42 },
  { month: 'Mar', houses: 25, requests: 65 },
  { month: 'Apr', houses: 40, requests: 90 },
];
const districtData = [
  { name: 'Kochi', value: 25, color: '#4361ee' },
  { name: 'Trivandrum', value: 18, color: '#7209b7' },
  { name: 'Calicut', value: 12, color: '#f72585' },
];

const activities = [
  { id: 1, action: 'Blocked user Devadathan', time: '5 min ago' },
  { id: 2, action: 'Approved house request', time: '20 min ago' },
  { id: 3, action: 'Replied to complaint', time: '1 hour ago' },
];
useEffect(() => {
  axios
    .get("http://127.0.0.1:8000/AdminDashboardStats/")
    .then(res => setStats(res.data))
    .catch(err => console.error(err));
}, []);
  
  return (
    <div className={styles.dashboardOuter}>
      <div className={styles.dashboardInner}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>
            <p className={styles.pageSubtitle}>Welcome back, Admin! Here's what's happening today.</p>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.timeFilterBtn}>
              <FiCalendar />
              This Week
              <FiChevronRight />
            </button>
            <button className={styles.refreshBtn}>
              <FiRefreshCw />
              Refresh
            </button>
            <button className={styles.exportBtn}>
              <FiDownload />
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
      <div className={styles.statsGrid}>
  {statsData.map(stat => (
    <div key={stat.id} className={styles.statCard}>
      <div className={styles.statIcon} style={{ backgroundColor: stat.color + '20', color: stat.color }}>
        {stat.icon}
      </div>
      <div className={styles.statContent}>
        <h3>{stat.title}</h3>
        <span className={styles.statValue}>{stat.value}</span>
      </div>
      <FiTrendingUp />
    </div>
  ))}
</div>

        {/* Charts Section */}
        <div className={styles.chartsGrid}>
          {/* User Growth Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3> House Listings vs Booking Requests</h3>
              <div className={styles.chartFilters}>
                <button className={`${styles.filterBtn} ${timeRange === 'week' ? styles.active : ''}`} onClick={() => setTimeRange('week')}>
                  Week
                </button>
                <button className={`${styles.filterBtn} ${timeRange === 'month' ? styles.active : ''}`} onClick={() => setTimeRange('month')}>
                  Month
                </button>
                <button className={`${styles.filterBtn} ${timeRange === 'year' ? styles.active : ''}`} onClick={() => setTimeRange('year')}>
                  Year
                </button>
              </div>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
               <LineChart data={requestHouseData}>
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="houses" stroke="#4361ee" />
  <Line type="monotone" dataKey="requests" stroke="#f72585" />
</LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* District Distribution Chart */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Houses by District</h3>
              <button className={styles.detailsBtn}>
                View Details
                <FiChevronRight />
              </button>
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={districtData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {districtData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomGrid}>
          {/* Recent Activities */}
          <div className={styles.activityCard}>
            <div className={styles.cardHeader}>
              <h3>Recent Activities</h3>
              <button className={styles.viewAllBtn}>
                View All
                <FiChevronRight />
              </button>
            </div>
            <div className={styles.activityList}>
            {activities.map(a => (
  <div key={a.id} className={styles.activityItem}>
    <p>{a.action}</p>
    <span>{a.time}</span>
  </div>
))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className={styles.quickStatsCard}>
            <div className={styles.cardHeader}>
              <h3>Quick Stats</h3>
              <FiFilter className={styles.filterIcon} />
            </div>
            <div className={styles.quickStatsGrid}>
              {quickStats.map((stat, index) => (
                <div key={index} className={styles.quickStatItem}>
                  <div className={styles.quickStatValue} style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className={styles.quickStatLabel}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            
            {/* System Status */}
            <div className={styles.systemStatus}>
              <h4>System Status</h4>
              <div className={styles.statusItem}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#2ecc71' }}></div>
                <span>API Server</span>
                <span className={styles.statusValue}>Online</span>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#2ecc71' }}></div>
                <span>Database</span>
                <span className={styles.statusValue}>Connected</span>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#f39c12' }}></div>
                <span>Cache Server</span>
                <span className={styles.statusValue}>Warning</span>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIndicator} style={{ backgroundColor: '#2ecc71' }}></div>
                <span>Backup System</span>
                <span className={styles.statusValue}>Active</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className={styles.metricsCard}>
            <div className={styles.cardHeader}>
              <h3>Performance Metrics</h3>
            </div>
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Page Load Time</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: '85%', backgroundColor: '#4361ee' }}></div>
                </div>
                <div className={styles.metricValue}>0.85s</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>API Response</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: '92%', backgroundColor: '#7209b7' }}></div>
                </div>
                <div className={styles.metricValue}>92ms</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Uptime</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: '99.8%', backgroundColor: '#2ecc71' }}></div>
                </div>
                <div className={styles.metricValue}>99.8%</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Error Rate</div>
                <div className={styles.metricBar}>
                  <div className={styles.metricFill} style={{ width: '2%', backgroundColor: '#e74c3c' }}></div>
                </div>
                <div className={styles.metricValue}>0.2%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;