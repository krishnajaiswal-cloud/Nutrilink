import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, Bell, ClipboardCheck, HeartPulse, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, Users, X } from 'lucide-react';
import { DemoContext } from '../App';
import { roles } from '../data/demoData';
import { useState } from 'react';

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/children', label: 'Children', icon: Users },
  { to: '/alerts', label: 'Early warning', icon: Bell },
  { to: '/interventions', label: 'Interventions', icon: ClipboardCheck },
  { to: '/outcomes', label: 'Outcome feedback', icon: Activity },
  { to: '/health', label: 'Health follow-ups', icon: HeartPulse },
  { to: '/admin', label: 'Administration', icon: ShieldCheck },
];

export function DashboardLayout() {
  const { role, setRole, children } = useContext(DemoContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const openAlerts = children.filter((child) => child.risk === 'High').length;
  const signOut = () => {
    setRole('');
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><Activity size={21} /></span>
          <span><strong>NutriLink</strong><small>Nutrition monitoring</small></span>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Early warning' && <span className="nav-count">{openAlerts}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="prototype-note"><span className="status-dot" /> Prototype environment <small>Synthetic demo dataset</small></div>
          <button className="nav-link signout" onClick={signOut}><LogOut size={18} /><span>Exit demo</span></button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={21} /></button>
          <div className="crumb"><span>NutriLink</span><span className="crumb-divider">/</span><strong>{role.name}</strong></div>
          <div className="topbar-right">
            <div className="demo-pill"><span /> DEMO MODE</div>
            <label className="role-picker"><span>Viewing as</span>
              <select value={role.id} onChange={(event) => setRole(event.target.value)} aria-label="Switch demonstration role">
                {roles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
              </select>
            </label>
            <div className="avatar">{role.name.split(' ').map((word) => word[0]).slice(0, 2).join('')}</div>
          </div>
        </header>
        <main className="content"><Outlet /></main>
        <footer className="app-footer"><span>NutriLink · Hackathon demonstration prototype</span><span>All records and predictions shown are synthetic</span></footer>
      </div>
    </div>
  );
}
