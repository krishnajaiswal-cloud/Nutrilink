import { ArrowDownRight, ArrowUpRight, ChevronRight, CircleHelp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function PageHeading({ eyebrow, title, description, actions }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="heading-actions">{actions}</div>}</div>;
}

export function SummaryCard({ label, value, detail, icon: Icon, tone = 'teal', trend }) {
  return <div className="summary-card">
    <div className={`summary-icon ${tone}`}>{Icon && <Icon size={19} />}</div>
    {trend && <span className={`summary-trend ${trend.direction || 'up'}`}>{trend.direction === 'down' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{trend.label}</span>}
    <div className="summary-value">{value}</div><div className="summary-label">{label}</div>
    {detail && <div className="summary-detail">{detail}</div>}
  </div>;
}

export function RiskBadge({ risk }) {
  const style = risk === 'High' ? 'danger' : risk === 'Moderate' ? 'warning' : risk === 'Low' ? 'success' : 'neutral';
  return <span className={`badge ${style}`}><i />{risk}{risk === 'Insufficient data' ? '' : ' risk'}</span>;
}

export function StatusBadge({ status }) {
  const style = /verified|completed|improving/i.test(status) ? 'success' : /overdue|deteriorating|high/i.test(status) ? 'danger' : /pending|progress|upcoming|moderate/i.test(status) ? 'warning' : 'neutral';
  return <span className={`badge ${style}`}><i />{status}</span>;
}

export function SectionTitle({ title, description, link, to = '/children' }) {
  return <div className="section-title"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{link && <Link className="text-link" to={to}>{link}<ChevronRight size={15} /></Link>}</div>;
}

export function FieldLabel({ children, hint }) {
  return <label className="field-label">{children}{hint && <span title={hint}><CircleHelp size={13} /></span>}</label>;
}
