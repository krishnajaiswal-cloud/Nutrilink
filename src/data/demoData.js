export const roles = [
  { id: 'worker', name: 'Anganwadi Worker', scope: 'Centre operations' },
  { id: 'anm', name: 'ANM / Health Worker', scope: 'Community health' },
  { id: 'supervisor', name: 'Supervisor', scope: 'Cluster oversight' },
  { id: 'cdpo', name: 'CDPO', scope: 'Block administration' },
  { id: 'collector', name: 'District Collector', scope: 'District overview' },
];

export const centres = [
  { id: 'AWC-014', name: 'Shanti Nagar AWC', block: 'North Block', workers: 1, children: 3 },
  { id: 'AWC-027', name: 'Gandhi Chowk AWC', block: 'Central Block', workers: 1, children: 3 },
  { id: 'AWC-031', name: 'Lake View AWC', block: 'South Block', workers: 1, children: 2 },
  { id: 'AWC-046', name: 'Mangal Basti AWC', block: 'North Block', workers: 1, children: 2 },
];

const month = (offset) => {
  const date = new Date(2026, 9 - offset, 15);
  return date.toISOString().slice(0, 10);
};

const makeMeasurements = (baseWeight, baseHeight, wStep, hStep, offsets = []) =>
  Array.from({ length: 6 }, (_, index) => {
    const time = 5 - index;
    return {
      date: month(time),
      weight: Number((baseWeight + index * wStep + (offsets[index] || 0)).toFixed(1)),
      height: Number((baseHeight + index * hStep).toFixed(1)),
      source: 'Recorded demo measurement',
    };
  });

export const children = [
  { id: 'NL-24018', name: 'Aarav Sharma', ageMonths: 28, sex: 'Boy', centreId: 'AWC-014', risk: 'High', baselineStatus: 'Moderate wasting', latestStatus: 'Severe wasting', waz: -2.6, haz: -1.8, whz: -3.1, worker: 'Meena Devi', measurements: makeMeasurements(9.4, 78.1, 0.13, 0.82, [0, 0.02, -0.02, 0, -0.05, -0.18]), note: 'Weight trend slowed over the latest two visits.' },
  { id: 'NL-24027', name: 'Diya Patel', ageMonths: 34, sex: 'Girl', centreId: 'AWC-014', risk: 'Moderate', baselineStatus: 'Moderate underweight', latestStatus: 'Moderate underweight', waz: -2.1, haz: -1.4, whz: -1.2, worker: 'Meena Devi', measurements: makeMeasurements(10.2, 83.4, 0.18, 0.7), note: 'Follow-up measurement is due this week.' },
  { id: 'NL-24032', name: 'Kabir Khan', ageMonths: 19, sex: 'Boy', centreId: 'AWC-027', risk: 'Low', baselineStatus: 'At risk', latestStatus: 'No acute concern', waz: -0.9, haz: -0.6, whz: -0.4, worker: 'Sunita Rao', measurements: makeMeasurements(9.3, 74.8, 0.24, 0.86), note: 'Routine growth monitoring.' },
  { id: 'NL-24045', name: 'Anaya Singh', ageMonths: 41, sex: 'Girl', centreId: 'AWC-031', risk: 'High', baselineStatus: 'Severe underweight', latestStatus: 'Moderate underweight', waz: -2.2, haz: -2.8, whz: -1.2, worker: 'Farida Begum', measurements: makeMeasurements(10.4, 87.6, 0.28, 0.76), note: 'Improvement observed; continue planned follow-up.' },
  { id: 'NL-24051', name: 'Ishaan Verma', ageMonths: 15, sex: 'Boy', centreId: 'AWC-027', risk: 'Insufficient data', baselineStatus: 'Not assessed', latestStatus: 'Insufficient data', waz: null, haz: null, whz: null, worker: 'Sunita Rao', measurements: makeMeasurements(8.4, 72.2, 0.2, 0.8), note: 'Latest measurement needs verification.' },
  { id: 'NL-24063', name: 'Myra Joshi', ageMonths: 30, sex: 'Girl', centreId: 'AWC-046', risk: 'Moderate', baselineStatus: 'At risk', latestStatus: 'Moderate underweight', waz: -1.8, haz: -1.5, whz: -1.3, worker: 'Rita Kumari', measurements: makeMeasurements(9.6, 80.4, 0.1, 0.72, [0, 0.02, 0, -0.02, 0.02, -0.08]), note: 'Weight gain is below the illustrative expected trend.' },
  { id: 'NL-24072', name: 'Vihaan Das', ageMonths: 46, sex: 'Boy', centreId: 'AWC-031', risk: 'Low', baselineStatus: 'No acute concern', latestStatus: 'No acute concern', waz: -0.4, haz: -0.7, whz: 0.1, worker: 'Farida Begum', measurements: makeMeasurements(12.6, 94.2, 0.22, 0.74), note: 'Routine monitoring.' },
  { id: 'NL-24089', name: 'Sana Ali', ageMonths: 22, sex: 'Girl', centreId: 'AWC-014', risk: 'Moderate', baselineStatus: 'Moderate wasting', latestStatus: 'At risk', waz: -1.4, haz: -1.1, whz: -1.7, worker: 'Meena Devi', measurements: makeMeasurements(8.8, 76.2, 0.22, 0.84), note: 'Follow-up status should be confirmed.' },
  { id: 'NL-24104', name: 'Reyansh Gupta', ageMonths: 37, sex: 'Boy', centreId: 'AWC-046', risk: 'Low', baselineStatus: 'At risk', latestStatus: 'No acute concern', waz: -0.8, haz: -1.2, whz: 0, worker: 'Rita Kumari', measurements: makeMeasurements(11.4, 88.8, 0.26, 0.78), note: 'Stable upward growth trend in recorded visits.' },
  { id: 'NL-24113', name: 'Aadhya Nair', ageMonths: 26, sex: 'Girl', centreId: 'AWC-027', risk: 'Insufficient data', baselineStatus: 'Not assessed', latestStatus: 'Insufficient data', waz: null, haz: null, whz: null, worker: 'Sunita Rao', measurements: makeMeasurements(9.2, 79.1, 0.16, 0.77), note: 'Two measurements are awaiting verification.' },
];

