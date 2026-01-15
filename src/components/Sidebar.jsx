import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        {role === 'admin' && (
          <>
            <Link to="/admin/dashboard" className={`sidebar-item ${isActive('/admin/dashboard')}`}>
              <span>📊</span> Dashboard
            </Link>
            <Link to="/admin/history" className={`sidebar-item ${isActive('/admin/history')}`}>
              <span>📚</span> History
            </Link>
          </>
        )}
        {role === 'receptionist' && (
          <>
            <Link to="/receptionist/dashboard" className={`sidebar-item ${isActive('/receptionist/dashboard')}`}>
              <span>📊</span> Dashboard
            </Link>
            <Link to="/receptionist/history" className={`sidebar-item ${isActive('/receptionist/history')}`}>
              <span>📚</span> History
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
