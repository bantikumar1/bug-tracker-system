import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  Menu, Search, Bell, User, LogOut, Settings, 
  ChevronDown, CheckCircle2, AlertCircle, Trash2, Check, Eye, EyeOff, X 
} from 'lucide-react';

const Topbar = ({ setIsMobileOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoadingNotifs(true);
      const response = await api.get('/notifications');
      setNotifications(response.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/bugs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Notification Actions
  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAsUnread = async (id, e) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/unread`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 0 } : n))
      );
    } catch (err) {
      console.error('Failed to mark notification as unread', err);
    }
  };

  const handleDeleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Failed to delete notification', err);
    }
  };

  const handleClearAllNotifications = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications?')) {
      return;
    }
    try {
      await api.delete('/notifications/clear');
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear notifications', err);
    }
  };

  // Derive readable page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/developer/dashboard') return 'Developer Dashboard';
    if (path === '/tester/dashboard') return 'Tester Dashboard';
    if (path === '/admin/testers') return 'Testers Management';
    if (path === '/admin/developers') return 'Developers Management';
    if (path === '/bugs') return 'Bug List';
    if (path === '/bugs/create') return 'Report New Bug';
    if (path.startsWith('/bugs/')) return 'Bug Details';
    if (path === '/users') return 'Testers Management';
    if (path === '/reports') return 'Reports & Analytics';
    if (path === '/profile') return 'My Profile';
    if (path === '/admin/settings' || path === '/settings' || path === '/developer/settings') return 'Settings';
    return 'Dashboard';
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Mobile Hamburger Button */}
        <button 
          className="btn-mobile-hamburger" 
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle Mobile Menu"
        >
          <Menu size={22} />
        </button>

        {/* Dynamic Page Title */}
        <h1 className="topbar-page-title">{getPageTitle()}</h1>
      </div>

      <div className="topbar-right">
        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="topbar-search-form">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="topbar-search-input"
          />
        </form>

        {/* Notifications Dropdown */}
        <div className="topbar-dropdown-container" ref={notificationsRef}>
          <button 
            className={`btn-topbar-icon ${showNotifications ? 'active' : ''}`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge-dot">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="topbar-dropdown-menu notifications-menu">
              <div className="dropdown-header" style={{ justifyContent: 'space-between' }}>
                <div>
                  <span className="dropdown-title">Notifications</span>
                  <span className="dropdown-sub-tag" style={{ marginLeft: '0.5rem' }}>
                    {unreadCount} Unread
                  </span>
                </div>
                {notifications.length > 0 && (
                  <button 
                    onClick={handleClearAllNotifications}
                    className="btn-clear-all-notifs"
                    title="Clear all notifications"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.is_read ? 'read' : 'unread'}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid var(--border-color)',
                        background: notif.is_read ? 'transparent' : 'rgba(99, 102, 241, 0.06)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: '1', minWidth: 0 }}>
                        <div className="notif-icon-box" style={{ color: notif.is_read ? 'var(--text-muted)' : '#3b82f6', background: notif.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(59, 130, 246, 0.15)', marginTop: '0.15rem' }}>
                          <AlertCircle size={16} />
                        </div>
                        <div className="notif-content" style={{ overflow: 'hidden' }}>
                          <p className="notif-title" style={{ fontWeight: notif.is_read ? '500' : '700', color: notif.is_read ? 'var(--text-secondary)' : 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>
                            {notif.title}
                          </p>
                          {notif.message && (
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.2rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {notif.message}
                            </p>
                          )}
                          <span className="notif-time" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {formatDate(notif.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Notification Action Icons */}
                      <div className="notif-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem' }}>
                        {notif.is_read ? (
                          <button
                            onClick={(e) => handleMarkAsUnread(notif.id, e)}
                            className="btn-notif-action"
                            title="Mark as Unread"
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
                          >
                            <EyeOff size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => handleMarkAsRead(notif.id, e)}
                            className="btn-notif-action"
                            title="Mark as Read"
                            style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', padding: '0.2rem' }}
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteNotification(notif.id, e)}
                          className="btn-notif-action action-delete"
                          title="Delete Notification"
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="topbar-dropdown-container" ref={userMenuRef}>
          <button 
            className="topbar-user-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="user-avatar-circle header-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info-text">
              <span className="user-name">{user?.name}</span>
              <span className="user-role-label">{user?.role?.toUpperCase()}</span>
            </div>
            <ChevronDown size={16} className="chevron-icon" />
          </button>

          {showUserMenu && (
            <div className="topbar-dropdown-menu user-menu">
              <div className="dropdown-user-header">
                <p className="menu-user-name">{user?.name}</p>
                <p className="menu-user-email">{user?.email}</p>
                <span className={`role-badge role-${user?.role} style-pill`}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>

              <hr className="dropdown-divider" />

              <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                <User size={16} />
                <span>My Profile</span>
              </Link>

              {user?.role === 'admin' && (
                <Link to="/admin/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                  <Settings size={16} />
                  <span>Admin Settings</span>
                </Link>
              )}

              <hr className="dropdown-divider" />

              <button onClick={handleLogout} className="dropdown-item text-danger">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
