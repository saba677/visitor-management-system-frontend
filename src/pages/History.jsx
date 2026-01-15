import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { visitorAPI } from '../services/api';

const History = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    if (!userData.token) {
      navigate('/login');
      return;
    }
    fetchVisitors();
  }, [navigate]);

  const fetchVisitors = async (date = '') => {
    try {
      const params = date ? { date } : {};
      const response = await visitorAPI.getAll(params);
      setVisitors(response.data.visitors);
    } catch (error) {
      console.error('Error fetching visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = () => {
    fetchVisitors(filterDate);
  };

  const handleClearFilter = () => {
    setFilterDate('');
    fetchVisitors();
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
        <Sidebar role={user.role} />
        <main className="main-content">
          <div className="page-header">
            <h1>Visitor History</h1>
            <p>All registered visitors</p>
          </div>

          <div className="table-container">
            <div className="table-header">
              <h2>Visitors</h2>
              <div className="filter-section">
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="form-input"
                />
                <button onClick={handleFilterByDate} className="btn btn-primary">
                  Filter
                </button>
                <button onClick={handleClearFilter} className="btn btn-secondary">
                  Clear
                </button>
              </div>
            </div>

            {visitors.length === 0 ? (
              <p className="no-data">No visitors found</p>
            ) : (
              <table className="visitors-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Entry Time</th>
                    <th>Exit Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor._id}>
                      <td>{visitor.name}</td>
                      <td>{visitor.contact}</td>
                      <td>{visitor.purpose}</td>
                      <td>{formatDate(visitor.createdAt)}</td>
                      <td>{formatTime(visitor.entryTime)}</td>
                      <td>{visitor.exitTime ? formatTime(visitor.exitTime) : '-'}</td>
                      <td>
                        <span className={`status-badge status-${visitor.status.toLowerCase()}`}>
                          {visitor.status}
                        </span>
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

export default History;
