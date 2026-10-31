import { useContext, useMemo, useState } from 'react';
import { ClipboardCheck, PackageCheck, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoContext } from '../App';
import { formatDate } from '../utils/formatters';
import { PageHeading, SectionTitle, StatusBadge, SummaryCard } from '../components/UI';

export function InterventionsPage() {
  const { children, interventions, updateIntervention } = useContext(DemoContext);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All intervention types');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const rows = useMemo(() => interventions.filter((item) => {
    const child = children.find((record) => record.id === item.childId);
    return `${item.childId} ${child?.name} ${item.type} ${item.assignedTo}`.toLowerCase().includes(query.toLowerCase())
      && (typeFilter === 'All intervention types' || item.type === typeFilter)
      && (statusFilter === 'All statuses' || item.status === statusFilter || item.verification === statusFilter);
  }), [children, interventions, query, statusFilter, typeFilter]);
  const delivered = interventions.filter((item) => item.type === 'Supplementary nutrition').length;
  const verified = interventions.filter((item) => item.verification === 'Verified').length;
  const awaiting = interventions.filter((item) => item.verification === 'Pending verification').length;

  return <div>
    <PageHeading eyebrow="DELIVERY & VERIFICATION" title="Intervention management" description="Track assignment, delivery completion and independent verification as distinct steps. Status edits are saved locally for this browser demo." />
    <div className="summary-grid count-3">
      <SummaryCard icon={ClipboardCheck} label="Interventions in dataset" value={interventions.length} detail="Across shared synthetic child records" tone="teal" />
      <SummaryCard icon={PackageCheck} label="Supplementary nutrition" value={delivered} detail="Delivery entries shown in the table" tone="amber" />
      <SummaryCard icon={ShieldCheck} label="Awaiting verification" value={awaiting} detail={`${verified} marked verified`} tone="blue" />
    </div>
    <section className="panel table-panel">
      <SectionTitle title="Intervention register" description="Update each status using the controls. Verification does not automatically follow completion." />
      <div className="toolbar-inner"><label className="search-field compact-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search child, type or worker…" /></label>
        <select className="select-control" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option>All intervention types</option>{[...new Set(interventions.map((item) => item.type))].map((type) => <option key={type}>{type}</option>)}</select>
        <select className="select-control" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option>{['Assigned', 'In progress', 'Completed', 'Pending verification', 'Verified'].map((status) => <option key={status}>{status}</option>)}</select>
        <span className="result-count">{rows.length} records</span>
      </div>
      <div className="table-scroll"><table><thead><tr><th>Child / ID</th><th>Intervention</th><th>Assigned worker</th><th>Assigned / due</th><th>Delivery evidence</th><th>Completion</th><th>Verification</th></tr></thead><tbody>{rows.map((item) => {
        const child = children.find((record) => record.id === item.childId);
        return <tr key={item.id}><td><Link className="child-link" to={`/children/${item.childId}`}><strong>{child?.name}</strong><small>{item.childId} · {item.id}</small></Link></td><td><strong className="table-strong">{item.type}</strong><small className="table-sub">{item.delivery}</small></td><td>{item.assignedTo}</td><td>Assigned {formatDate(item.assigned)}<small className="table-sub">Due {formatDate(item.due)}</small></td><td className="wrap-cell">{item.evidence}</td><td><select className="status-select" value={item.status} aria-label={`Completion status for ${item.id}`} onChange={(event) => updateIntervention(item.id, { status: event.target.value })}><option>Assigned</option><option>In progress</option><option>Completed</option></select><div className="status-preview"><StatusBadge status={item.status} /></div></td><td><select className="status-select" value={item.verification} aria-label={`Verification status for ${item.id}`} onChange={(event) => updateIntervention(item.id, { verification: event.target.value })}><option>Not required</option><option>Pending verification</option><option>Verified</option></select><div className="status-preview"><StatusBadge status={item.verification} /></div></td></tr>;
      })}{!rows.length && <tr><td colSpan="7" className="empty-row">No interventions match the current search and filters.</td></tr>}</tbody></table></div>
      <div className="disclaimer-strip compact-disclaimer"><ShieldCheck size={16} /><span>Supplementary nutrition rows are synthetic delivery-log examples. A marked completion is not proof of receipt; verification is modelled separately.</span></div>
    </section>
  </div>;
}
