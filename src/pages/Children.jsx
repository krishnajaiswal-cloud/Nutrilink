import { useContext, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowDownRight, ArrowLeft, ArrowUpRight, CalendarDays, ClipboardCheck, HeartPulse, Ruler, Scale, ShieldCheck, UserRound } from 'lucide-react';
import { DemoContext } from '../App';
import { alerts, centres } from '../data/demoData';
import { formatAge, formatDate, getOutcome, getTrend } from '../utils/formatters';
import { TrendChart } from '../components/Charts';
import { PageHeading, RiskBadge, SectionTitle, StatusBadge } from '../components/UI';

export function ChildrenPage() {
  const { children } = useContext(DemoContext);
  const [query, setQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All risk levels');
  const [sortBy, setSortBy] = useState('name');
  const filtered = useMemo(() => children
    .filter((child) => `${child.id} ${child.name} ${child.centreId}`.toLowerCase().includes(query.toLowerCase()))
    .filter((child) => riskFilter === 'All risk levels' || child.risk === riskFilter)
    .sort((a, b) => sortBy === 'risk' ? ['High', 'Moderate', 'Low', 'Insufficient data'].indexOf(a.risk) - ['High', 'Moderate', 'Low', 'Insufficient data'].indexOf(b.risk) : a[sortBy].localeCompare(b[sortBy])), [children, query, riskFilter, sortBy]);

  return <div>
    <PageHeading eyebrow="CHILD RECORDS" title="Child directory" description="Search and filter the shared synthetic child records. Open a profile to review growth history and follow-up." />
    <div className="toolbar panel">
      <label className="search-field"><span className="sr-only">Search child records</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, child ID or centre…" /></label>
      <select className="select-control" value={riskFilter} onChange={(event) => setRiskFilter(event.target.value)} aria-label="Filter by risk"><option>All risk levels</option>{['High', 'Moderate', 'Low', 'Insufficient data'].map((risk) => <option key={risk}>{risk}</option>)}</select>
      <select className="select-control" value={sortBy} onChange={(event) => setSortBy(event.target.value)} aria-label="Sort children"><option value="name">Sort: name</option><option value="id">Sort: ID</option><option value="risk">Sort: risk</option></select>
      <span className="result-count">{filtered.length} children</span>
    </div>
    <section className="panel table-panel"><div className="table-scroll"><table><thead><tr><th>Child</th><th>Age / sex</th><th>Centre</th><th>Weight</th><th>Height</th><th>Latest assessment</th><th>Risk</th><th>Last recorded</th><th></th></tr></thead><tbody>
      {filtered.map((child) => <tr key={child.id}><td><Link className="child-link" to={`/children/${child.id}`}><strong>{child.name}</strong><small>{child.id}</small></Link></td><td>{formatAge(child.ageMonths)}<small className="table-sub">{child.sex}</small></td><td>{centres.find((centre) => centre.id === child.centreId)?.name}</td><td>{child.measurements.at(-1).weight.toFixed(1)} kg</td><td>{child.measurements.at(-1).height.toFixed(1)} cm</td><td>{child.latestStatus}</td><td><RiskBadge risk={child.risk} /></td><td>{formatDate(child.measurements.at(-1).date)}</td><td><Link className="row-link" to={`/children/${child.id}`}>Profile <span aria-hidden>→</span></Link></td></tr>)}
      {!filtered.length && <tr><td className="empty-row" colSpan="9">No children match the selected search and filters.</td></tr>}
    </tbody></table></div></section>
    <div className="disclaimer-strip"><ShieldCheck size={16} /><span>All listed children and health measurements are fictional demonstration records.</span></div>
  </div>;
}

export function ChildProfile() {
  const { childId } = useParams();
  const { children, interventions, followUps, updateFollowUp } = useContext(DemoContext);
  const navigate = useNavigate();
  const child = children.find((item) => item.id === childId);
  if (!child) return <div className="panel not-found"><h2>Child record not found</h2><p>This ID is not in the synthetic demonstration dataset.</p><button className="button button-secondary" onClick={() => navigate('/children')}>Back to directory</button></div>;

  const centre = centres.find((item) => item.id === child.centreId);
  const records = interventions.filter((item) => item.childId === child.id);
  const followup = followUps.find((item) => item.childId === child.id && item.status !== 'Completed');
  const baseline = child.measurements[0];
  const latest = child.measurements.at(-1);
  const weightDelta = Number((latest.weight - baseline.weight).toFixed(1));
  const heightDelta = Number((latest.height - baseline.height).toFixed(1));
  const alert = alerts.find((item) => item.childId === child.id);

  return <div>
    <button className="back-link" onClick={() => navigate('/children')}><ArrowLeft size={16} /> Child directory</button>
    <PageHeading eyebrow={`CHILD PROFILE · ${child.id}`} title={child.name} description={`${formatAge(child.ageMonths)} · ${child.sex} · ${centre?.name || child.centreId}`} actions={<RiskBadge risk={child.risk} />} />
    <div className="profile-summary-grid">
      <div className="profile-id-card"><div className="profile-avatar"><UserRound size={25} /></div><div><strong>{child.name}</strong><span>{child.id}</span></div><div className="profile-id-meta"><span>Anganwadi worker</span><strong>{child.worker}</strong></div><div className="profile-id-meta"><span>Centre</span><strong>{centre?.name || child.centreId}</strong></div><div className="profile-id-meta"><span>Last recorded</span><strong>{formatDate(latest.date)}</strong></div></div>
      <div className="measurement-card"><div className="measure-icon"><Scale size={19} /></div><span>Latest weight</span><strong>{latest.weight.toFixed(1)} <small>kg</small></strong><div className={weightDelta >= 0 ? 'measure-change positive' : 'measure-change negative'}>{weightDelta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{Math.abs(weightDelta).toFixed(1)} kg since baseline</div></div>
      <div className="measurement-card"><div className="measure-icon blue"><Ruler size={19} /></div><span>Latest height</span><strong>{latest.height.toFixed(1)} <small>cm</small></strong><div className="measure-change positive"><ArrowUpRight size={14} />{heightDelta.toFixed(1)} cm since baseline</div></div>
      <div className="measurement-card"><div className="measure-icon amber"><ClipboardCheck size={19} /></div><span>Latest assessment</span><strong className="assessment-value">{child.latestStatus}</strong><div className="measure-change muted">{getOutcome(child)} · demo calculation</div></div>
    </div>
    <div className="dashboard-grid profile-grid">
      <section className="panel wide-panel"><SectionTitle title="Historical weight growth" description="Recorded demo measurements · illustrative reference and prediction shown separately" /><TrendChart child={child} metric="weight" /><div className="chart-caption">Grey curve is a placeholder for illustration, not WHO data. Orange segment is a simulated prediction, not a model output.</div></section>
      <section className="panel wide-panel"><SectionTitle title="Historical height growth" description="Recorded demo measurements · illustrative reference and prediction shown separately" /><TrendChart child={child} metric="height" /><div className="chart-caption">The reference line is illustrative only: the project contains no sourced WHO reference data. The simulated prediction is not a model output.</div></section>
      <section className="panel"><SectionTitle title="Baseline vs latest" description="Observed change across available records" /><div className="compare-metrics"><div><span>Measurement</span><strong>Baseline</strong><strong>Latest</strong><b>Change</b></div><div><span>Weight</span><strong>{baseline.weight.toFixed(1)} kg</strong><strong>{latest.weight.toFixed(1)} kg</strong><b>{weightDelta > 0 ? '+' : ''}{weightDelta} kg</b></div><div><span>Height</span><strong>{baseline.height.toFixed(1)} cm</strong><strong>{latest.height.toFixed(1)} cm</strong><b>+{heightDelta} cm</b></div></div><div className="assessment-box"><strong>Baseline assessment</strong><span>{child.baselineStatus}</span><strong>Latest assessment</strong><span>{child.latestStatus}</span></div><p className="muted small-text">These changes are descriptive only and do not show that an intervention caused a change.</p></section>
      <section className="panel"><SectionTitle title="Nutritional indicators" description="Fictional demo values · not clinically validated" /><div className="indicator-list">{[['Weight-for-Age (WAZ)', child.waz], ['Height-for-Age (HAZ)', child.haz], ['Weight-for-Height (WHZ)', child.whz]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value == null ? 'Not assessed' : `${value > 0 ? '+' : ''}${value.toFixed(1)}`}</strong></div>)}</div><div className="label-notice">Prototype demonstration values. No validated WHO calculation is performed.</div></section>
      <section className="panel"><SectionTitle title="Early warning review" description="Simulated rule-based demo alert" /><div className="alert-detail"><span className="alert-icon"><HeartPulse size={18} /></span><div><strong>{alert?.prediction || 'No current alert'}</strong><p>{alert?.explanation || child.note}</p></div></div><div className="recommended-action"><span>Recommended next action</span><strong>{alert?.action || child.note}</strong></div><div className="label-notice">Simulated demonstration output only · no AI/ML model is connected.</div></section>
      <section className="panel wide-panel"><SectionTitle title="Intervention and follow-up history" description="Delivery status and verification are recorded as separate steps" link="Open interventions" to="/interventions" />
        {records.length ? <div className="history-list">{records.map((record) => <div className="history-row" key={record.id}><span className="history-mark"><ClipboardCheck size={16} /></span><div className="history-copy"><strong>{record.type}</strong><span>{record.delivery}</span><small>{record.id} · Assigned {formatDate(record.assigned)} · Due {formatDate(record.due)}</small></div><StatusBadge status={record.status} /><StatusBadge status={record.verification} /></div>)}</div> : <p className="empty-row">No intervention recorded in this demo.</p>}
        {followup && <div className="followup-action-row"><div><strong>{followup.type}</strong><span>Due {formatDate(followup.due)} · {followup.owner}</span></div><StatusBadge status={followup.status} /><button className="button button-small button-primary" onClick={() => updateFollowUp(followup.id, { status: 'Completed' })}>Mark follow-up complete</button></div>}
      </section>
    </div>
    <div className="disclaimer-strip"><ShieldCheck size={16} /><span><strong>Prototype, not diagnosis:</strong> Nutritional status labels and WAZ/HAZ/WHZ values are synthetic. WHO reference curves are not included in this workspace; chart reference is explicitly illustrative and must not be interpreted as a WHO standard.</span></div>
  </div>;
}
