import { useContext, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, CalendarClock, CircleHelp, ClipboardCheck, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoContext } from '../App';
import { formatAge, getOutcome } from '../utils/formatters';
import { BaselineFollowupChart } from '../components/Charts';
import { PageHeading, RiskBadge, SectionTitle, StatusBadge, SummaryCard } from '../components/UI';

export function OutcomesPage() {
  const { children, interventions, followUps, escalations, createEscalation, updateEscalation } = useContext(DemoContext);
  const [filter, setFilter] = useState('All outcomes');
  const enriched = useMemo(() => children.map((child) => ({ ...child, outcome: getOutcome(child) })), [children]);
  const visible = enriched.filter((child) => filter === 'All outcomes' || child.outcome === filter);
  const improving = enriched.filter((child) => child.outcome === 'Improving').length;
  const reassessment = followUps.filter((item) => item.status === 'Overdue').length;
  const overdue = followUps.filter((item) => item.status === 'Overdue').length;
  const pendingOutcomes = interventions.filter((item) => item.status === 'Completed' && followUps.some((visit) => visit.childId === item.childId && visit.status !== 'Completed')).length;

  return <div>
    <PageHeading eyebrow="OUTCOME FEEDBACK LOOP" title="Outcome monitoring" description="Compare recorded baseline and latest measurements, then use the observed result to prioritize reassessment. Change does not prove intervention impact." actions={<span className="observational-pill"><CircleHelp size={15} /> Observational comparison</span>} />
    <div className="summary-grid count-4">
      <SummaryCard icon={Activity} label="Improving trend" value={improving} detail="Observed demo measurement change" tone="green" />
      <SummaryCard icon={AlertTriangle} label="Reassessment needed" value={reassessment} detail="Overdue outcome checks" tone="coral" />
      <SummaryCard icon={CalendarClock} label="Overdue follow-ups" value={overdue} detail="Across shared synthetic dataset" tone="amber" />
      <SummaryCard icon={ClipboardCheck} label="Completed, outcome pending" value={pendingOutcomes} detail="Delivery completed; outcome not closed" tone="blue" />
    </div>
    <div className="dashboard-grid">
      <section className="panel wide-panel"><SectionTitle title="Baseline and latest weight comparison" description="Recorded values for children with sufficient demo measurements" /><BaselineFollowupChart children={children} /><div className="chart-caption">Each pair compares first and latest recorded weight. It is not a causal intervention evaluation.</div></section>
      <section className="panel"><SectionTitle title="Outcome categories" description="Calculated as a simple synthetic trend classification" />
        <div className="outcome-category-list">{['Improving', 'Stable', 'Deteriorating', 'Insufficient data'].map((status) => <div key={status}><StatusBadge status={status} /><strong>{enriched.filter((child) => child.outcome === status).length}</strong></div>)}</div>
        <div className="label-notice">Outcome status is descriptive and illustrative; it is not clinically validated.</div>
      </section>
    </div>
    <section className="panel escalation-panel"><SectionTitle title="Outcome-triggered reassessment & escalation" description="Escalate a deteriorating/high-risk outcome or overdue reassessment to human health-worker review." /><div className="escalation-grid">
      <div className="escalation-candidates">{enriched.filter((child) => child.outcome === 'Deteriorating' || child.risk === 'High' || followUps.some((item) => item.childId === child.id && item.status === 'Overdue')).map((child) => {
        const existing = escalations.find((item) => item.childId === child.id && item.status !== 'Resolved');
        const reason = child.outcome === 'Deteriorating' ? 'Deteriorating observed outcome' : child.risk === 'High' ? 'High-priority nutritional assessment' : 'Overdue reassessment';
        return <div className="escalation-candidate" key={child.id}><span className="escalation-icon"><ShieldAlert size={16} /></span><div className="escalation-copy"><strong>{child.name}</strong><small>{reason} · {child.id}</small></div>{existing ? <StatusBadge status={existing.status} /> : <button className="button button-small button-secondary" onClick={() => createEscalation(child.id, reason)}>Escalate for review</button>}</div>;
      })}</div>
      <div className="escalation-register"><div className="register-heading"><strong>Health-worker review queue</strong><span>{escalations.filter((item) => item.status !== 'Resolved').length} open</span></div>
        {escalations.length ? escalations.map((item) => {
          const child = children.find((record) => record.id === item.childId);
          return <div className="escalation-row" key={item.id}><div><Link className="child-link" to={`/children/${item.childId}`}><strong>{child?.name}</strong></Link><small>{item.reason} · {item.assignedTo}</small></div><select className="status-select" value={item.status} aria-label={`Escalation status for ${item.id}`} onChange={(event) => updateEscalation(item.id, event.target.value)}><option>Pending</option><option>In progress</option><option>Resolved</option></select></div>;
        }) : <p className="empty-register">No escalations created. Create one from an eligible case.</p>}
      </div>
    </div><div className="label-notice">Escalations are frontend-only workflow records. They do not contact a health worker or public service.</div></section>
    <section className="panel table-panel"><SectionTitle title="Baseline-to-follow-up review" description="Review nutritional condition, measurements and intervention/follow-up progress per child." />
      <div className="toolbar-inner"><select className="select-control" value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter outcome category"><option>All outcomes</option>{['Improving', 'Stable', 'Deteriorating', 'Insufficient data'].map((status) => <option key={status}>{status}</option>)}</select><span className="result-count">{visible.length} children</span></div>
      <div className="table-scroll"><table><thead><tr><th>Child</th><th>Age</th><th>Baseline condition</th><th>Latest condition</th><th>Weight: base → latest</th><th>Height: base → latest</th><th>Outcome</th><th>Intervention / follow-up</th></tr></thead><tbody>{visible.map((child) => {
        const base = child.measurements[0];
        const current = child.measurements.at(-1);
        const dWeight = Number((current.weight - base.weight).toFixed(1));
        const intervention = interventions.find((item) => item.childId === child.id);
        const follow = followUps.find((item) => item.childId === child.id && item.status !== 'Completed');
        return <tr key={child.id}><td><Link className="child-link" to={`/children/${child.id}`}><strong>{child.name}</strong><small>{child.id}</small></Link></td><td>{formatAge(child.ageMonths)}</td><td>{child.baselineStatus}</td><td>{child.latestStatus}</td><td>{child.risk === 'Insufficient data' ? 'Unavailable' : <span className={dWeight >= 0 ? 'metric-positive' : 'metric-negative'}>{base.weight.toFixed(1)} → {current.weight.toFixed(1)} kg {dWeight >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{dWeight > 0 ? '+' : ''}{dWeight}</span>}</td><td>{child.risk === 'Insufficient data' ? 'Unavailable' : `${base.height.toFixed(1)} → ${current.height.toFixed(1)} cm`}</td><td><StatusBadge status={child.outcome} /></td><td><div className="status-stack">{intervention ? <StatusBadge status={intervention.status} /> : <span className="muted">No intervention</span>}{follow ? <StatusBadge status={follow.status} /> : <span className="muted">Follow-up complete</span>}</div></td></tr>;
      })}</tbody></table></div>
      <div className="disclaimer-strip compact-disclaimer"><CircleHelp size={16} /><span>Baseline/latest values come from the same synthetic demo records. A measurement change alone does not establish that an intervention caused improvement or deterioration.</span></div>
    </section>
  </div>;
}
