import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bug, LayoutDashboard, ListTodo, Users, LogOut, ShieldCheck, Code, TestTube } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <ShieldCheck className="role-icon admin" size={16} />;
      case 'developer':
        return <Code className="role-icon developer" size={16} />;
      case 'tester':
        return <TestTube className="role-icon tester" size={16} />;
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          <div className="brand-logo">
            <Bug size={24} />
          </div>
          <span className="brand-title">BugTracker</span>
        </Link>

        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <Link 
            to="/bugs" 
            className={`nav-link ${location.pathname === '/bugs' || location.pathname.startsWith('/bugs/') ? 'active' : ''}`}
          >
            <ListTodo size={18} />
            <span>Bug List</span>
          </Link>

          {user.role === 'admin' && (
            <Link 
              to="/users" 
              className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}
            >
              <Users size={18} />
              <span>Users</span>
            </Link>
          )}
        </div>

        <div className="nav-user-section">
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className={`role-badge role-${user.role}`}>
              {getRoleIcon(user.role)}
              {user.role.toUpperCase()}
            </span>
          </div>

          <button onClick={handleLogout} className="btn-logout" title="Logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
