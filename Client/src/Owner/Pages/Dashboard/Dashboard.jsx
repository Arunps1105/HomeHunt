// OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiMapPin,
  FiHome,
  FiDollarSign,
  FiStar,
  FiCheckCircle,
  FiPlusCircle,
  FiEye,
  FiImage,
  FiList,
  FiBell,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiBarChart2,
  FiClock
} from "react-icons/fi";
import { FaBath, FaBed, FaRulerCombined, FaCrown, FaRegBuilding } from "react-icons/fa";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import styles from "./Dashboard.module.css";

const OwnerDashboard = () => {
  const [owner, setOwner] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const oid = sessionStorage.getItem("oid");

        if (!oid) {
          navigate("/Guest/Login");
          return;
        }

        const res = await axios.get(
          `http://127.0.0.1:8000/OwnerProfile/${oid}/`
        );

        if (res.data.data.length > 0) {
          setOwner(res.data.data[0]);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchOwner();
  }, [navigate]);

  const stats = [
    { icon: <FiHome />, value: "8", label: "Listed Properties", trend: "+1", trendUp: true },
    { icon: <FiUsers />, value: "21", label: "Active Tenants", trend: "+3", trendUp: true },
    { icon: <FiDollarSign />, value: "₹2,45,000", label: "Monthly Income", trend: "+12%", trendUp: true },
    { icon: <FiStar />, value: "4.6", label: "Owner Rating", trend: "+0.1", trendUp: true },
  ];

  const featuredProperties = [
    {
      name: "Premium 3BHK Villa",
      location: "Kakkanad, Kochi",
      price: 28000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      beds: 3,
      baths: 3,
      sqft: 1850,
      badge: "Premium"
    },
    {
      name: "Luxury Flat",
      location: "Vyttila, Ernakulam",
      price: 22000,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      beds: 2,
      baths: 2,
      sqft: 1350,
      badge: "Trending"
    },
    {
      name: "Beachside Home",
      location: "Fort Kochi",
      price: 35000,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400",
      beds: 4,
      baths: 3,
      sqft: 2600,
      badge: "Featured"
    },
  ];

  const properties = [
    {
      name: "Green Valley House",
      location: "Thrikkakara, Kochi",
      price: 18000,
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
      beds: 2,
      baths: 2,
      sqft: 1100,
      status: "Occupied",
      views: 312
    },
    {
      name: "Skyline Apartments",
      location: "Edappally, Kochi",
      price: 25000,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
      beds: 3,
      baths: 2,
      sqft: 1450,
      status: "Available",
      views: 189
    },
    {
      name: "Sunset Villa",
      location: "Marine Drive, Kochi",
      price: 42000,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      beds: 4,
      baths: 4,
      sqft: 3200,
      status: "Occupied",
      views: 456
    },
    {
      name: "City Center Apartment",
      location: "MG Road, Ernakulam",
      price: 19500,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      beds: 2,
      baths: 1,
      sqft: 950,
      status: "Available",
      views: 234
    },
  ];

  const quickActions = [
    { icon: <FiPlusCircle />, title: "Add Property", desc: "Post a new rental house", badge: "New" },
    { icon: <FiList />, title: "Tenant Requests", desc: "3 pending approvals", badge: "3" },
    { icon: <FiDollarSign />, title: "Rent Payments", desc: "View monthly transactions", badge: null },
    { icon: <FiBell />, title: "Notifications", desc: "2 unread alerts", badge: "2" },
  ];

  const earningsData = [
    { month: "Jan", income: 180000 },
    { month: "Feb", income: 200000 },
    { month: "Mar", income: 220000 },
    { month: "Apr", income: 245000 },
    { month: "May", income: 230000 },
    { month: "Jun", income: 260000 },
  ];

  const alerts = {
    rentDue: 3,
    pendingRequests: 2,
    complaints: 1
  };

  const performanceData = [
    { name: "Green Valley", views: 320, enquiries: 28 },
    { name: "Skyline Apt", views: 210, enquiries: 19 },
    { name: "Beach Home", views: 410, enquiries: 35 },
    { name: "Sunset Villa", views: 290, enquiries: 24 },
    { name: "City Center", views: 180, enquiries: 15 },
  ];

  const occupancy = {
    total: 8,
    occupied: 6,
    available: 2,
  };

  const COLORS = ['#6366f1', '#a5b4fc', '#c7d2fe'];

  if (!owner) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.mainContent}>

        {/* Welcome Header */}
        <div className={styles.welcomeHeader}>
          <div className={styles.welcomeText}>
            <h1>Welcome back, {owner.owner_name || "Joyal"}! 👋</h1>
            <p>Here's what's happening with your properties today.</p>
          </div>
          <div className={styles.dateBadge}>
            <FiCalendar />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            {owner.owner_name?.charAt(0) || 'J'}
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.profileHeader}>
              <h2>{owner.owner_name || "Joyal Joseph"}</h2>
              <span className={styles.profileBadge}>
                <FaCrown /> Premium Owner
              </span>
            </div>
            <p className={styles.profileLocation}>
              <FiMapPin /> Property Owner • 5+ Years Experience
            </p>
            <div className={styles.profileStats}>
              <div className={styles.profileStat}>
                <span className={styles.profileStatValue}>24</span>
                <span className={styles.profileStatLabel}>Properties</span>
              </div>
              <div className={styles.profileStat}>
                <span className={styles.profileStatValue}>156</span>
                <span className={styles.profileStatLabel}>Tenants</span>
              </div>
              <div className={styles.profileStat}>
                <span className={styles.profileStatValue}>4.9</span>
                <span className={styles.profileStatLabel}>Rating</span>
              </div>
              <div className={styles.profileStat}>
                <span className={styles.profileStatValue}>5</span>
                <span className={styles.profileStatLabel}>Years</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statInfo}>
                <span className={styles.statLabel}>{stat.label}</span>
                <h3>{stat.value}</h3>
                <span className={`${styles.statTrend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                  {stat.trend} from last month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className={styles.analyticsRow}>
          {/* Chart Card */}
          <div className={styles.chartCard}>
            <div className={styles.cardHeader}>
              <h3><FiBarChart2 /> Monthly Earnings</h3>
              <span className={styles.cardBadge}>+15.3% vs last month</span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Metric Card */}
          <div className={styles.metricCard}>
            <FaRegBuilding className={styles.metricIcon} />
            <h4>Occupancy Rate</h4>
            <h2>{Math.round((occupancy.occupied / occupancy.total) * 100)}%</h2>
            <div className={styles.metricProgress}>
              <div
                className={styles.metricProgressBar}
                style={{ width: `${(occupancy.occupied / occupancy.total) * 100}%` }}
              ></div>
            </div>
            <p>{occupancy.occupied} of {occupancy.total} properties occupied</p>
            <div className={styles.metricFooter}>
              <span><FiHome /> {occupancy.available} available</span>
              <span><FiCheckCircle /> {occupancy.occupied} occupied</span>
            </div>
          </div>

          {/* Alert Grid */}
          <div className={styles.alertGrid}>
            <div className={styles.alertCard}>
              <div className={styles.alertIcon} style={{ background: '#fee2e2', color: '#ef4444' }}>
                <FiDollarSign />
              </div>
              <div className={styles.alertInfo}>
                <h3>{alerts.rentDue}</h3>
                <p>Rent Due</p>
              </div>
            </div>
            <div className={styles.alertCard}>
              <div className={styles.alertIcon} style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <FiUsers />
              </div>
              <div className={styles.alertInfo}>
                <h3>{alerts.pendingRequests}</h3>
                <p>Pending Requests</p>
              </div>
            </div>
            <div className={styles.alertCard}>
              <div className={styles.alertIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                <FiBell />
              </div>
              <div className={styles.alertInfo}>
                <h3>{alerts.complaints}</h3>
                <p>Complaints</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className={styles.performanceCard}>
          <div className={styles.cardHeader}>
            <h3><FiTrendingUp /> Property Performance</h3>
            <span className={styles.cardBadge}>Last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
              />
              <Bar dataKey="views" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="enquiries" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Featured Properties */}
        <div className={styles.featuredSection}>
          <div className={styles.sectionHeader}>
            <h2><FiStar /> Featured Properties</h2>
            <span className={styles.viewAll}>View All <FiEye /></span>
          </div>
          <div className={styles.featuredGrid}>
            {featuredProperties.map((property, index) => (
              <div key={index} className={styles.featuredCard}>
                <div className={styles.featuredImage} style={{ backgroundImage: `url(${property.image})` }}>
                  <span className={styles.featuredBadge}>{property.badge}</span>
                </div>
                <div className={styles.featuredContent}>
                  <h3 className={styles.featuredTitle}>{property.name}</h3>
                  <p className={styles.featuredLocation}>
                    <FiMapPin /> {property.location}
                  </p>
                  <div className={styles.featuredPrice}>
                    ₹{property.price.toLocaleString()}<span>/month</span>
                  </div>
                  <div className={styles.featuredFeatures}>
                    <span><FaBed /> {property.beds}</span>
                    <span><FaBath /> {property.baths}</span>
                    <span><FaRulerCombined /> {property.sqft} sqft</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Properties */}
        <div className={styles.propertiesSection}>
          <div className={styles.sectionHeader}>
            <h2><FiHome /> My Properties</h2>
            <span className={styles.viewAll}>Manage All <FiTrendingUp /></span>
          </div>
          <div className={styles.propertiesGrid}>
            {properties.map((property, index) => (
              <div key={index} className={styles.propertyCard}>
                <div className={styles.propertyImage} style={{ backgroundImage: `url(${property.image})` }}>
                  <span className={`${styles.propertyStatus} ${property.status === 'Available' ? styles.statusAvailable : styles.statusOccupied}`}>
                    {property.status}
                  </span>
                </div>
                <div className={styles.propertyInfo}>
                  <h4>{property.name}</h4>
                  <p className={styles.propertyLocation}>
                    <FiMapPin /> {property.location}
                  </p>
                  <div className={styles.propertyMeta}>
                    <span><FaBed /> {property.beds}</span>
                    <span><FaBath /> {property.baths}</span>
                    <span><FiEye /> {property.views}</span>
                  </div>
                  <div className={styles.propertyFooter}>
                    <span className={styles.propertyPrice}>₹{property.price}/month</span>
                    <button className={styles.viewButton}>View</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className={styles.bottomRow}>
          {/* Quick Actions */}
          <div className={styles.quickActions}>
            <h3>Quick Actions</h3>
            <div className={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <div key={index} className={styles.actionCard}>
                  {action.badge && <span className={styles.actionBadge}>{action.badge}</span>}
                  <div className={styles.actionIcon}>{action.icon}</div>
                  <h4>{action.title}</h4>
                  <p>{action.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.recentActivity}>
            <h3><FiClock /> Recent Activity</h3>
            <div className={styles.activityList}>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: '#e0f2fe' }}>💰</div>
                <div className={styles.activityInfo}>
                  <p>Rent payment received from <strong>John Doe</strong></p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: '#fee2e2' }}>🏠</div>
                <div className={styles.activityInfo}>
                  <p>New booking request for <strong>Green Valley</strong></p>
                  <span>5 hours ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: '#fef3c7' }}>⭐</div>
                <div className={styles.activityInfo}>
                  <p>New review received - <strong>5 stars</strong></p>
                  <span>1 day ago</span>
                </div>
              </div>
              <div className={styles.activityItem}>
                <div className={styles.activityIcon} style={{ background: '#dcfce7' }}>✅</div>
                <div className={styles.activityInfo}>
                  <p>Maintenance request <strong>completed</strong></p>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;