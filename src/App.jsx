import { createContext, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { actions, children, followUps, interventions, roles } from './data/demoData';
import { loadDemoState, saveDemoState } from './utils/storage';
import { DashboardLayout } from './components/DashboardLayout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { ChildrenPage, ChildProfile } from './pages/Children';
import { AlertsPage } from './pages/Alerts';
import { InterventionsPage } from './pages/Interventions';
import { OutcomesPage } from './pages/Outcomes';
import { HealthPage } from './pages/Health';
import { AdminPage } from './pages/Admin';

export const DemoContext = createContext(null);

export default function App() {
  const saved = useMemo(loadDemoState, []);
  const [roleId, setRoleId] = useState(saved.roleId || '');
  const [interventionRecords, setInterventionRecords] = useState(saved.interventionRecords || interventions);
  const [followUpRecords, setFollowUpRecords] = useState(saved.followUpRecords || followUps);
  const [adminActions, setAdminActions] = useState(saved.adminActions || actions);
  const [escalationRecords, setEscalationRecords] = useState(saved.escalationRecords || []);

  const persist = (updates) => saveDemoState({
    roleId,
    interventionRecords,
    followUpRecords,
    adminActions,
    escalationRecords,
    ...updates,
  });
  const setRole = (id) => {
    setRoleId(id);
    persist({ roleId: id });
  };
  const updateIntervention = (id, patch) => {
    const updated = interventionRecords.map((record) => record.id === id ? { ...record, ...patch } : record);
    setInterventionRecords(updated);
    persist({ interventionRecords: updated });
  };
  const updateFollowUp = (id, patch) => {
    const updated = followUpRecords.map((record) => record.id === id ? { ...record, ...patch } : record);
    setFollowUpRecords(updated);
    persist({ followUpRecords: updated });
  };
  const updateAction = (id, status) => {
    const updated = adminActions.map((action) => action.id === id ? { ...action, status } : action);
    setAdminActions(updated);
    persist({ adminActions: updated });
  };
  const createEscalation = (childId, reason) => {
    if (escalationRecords.some((item) => item.childId === childId && item.status !== 'Resolved')) return;
    const updated = [...escalationRecords, {
      id: `ESC-${Date.now()}`,
      childId,
      reason,
      assignedTo: 'ANM / Health Worker',
      created: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    }];
    setEscalationRecords(updated);
    persist({ escalationRecords: updated });
  };
  const updateEscalation = (id, status) => {
    const updated = escalationRecords.map((item) => item.id === id ? { ...item, status } : item);
    setEscalationRecords(updated);
    persist({ escalationRecords: updated });
  };

  const value = {
    roleId,
    setRole,
    role: roles.find((item) => item.id === roleId) || roles[0],
    children,
    interventions: interventionRecords,
    followUps: followUpRecords,
    actions: adminActions,
    escalations: escalationRecords,
    updateIntervention,
    updateFollowUp,
    updateAction,
    createEscalation,
    updateEscalation,
  };

  return (
    <DemoContext.Provider value={value}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={roleId ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/children" element={<ChildrenPage />} />
          <Route path="/children/:childId" element={<ChildProfile />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/interventions" element={<InterventionsPage />} />
          <Route path="/outcomes" element={<OutcomesPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        <Route path="*" element={<Navigate to={roleId ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </DemoContext.Provider>
  );
}