export const interventions = [
  { id: 'INT-5101', childId: 'NL-24018', type: 'Supplementary nutrition', assignedTo: 'Meena Devi', assigned: '2026-09-10', due: '2026-10-28', status: 'In progress', verification: 'Pending verification', evidence: 'Weekly ration log', delivery: '3 of 4 weekly deliveries recorded' },
  { id: 'INT-5102', childId: 'NL-24045', type: 'Supplementary nutrition', assignedTo: 'Farida Begum', assigned: '2026-08-19', due: '2026-10-18', status: 'Completed', verification: 'Verified', evidence: 'Distribution register checked', delivery: '4 of 4 weekly deliveries recorded' },
  { id: 'INT-5103', childId: 'NL-24027', type: 'Nutrition counselling', assignedTo: 'Meena Devi', assigned: '2026-10-02', due: '2026-11-02', status: 'Assigned', verification: 'Not required', evidence: 'Caregiver session planned', delivery: 'Session not yet recorded' },
  { id: 'INT-5104', childId: 'NL-24018', type: 'Medical referral', assignedTo: 'ANM Priya', assigned: '2026-10-04', due: '2026-10-25', status: 'Completed', verification: 'Pending verification', evidence: 'Referral slip uploaded in demo', delivery: 'Facility visit needs confirmation' },
  { id: 'INT-5105', childId: 'NL-24063', type: 'Growth monitoring', assignedTo: 'Rita Kumari', assigned: '2026-10-05', due: '2026-11-05', status: 'In progress', verification: 'Not required', evidence: 'Next measure scheduled', delivery: 'Next measurement due' },
  { id: 'INT-5106', childId: 'NL-24051', type: 'Health assessment', assignedTo: 'ANM Priya', assigned: '2026-10-08', due: '2026-10-30', status: 'Assigned', verification: 'Pending verification', evidence: 'Measurement check requested', delivery: 'Awaiting assessment' },
  { id: 'INT-5107', childId: 'NL-24089', type: 'Supplementary nutrition', assignedTo: 'Meena Devi', assigned: '2026-09-21', due: '2026-10-21', status: 'Completed', verification: 'Verified', evidence: 'Caregiver acknowledgement', delivery: '4 of 4 weekly deliveries recorded' },
  { id: 'INT-5108', childId: 'NL-24113', type: 'Health assessment', assignedTo: 'ANM Priya', assigned: '2026-10-12', due: '2026-11-01', status: 'In progress', verification: 'Pending verification', evidence: 'Re-measurement requested', delivery: 'Verification not complete' },
];

