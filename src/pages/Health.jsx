import { useContext, useMemo, useState } from 'react';
import { CalendarClock, CheckCircle2, HeartPulse, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoContext } from '../App';
import { formatDate } from '../utils/formatters';
import { PageHeading, SectionTitle, StatusBadge, SummaryCard } from '../components/UI';

export function HealthPage() {
  const { children, interventions, followUps, updateFollowUp } = useContext(DemoContext);
  const [filter, setFilter] = useState('Open health tasks');
  const healthRecords = interventions.filter((item) => item.type === 'Health assessment' || item.type === 'Medical referral');
  const visibleFollowups = useMemo(() => followUps.filter((item) => {
    const child = children.find((record) => record.id === item.childId);
    const related = healthRecords.some((record) => record.childId === item.childId);
    return filter === 'All follow-ups' || (filter === 'Open health tasks' && item.status !== 'Completed' && related) || (filter === 'All open tasks' && item.status !== 'Completed');
  }), [children, filter, followUps, healthRecords]);
  const openAssessments = healthRecords.filter((item) => item.status !== 'Completed').length;
  const referrals = healthRecords.filter((item) => item.type === 'Medical referral').length;
  const pending = followUps.filter((item) => item.status !== 'Completed').length;

  return <div>
    <PageHeading eyebrow="ANM / HEALTH WORKER WORKSPACE" title="Health assessments & follow-ups" description="Review referral and assessment tasks, then update follow-up status for the shared synthetic records." />
    <div className="summary-grid count-3"><SummaryCard icon={Stethoscope} label="Open health assessments" value={openAssessments} detail="Assessment or referral not complete" tone="blue" /><SummaryCard icon={HeartPulse} label="Medical referral records" value={referrals} detail="Synthetic demonstration entries" tone="coral" /><SummaryCard icon={CalendarClock} label="Open follow-ups" value={pending} detail="Pending, upcoming or overdue" tone="amber" /></div>
    <div className="dashboard-grid">
      <section className="panel wide-panel"><SectionTitle title="Health assessment and referral history" description="Update completion on a linked follow-up below." />
        <div className="history-list">{healthRecords.map((record) => {
          const child = children.find((item) => item.id === record.childId);
          const related = followUps.find((item) => item.childId === record.childId);
          return <div className="history-row" key={record.id}><span className="history-mark"><HeartPulse size={16} /></span><div className="history-copy"><strong>{record.type} · {child?.name}</strong><span>{record.delivery}</span><small>{record.id} · Assigned {formatDate(record.assigned)} · Due {formatDate(record.due)}</small></div><StatusBadge status={record.status} />{related && <StatusBadge status={related.status} />}</div>;
        })}</div>
      </section>
      <section className="panel"><SectionTitle title="Clinical hand-off reminder" description="This prototype does not replace health services." /><div className="health-reminder"><HeartPulse size={21} /><strong>Human review required</strong><p>Confirm measurements, assess the child in person and follow approved referral protocols. Synthetic alerts do not determine treatment.</p></div><div className="label-notice">No facility, RCH or POSHAN Tracker connection is configured.</div></section>
    </div>
    <section className="panel table-panel"><SectionTitle title="Follow-up worklist" description="Mark a follow-up complete to demonstrate outcome loop closure." />
      <div className="toolbar-inner"><select className="select-control" value={filter} onChange={(event) => setFilter(event.target.value)}><option>Open health tasks</option><option>All open tasks</option><option>All follow-ups</option></select><span className="result-count">{visibleFollowups.length} items</span></div>
      <div className="table-scroll"><table><thead><tr><th>Child</th><th>Follow-up type</th><th>Owner</th><th>Due date</th><th>Status</th><th>Workflow action</th></tr></thead><tbody>{visibleFollowups.map((item) => {
        const child = children.find((record) => record.id === item.childId);
        return <tr key={item.id}><td><Link className="child-link" to={`/children/${item.childId}`}><strong>{child?.name}</strong><small>{item.childId}</small></Link></td><td>{item.type}</td><td>{item.owner}</td><td>{formatDate(item.due)}</td><td><StatusBadge status={item.status} /></td><td>{item.status === 'Completed' ? <span className="completed-text"><CheckCircle2 size={15} /> Closed</span> : <button className="button button-small button-secondary" onClick={() => updateFollowUp(item.id, { status: 'Completed' })}>Mark complete</button>}</td></tr>;
      })}{!visibleFollowups.length && <tr><td className="empty-row" colSpan="6">No follow-ups in this view.</td></tr>}</tbody></table></div>
    </section>
  </div>;
}
