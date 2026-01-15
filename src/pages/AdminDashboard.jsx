import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { dashboardAPI } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVisitorsToday: 0,
    activeVisitors: 0,
    totalVisitorsOverall: 0,
    waitingVisitors: 0,
    exitedVisitorsToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.token || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const statsRes = await dashboardAPI.getStats();
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="admin" />
        <main className="main-content">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Overview and visitor management</p>
          </div>

          <div className="stats-grid">
            <StatCard
              title="Total Visitors Today"
              value={stats.totalVisitorsToday}
              icon="👥"
              color="blue"
            />
            <StatCard
              title="Active Visitors"
              value={stats.activeVisitors}
              icon="✅"
              color="green"
            />
            <StatCard
              title="Total Visitors Overall"
              value={stats.totalVisitorsOverall}
              icon="📊"
              color="purple"
            />
            <StatCard
              title="Waiting for Approval"
              value={stats.waitingVisitors}
              icon="⏳"
              color="orange"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
