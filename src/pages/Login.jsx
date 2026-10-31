import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, BadgeCheck, LockKeyhole } from 'lucide-react';
import { DemoContext } from '../App';
import { roles } from '../data/demoData';

export function Login() {
  const { setRole } = useContext(DemoContext);
  const [selected, setSelected] = useState('worker');
  const navigate = useNavigate();
  const enterDemo = (event) => {
    event.preventDefault();
    setRole(selected);
    navigate('/dashboard');
  };
  return <main className="login-page">
    <div className="login-brand"><span className="brand-mark"><Activity size={21} /></span><strong>NutriLink</strong><span className="prototype-tag">DEMO PROTOTYPE</span></div>
    <div className="login-content">
      <div className="login-copy"><div className="eyebrow">NUTRITION MONITORING · INDIA</div><h1>Better growth starts with better follow-through.</h1><p>A unified demonstration workspace for child growth monitoring, intervention delivery and outcome reassessment.</p>
        <div className="login-highlights"><span><BadgeCheck size={17} /> Shared demonstration dataset</span><span><LockKeyhole size={17} /> No real authentication or health records</span></div>
        <div className="login-stats"><div><strong>05</strong><span>role views</span></div><div><strong>10</strong><span>demo profiles</span></div><div><strong>100%</strong><span>synthetic data</span></div></div>
      </div>
      <form className="login-card" onSubmit={enterDemo}>
        <div className="card-kicker">WELCOME TO THE DEMO</div><h2>Choose your workspace</h2><p>Select a role to preview the relevant dashboard and workflows.</p>
        <label className="field-label" htmlFor="role">Demonstration role</label>
        <select id="role" className="select-control login-select" value={selected} onChange={(event) => setSelected(event.target.value)}>
          {roles.map((role) => <option value={role.id} key={role.id}>{role.name} — {role.scope}</option>)}
        </select>
        <button className="button button-primary login-submit" type="submit">Enter demonstration <ArrowRight size={17} /></button>
        <div className="login-disclaimer">Prototype only · Not for clinical or administrative decision-making</div>
      </form>
    </div>
    <div className="login-footer"><span>NutriLink · Techfest 2026–27 India @ 71/100 Challenge</span><span>Frontend-only demonstration</span></div>
  </main>;
}
