# Nutrilink

## Frontend demonstration prototype

NutriLink is a frontend-only nutrition monitoring prototype built with React, Vite, React Router, Tailwind CSS, Chart.js and Lucide icons. It uses fictional records and local browser storage to demonstrate five role views and the child follow-up workflow. It does not include a backend, authentication, government integration or machine-learning model.

## Run locally

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

## Deployment

Deploy the Vite project to Vercel, Netlify, or Render with `npm run build` as the build command and `dist` as the output directory. The included `vercel.json`, `netlify.toml`, and `render.yaml` configure SPA rewrites so React Router child routes work after refresh. On Render, create a Blueprint from this repository and use the included `render.yaml`.

## Prototype data and health references

- All child names, measurements, centre records, intervention delivery logs, follow-ups, alerts and administrative metrics are fictional demonstration data.
- Assessment labels and WAZ/HAZ/WHZ values are illustrative placeholders, not clinically validated calculations.
- No WHO reference dataset is included in the project. Growth-chart reference lines are labelled illustrative placeholders and must not be presented as WHO standards.
- Prediction labels are simulated demonstrations; no AI/ML prediction runs.
- Baseline-to-follow-up comparisons describe measurement changes and do not attribute an outcome to an intervention.
- Intervention completion and verification are separate editable local demo statuses. Supplementary nutrition delivery records are synthetic.
- Role selection and edits are saved in the current browser's localStorage. They do not sync across devices or represent real records.

## Demonstration workflows

- Select any of the five roles at login or switch roles in the top navigation. All roles use the same synthetic source records.
- Search/filter children, inspect a child profile, compare first/latest recorded measurements and review the growth history.
- Edit intervention completion and verification separately; mark health and outcome follow-ups complete; update administrative action statuses.
- Use the Early warning page to inspect simulated risk signals and proposed human-review actions.

This prototype is for product demonstration only and must not be used for clinical or programme decisions.
