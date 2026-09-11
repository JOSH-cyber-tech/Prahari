// Canned sample data for the "Demo Official" / mock-credentials login path.
//
// Demo/mock users (AuthContext's loginAsDemo / loginWithMockCredentials)
// are entirely client-side -- they never get a real backend session cookie.
// Since commit 764a544 added require_role("government") to /api/geo/* and
// /api/network/*, those calls 401 for demo users. Rather than weaken that
// server-side check, command-center pages fall back to this static data
// when user.isDemo/user.isMock is set, so the demo walkthrough still shows
// a populated dashboard. Shapes mirror prahari_dashboard_backend's
// GeoComplaintsResponse / GeoDistrictStatsResponse / GeoTrendResponse /
// GeoScamTypesResponse / NetworkGraphResponse / NetworkClustersResponse.

export const MOCK_SCAM_TYPES = [
  'UPI Fraud',
  'Phishing',
  'Investment Scam',
  'Loan App Fraud',
  'KYC Fraud',
  'Job Fraud',
  'Digital Arrest',
];

export const MOCK_GEO_COMPLAINTS = {
  complaints: [
    { lat: 28.6499, lng: 77.1095, scam_type: 'UPI Fraud', amount: 42000, risk_score: 78, date: '2026-09-08', district: 'Delhi' },
    { lat: 19.1374, lng: 72.9079, scam_type: 'Investment Scam', amount: 185000, risk_score: 91, date: '2026-09-07', district: 'Greater Bombay' },
    { lat: 12.9151, lng: 77.5858, scam_type: 'Job Fraud', amount: 15000, risk_score: 54, date: '2026-09-06', district: 'Bangalore Urban' },
    { lat: 22.5561, lng: 88.3514, scam_type: 'Phishing', amount: 8000, risk_score: 41, date: '2026-09-05', district: 'Kolkata' },
    { lat: 17.3986, lng: 78.4731, scam_type: 'Digital Arrest', amount: 320000, risk_score: 96, date: '2026-09-05', district: 'Hyderabad' },
    { lat: 13.0552, lng: 80.2350, scam_type: 'Loan App Fraud', amount: 22000, risk_score: 63, date: '2026-09-04', district: 'Chennai' },
    { lat: 18.5075, lng: 74.2081, scam_type: 'KYC Fraud', amount: 5000, risk_score: 29, date: '2026-09-03', district: 'Pune' },
    { lat: 27.0408, lng: 75.7609, scam_type: 'UPI Fraud', amount: 30500, risk_score: 71, date: '2026-09-02', district: 'Jaipur' },
  ],
};

export const MOCK_GEO_DISTRICT_STATS = {
  districts: [
    { district_id: 'Delhi', complaint_count: 214, risk_score: 88.4, top_scam_type: 'UPI Fraud', trend: 'up', trend_delta_pct: 12.5 },
    { district_id: 'Greater Bombay', complaint_count: 197, risk_score: 82.1, top_scam_type: 'Investment Scam', trend: 'up', trend_delta_pct: 8.2 },
    { district_id: 'Hyderabad', complaint_count: 143, risk_score: 74.6, top_scam_type: 'Digital Arrest', trend: 'up', trend_delta_pct: 19.7 },
    { district_id: 'Bangalore Urban', complaint_count: 121, risk_score: 61.3, top_scam_type: 'Job Fraud', trend: 'flat', trend_delta_pct: 1.1 },
    { district_id: 'Chennai', complaint_count: 98, risk_score: 52.8, top_scam_type: 'Loan App Fraud', trend: 'down', trend_delta_pct: -4.3 },
    { district_id: 'Kolkata', complaint_count: 76, risk_score: 44.0, top_scam_type: 'Phishing', trend: 'flat', trend_delta_pct: 0.6 },
    { district_id: 'Pune', complaint_count: 52, risk_score: 33.5, top_scam_type: 'KYC Fraud', trend: 'down', trend_delta_pct: -6.8 },
    { district_id: 'Jaipur', complaint_count: 41, risk_score: 27.2, top_scam_type: 'UPI Fraud', trend: 'up', trend_delta_pct: 5.4 },
  ],
};

export const MOCK_GEO_TREND = {
  series: [
    { date: '2026-08-25', count: 38 }, { date: '2026-08-28', count: 44 },
    { date: '2026-08-31', count: 41 }, { date: '2026-09-03', count: 52 },
    { date: '2026-09-06', count: 61 }, { date: '2026-09-09', count: 58 },
  ],
  by_scam_type: [
    { scam_type: 'UPI Fraud', points: [{ date: '2026-08-25', count: 12 }, { date: '2026-09-09', count: 21 }], growth_rate_pct: 75.0 },
    { scam_type: 'Digital Arrest', points: [{ date: '2026-08-25', count: 4 }, { date: '2026-09-09', count: 15 }], growth_rate_pct: 275.0 },
  ],
  trending_scam_type: 'Digital Arrest',
};

export const MOCK_NETWORK_GRAPH = {
  nodes: [
    { id: 'n1', phone_number: '+91 98XXX-11029', category: 'UPI Mule', region: 'Delhi', risk_score: 0.91 },
    { id: 'n2', phone_number: '+91 97XXX-44510', category: 'Call Relay', region: 'Hyderabad', risk_score: 0.83 },
    { id: 'n3', phone_number: '+91 89XXX-22876', category: 'Recruiter', region: 'Bangalore Urban', risk_score: 0.67 },
    { id: 'n4', phone_number: '+91 90XXX-77341', category: 'UPI Mule', region: 'Greater Bombay', risk_score: 0.58 },
    { id: 'n5', phone_number: '+91 88XXX-90123', category: 'Call Relay', region: 'Kolkata', risk_score: 0.42 },
    { id: 'n6', phone_number: '+91 96XXX-33218', category: 'Recruiter', region: 'Chennai', risk_score: 0.35 },
  ],
  edges: [
    { source: 'n1', target: 'n2', reason: 'Shared UPI settlement account' },
    { source: 'n2', target: 'n3', reason: 'Repeated call bursts within 5 min window' },
    { source: 'n1', target: 'n4', reason: 'Common device fingerprint' },
    { source: 'n5', target: 'n6', reason: 'Same SIM registration batch' },
  ],
};

export const MOCK_NETWORK_CLUSTERS = {
  clusters: [
    {
      id: 'c1',
      node_ids: ['n1', 'n2', 'n3', 'n4'],
      risk_score: 0.85,
      summary: 'Sample syndicate spanning Delhi/Hyderabad/Bangalore relaying digital-arrest scripts through a shared UPI mule account.',
    },
    {
      id: 'c2',
      node_ids: ['n5', 'n6'],
      risk_score: 0.39,
      summary: 'Smaller two-node cluster with low call-volume overlap, flagged for monitoring only.',
    },
  ],
};