export const followUps = [
  { id: 'FU-801', childId: 'NL-24018', due: '2026-10-28', status: 'Overdue', type: 'Outcome reassessment', owner: 'Meena Devi' },
  { id: 'FU-802', childId: 'NL-24027', due: '2026-11-02', status: 'Upcoming', type: 'Nutrition follow-up', owner: 'Meena Devi' },
  { id: 'FU-803', childId: 'NL-24045', due: '2026-10-30', status: 'Completed', type: 'Outcome reassessment', owner: 'Farida Begum' },
  { id: 'FU-804', childId: 'NL-24051', due: '2026-10-30', status: 'Pending', type: 'Measurement verification', owner: 'ANM Priya' },
  { id: 'FU-805', childId: 'NL-24063', due: '2026-11-05', status: 'Upcoming', type: 'Growth monitoring', owner: 'Rita Kumari' },
  { id: 'FU-806', childId: 'NL-24089', due: '2026-10-26', status: 'Overdue', type: 'Outcome reassessment', owner: 'Meena Devi' },
  { id: 'FU-807', childId: 'NL-24113', due: '2026-10-29', status: 'Pending', type: 'Measurement verification', owner: 'ANM Priya' },
];

export const alerts = [
  { childId: 'NL-24018', trend: 'Weight declined across latest two records', explanation: 'Recent recorded weight is lower than the prior visit; reassess promptly.', prediction: 'High simulated risk', action: 'Verify measurement and complete health reassessment' },
  { childId: 'NL-24045', trend: 'Gradual improvement over five visits', explanation: 'Recorded measurements trend upward; continue to monitor outcomes.', prediction: 'Moderate simulated risk', action: 'Continue intervention and scheduled follow-up' },
  { childId: 'NL-24063', trend: 'Slower weight gain in latest visits', explanation: 'Weight gain appears slower than earlier recorded trend.', prediction: 'Moderate simulated risk', action: 'Review nutrition delivery and repeat measurement' },
  { childId: 'NL-24051', trend: 'Latest record is unverified', explanation: 'Assessment is unavailable until measurement verification is complete.', prediction: 'Cannot estimate', action: 'Arrange verified health assessment' },
  { childId: 'NL-24089', trend: 'Recent upward weight trend', explanation: 'A follow-up is overdue despite completed nutrition delivery.', prediction: 'Low simulated risk', action: 'Complete outcome reassessment' },
  { childId: 'NL-24113', trend: 'Two measurements await verification', explanation: 'Data quality checks are needed before interpreting the trend.', prediction: 'Cannot estimate', action: 'Verify measurements with ANM' },
];

export const actions = [
  { id: 'ACT-31', date: '2026-10-24', title: 'Review overdue reassessments', owner: 'North Block Supervisor', status: 'In progress' },
  { id: 'ACT-32', date: '2026-10-21', title: 'Verify supplementary nutrition logs', owner: 'Centre supervisors', status: 'Pending' },
  { id: 'ACT-33', date: '2026-10-17', title: 'Resolve measurement mismatches', owner: 'ANM team', status: 'Completed' },
];
