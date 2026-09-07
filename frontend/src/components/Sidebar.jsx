import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Bug, LayoutDashboard, ListTodo, Code, TestTube, 
  Settings, User, PlusCircle, UserCheck, FileText, 
  CheckCircle2, LogOut, ChevronLeft, ChevronRight, X
} from 'lucide-react';

const Sidebar = ({ 
  user, 
  logoutUser, 
  isCollapsed, 
  setIsCollapsed, 
  isMobileOpen, 
  setIsMobileOpen 
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getMenuItems = () => {
    const role = user.role;

    if (role === 'admin') {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Testers', path: '/admin/testers', icon: TestTube },
        { label: 'Developers', path: '/admin/developers', icon: Code },
        { label: 'Bug List', path: '/bugs', icon: ListTodo },
        { label: 'Settings', path: '/admin/settings', icon: Settings }
      ];
    }

    if (role === 'developer') {
      return [
        { label: 'Dashboard', path: '/developer/dashboard', icon: LayoutDashboard },
        { label: 'Available Bugs', path: '/developer/available-bugs', icon: ListTodo },
        { label: 'My Assigned Bugs', path: '/developer/my-bugs', icon: UserCheck },
        { label: 'Fixed by Me', path: '/developer/fixed', icon: CheckCircle2 },
        { label: 'Profile / Settings', path: '/developer/settings', icon: Settings }
      ];
    }

    if (role === 'tester') {
      return [
        { label: 'Dashboard', path: '/tester/dashboard', icon: LayoutDashboard },
        { label: 'Report Bug', path: '/bugs/create', icon: PlusCircle },
        { label: 'My Bugs', path: '/bugs?filter=reported', icon: FileText },
        { label: 'Bug List', path: '/bugs', icon: ListTodo },
        { label: 'Profile', path: '/profile', icon: User }
      ];
    }

    return [];
  };

  const menuItems = getMenuItems();

  const isLinkActive = (path) => {
    const currentPath = location.pathname + location.search;
    if (path.includes('?')) {
      return currentPath === path;
    }
    return location.pathname === path && !location.search;
  };

  const closeMobileSidebar = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="sidebar-backdrop" onClick={closeMobileSidebar}></div>
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-brand" onClick={closeMobileSidebar}>
            <div className="brand-icon">
              <Bug size={22} />
            </div>
            {(!isCollapsed || isMobileOpen) && <span className="brand-text">BugTracker</span>}
          </Link>

          {/* Mobile Close Button */}
          <button className="btn-mobile-close" onClick={closeMobileSidebar} aria-label="Close Sidebar">
            <X size={20} />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            className="btn-sidebar-toggle" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">
            {(!isCollapsed || isMobileOpen) && <span>MAIN NAVIGATION</span>}
          </div>

          <ul className="nav-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isLinkActive(item.path);

              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-menu-link ${active ? 'active' : ''}`}
                    onClick={closeMobileSidebar}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="menu-icon">
                      <Icon size={20} />
                    </span>
                    {(!isCollapsed || isMobileOpen) && <span className="menu-label">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer / User Profile snippet & Logout */}
        <div className="sidebar-footer">
          <div className="user-mini-profile">
            <div className="user-avatar-circle">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <div className="user-details">
                <span className="user-details-name">{user.name}</span>
                <span className={`role-badge role-${user.role}`}>
                  {user.role.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <button onClick={handleLogout} className="btn-sidebar-logout" title="Logout">
            <LogOut size={18} />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
