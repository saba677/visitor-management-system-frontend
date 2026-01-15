import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { visitorAPI, dashboardAPI } from '../services/api';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({
    totalVisitorsToday: 0,
    activeVisitors: 0,
    waitingVisitors: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.token || user.role !== 'receptionist') {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [visitorsRes, statsRes] = await Promise.all([
        visitorAPI.getToday(),
        dashboardAPI.getReceptionistStats()
      ]);
      setVisitors(visitorsRes.data.visitors);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await visitorAPI.approve(id);
      setMessage({ type: 'success', text: 'Visitor approved successfully' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve visitor' });
    }
  };

  const handleExit = async (id) => {
    try {
      await visitorAPI.markExit(id);
      setMessage({ type: 'success', text: 'Exit marked successfully' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark exit' });
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar role="receptionist" />
        <main className="main-content">
          <div className="page-header">
            <h1>Receptionist Dashboard</h1>
            <p>Manage today's visitors</p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

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
              title="Waiting for Approval"
              value={stats.waitingVisitors}
              icon="⏳"
              color="orange"
            />
          </div>

          <div className="table-container">
            <h2>Today's Visitors</h2>
            {visitors.length === 0 ? (
              <p className="no-data">No visitors today</p>
            ) : (
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Purpose</th>
                    <th>Entry Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor._id}>
                      <td>{visitor.name}</td>
                      <td>{visitor.contact}</td>
                      <td>{visitor.purpose}</td>
                      <td>{formatTime(visitor.entryTime)}</td>
                      <td>
                        <span className={`status-badge status-${visitor.status.toLowerCase()}`}>
                          {visitor.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {visitor.status === 'Waiting' && (
                            <button
                              onClick={() => handleApprove(visitor._id)}
                              className="btn btn-success btn-sm"
                            >
                              Approve
                            </button>
                          )}
                          {visitor.status === 'Approved' && (
                            <button
                              onClick={() => handleExit(visitor._id)}
                              className="btn btn-danger btn-sm"
                            >
                              Mark Exit
                            </button>
                          )}
                          {visitor.status === 'Exited' && (
                            <span className="text-muted">Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
