import { useContext, useMemo } from 'react';
import { Activity, AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, HeartPulse, MapPin, Scale, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoContext } from '../App';
import { centres, alerts } from '../data/demoData';
import { formatAge, getOutcome } from '../utils/formatters';
import { CentreChart, OutcomeChart, RiskChart } from '../components/Charts';
import { PageHeading, RiskBadge, SectionTitle, StatusBadge, SummaryCard } from '../components/UI';

const roleTitle = {
  worker: 'Anganwadi centre overview',
  anm: 'Community health overview',
  supervisor: 'Centre supervision overview',
  cdpo: 'Block administration overview',
  collector: 'District nutrition overview',
};

export function Overview() {
  const { role, children, interventions, followUps, actions } = useContext(DemoContext);
  const enriched = useMemo(() => children.map((child) => ({ ...child, outcome: getOutcome(child) })), [children]);
  const high = children.filter((child) => child.risk === 'High').length;
  const needsAssessment = children.filter((child) => child.risk === 'High' || child.risk === 'Moderate' || child.risk === 'Insufficient data').length;
  const pendingVerification = interventions.filter((item) => item.verification === 'Pending verification').length;
  const pendingFollowups = followUps.filter((item) => item.status !== 'Completed').length;
  const verified = interventions.filter((item) => item.verification === 'Verified').length;
  const outcomeCount = enriched.filter((child) => child.outcome === 'Improving').length;

  const cardsByRole = {
    worker: [
      [Users, 'Registered children', children.length, 'Across all synthetic demo centres', 'teal'],
      [Scale, 'Assessment needed', needsAssessment, 'Moderate, high risk or missing data', 'amber'],
      [AlertTriangle, 'High-priority cases', high, 'Require timely review', 'coral'],
      [CalendarClock, 'Pending follow-ups', pendingFollowups, 'Open or due reassessments', 'blue'],
      [ShieldCheck, 'Need verification', pendingVerification, 'Measurements or delivery records', 'purple'],
    ],
    anm: [
      [HeartPulse, 'Health assessments', children.filter((child) => child.risk === 'High' || child.risk === 'Insufficient data').length, 'High risk or unverified records', 'coral'],
      [ClipboardCheck, 'Medical referrals', interventions.filter((item) => item.type === 'Medical referral').length, 'Assigned across demo centres', 'blue'],
      [CalendarClock, 'Upcoming / open visits', pendingFollowups, 'Health follow-ups to review', 'amber'],
      [ShieldCheck, 'Awaiting verification', pendingVerification, 'Assessment and referral updates', 'purple'],
    ],
    supervisor: [
      [MapPin, 'Anganwadi centres', centres.length, 'Across North, Central and South blocks', 'teal'],
      [ShieldCheck, 'Pending verification', pendingVerification, 'Delivery and data checks', 'amber'],
      [AlertTriangle, 'Reassessment needed', high, 'High-priority child records', 'coral'],
      [ClipboardCheck, 'Verified interventions', verified, 'Of assigned demo records', 'blue'],
    ],
    cdpo: [
      [AlertTriangle, 'High-risk children', high, 'Across the shared demo district', 'coral'],
      [MapPin, 'Centres in block view', centres.length, 'Synthetic cross-centre overview', 'teal'],
      [ClipboardCheck, 'Interventions open', interventions.filter((item) => item.status !== 'Completed').length, 'Assigned or in progress', 'amber'],
      [CalendarClock, 'Administrative actions', actions.filter((item) => item.status !== 'Completed').length, 'Open decisions and actions', 'purple'],
    ],
    collector: [
      [MapPin, 'Anganwadi centres', centres.length, 'Across the demonstration district', 'teal'],
      [Users, 'Registered children', children.length, 'Synthetic district sample', 'blue'],
      [AlertTriangle, 'Children needing attention', needsAssessment, 'Assessment or data verification needed', 'coral'],
      [Activity, 'Improving outcomes', outcomeCount, 'Observed measurement trend, not attribution', 'green'],
      [ClipboardCheck, 'Open interventions', interventions.filter((item) => item.status !== 'Completed').length, 'Across all demo centres', 'amber'],
    ],
  };
  const cards = cardsByRole[role.id] || cardsByRole.worker;
  const recent = [...children].filter((child) => child.risk === 'High' || child.risk === 'Insufficient data').slice(0, 4);

  return <div>
    <PageHeading eyebrow={`${role.scope.toUpperCase()} · DEMONSTRATION VIEW`} title={roleTitle[role.id] || roleTitle.worker} description="One shared synthetic dataset keeps child records, interventions and outcome views consistent across roles." actions={<Link className="button button-secondary" to="/children">View child directory <ArrowRight size={16} /></Link>} />
    <div className={`summary-grid count-${cards.length}`}>{cards.map(([icon, label, value, detail, tone]) => <SummaryCard key={label} icon={icon} label={label} value={value} detail={detail} tone={tone} />)}</div>
    <div className="dashboard-grid main-grid">
      <section className="panel"><SectionTitle title="Nutritional risk distribution" description="Current demo assessment category · children" /><div className="risk-chart-area"><RiskChart children={children} /><div className="risk-legend">{[['High', 'danger'], ['Moderate', 'warning'], ['Low', 'success'], ['Insufficient data', 'neutral']].map(([label, tone]) => <div key={label}><span className={`legend-dot ${tone}`} />{label}<b>{children.filter((child) => child.risk === label).length}</b></div>)}</div></div><div className="chart-caption">Synthetic classifications for demonstration; not a clinical diagnosis.</div></section>
      <section className="panel"><SectionTitle title="Needs your attention" description="Priority alerts based on the demonstration records" link="See all alerts" to="/alerts" /><div className="attention-list">{recent.map((child) => {
        const alert = alerts.find((item) => item.childId === child.id);
        return <Link key={child.id} to={`/children/${child.id}`} className="attention-row"><span className={`attention-icon ${child.risk === 'High' ? 'danger' : 'warning'}`}><AlertTriangle size={17} /></span><span className="attention-copy"><strong>{child.name}</strong><small>{alert?.action || child.note}</small></span><RiskBadge risk={child.risk} /></Link>;
      })}</div></section>
      <section className="panel wide-panel"><SectionTitle title="Centre-wise delivery performance" description="Task completion and intervention verification · illustrative demo values" link={role.id === 'collector' ? 'Open administration' : 'Manage interventions'} to={role.id === 'collector' ? '/admin' : '/interventions'} /><CentreChart /></section>
      <section className="panel"><SectionTitle title="Outcome snapshot" description="Calculated from recorded demo baseline and latest measurements" link="Review outcomes" to="/outcomes" /><OutcomeChart children={enriched} /><div className="chart-caption">Observed trend only; this does not establish an intervention effect.</div></section>
    </div>
    <section className="panel table-panel"><SectionTitle title="Children needing attention" description="Prioritize timely reassessment and data verification" link="Open child directory" to="/children" /><div className="table-scroll"><table><thead><tr><th>Child</th><th>Age</th><th>Centre</th><th>Latest assessment</th><th>Risk</th><th>Follow-up</th><th></th></tr></thead><tbody>{recent.map((child) => {
      const follow = followUps.find((item) => item.childId === child.id && item.status !== 'Completed');
      return <tr key={child.id}><td><Link className="child-link" to={`/children/${child.id}`}><strong>{child.name}</strong><small>{child.id}</small></Link></td><td>{formatAge(child.ageMonths)}</td><td>{centres.find((item) => item.id === child.centreId)?.name}</td><td>{child.latestStatus}</td><td><RiskBadge risk={child.risk} /></td><td>{follow ? <StatusBadge status={follow.status} /> : <span className="muted">No open follow-up</span>}</td><td><Link className="row-link" to={`/children/${child.id}`}>Open <ArrowRight size={14} /></Link></td></tr>;
    })}</tbody></table></div></section>
    <div className="disclaimer-strip"><ShieldCheck size={16} /><span><strong>Demonstration notice:</strong> Names, measurements, trend classifications, centre figures and simulated risk alerts are fictional. No live government systems or clinical rules are connected.</span></div>
  </div>;
}
