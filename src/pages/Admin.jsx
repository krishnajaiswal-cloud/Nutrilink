import { useContext } from 'react';
import { ArrowUpRight, ClipboardList, MapPin, ShieldCheck } from 'lucide-react';
import { DemoContext } from '../App';
import { centres } from '../data/demoData';
import { PageHeading, SectionTitle, StatusBadge, SummaryCard } from '../components/UI';
import { CentreChart } from '../components/Charts';

export function AdminPage() {
  const { children, interventions, actions, updateAction } = useContext(DemoContext);
  const unresolved = children.filter((child) => child.risk === 'Insufficient data').length;
  const high = children.filter((child) => child.risk === 'High').length;
  const pendingDelivery = interventions.filter((item) => item.status !== 'Completed').length;
  const verified = interventions.filter((item) => item.verification === 'Verified').length;
  return <div>
    <PageHeading eyebrow="CDPO / DISTRICT ADMINISTRATION" title="Administrative action centre" description="Synthetic cross-centre performance overview, intervention delivery status and demonstration actions." actions={<span className="simulation-pill"><MapPin size={14} /> {centres.length} DEMO CENTRES</span>} />
    <div className="summary-grid count-4"><SummaryCard icon={MapPin} label="Anganwadi centres" value={centres.length} detail="Synthetic district sample" tone="teal" /><SummaryCard icon={ShieldCheck} label="Unresolved data flags" value={unresolved} detail="Insufficient data / verification" tone="amber" /><SummaryCard icon={ClipboardList} label="High-risk cases" value={high} detail="Require timely reassessment" tone="coral" /><SummaryCard icon={ArrowUpRight} label="Verified interventions" value={`${verified} / ${interventions.length}`} detail={`${pendingDelivery} not yet completed`} tone="blue" /></div>
    <div className="dashboard-grid">
      <section className="panel wide-panel"><SectionTitle title="Centre performance comparison" description="Completion and verification percentages are synthetic display values, not calculated operational performance." /><CentreChart /><div className="label-notice">Illustrative centre performance values. No centres or official reporting systems are connected.</div></section>
      <section className="panel"><SectionTitle title="District attention summary" description="Shared synthetic dataset" /><div className="admin-summary-list"><div><span>Children in sample</span><strong>{children.length}</strong></div><div><span>Centres requiring data review</span><strong>{unresolved}</strong></div><div><span>Open intervention records</span><strong>{pendingDelivery}</strong></div><div><span>High-priority cases</span><strong>{high}</strong></div></div></section>
    </div>
    <section className="panel table-panel"><SectionTitle title="Administrative decisions & actions" description="Update action status locally to demonstrate review and accountability." /><div className="table-scroll"><table><thead><tr><th>Action</th><th>Owner</th><th>Recorded date</th><th>Status</th><th>Update</th></tr></thead><tbody>{actions.map((action) => <tr key={action.id}><td><strong className="table-strong">{action.title}</strong><small className="table-sub">{action.id}</small></td><td>{action.owner}</td><td>{action.date}</td><td><StatusBadge status={action.status} /></td><td><select className="status-select" value={action.status} aria-label={`Action status ${action.id}`} onChange={(event) => updateAction(action.id, event.target.value)}><option>Pending</option><option>In progress</option><option>Completed</option></select></td></tr>)}</tbody></table></div></section>
    <div className="disclaimer-strip"><ShieldCheck size={16} /><span>Centre names are synthetic. All administrative metrics are for demonstration only; do not use them for real programme decisions.</span></div>
  </div>;
}
