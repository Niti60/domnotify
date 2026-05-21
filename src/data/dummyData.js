export const dashboardStats = [
  { label: 'Domains tracked', value: '58', detail: 'Active domains in portfolio' },
  { label: 'Expiring soon', value: '4', detail: 'Within 30 days' },
  { label: 'SSL alerts', value: '2', detail: 'Certificates needing attention' },
  { label: 'Monthly budget', value: '$1,240', detail: 'Projected renewal spend' },
];

export const expiringDomains = [
  { domain: 'workspace.io', expiry: '2025-06-14', daysLeft: 9, registrar: 'Namecheap' },
  { domain: 'brandhub.co', expiry: '2025-06-28', daysLeft: 23, registrar: 'Cloudflare' },
  { domain: 'launchpad.dev', expiry: '2025-07-03', daysLeft: 28, registrar: 'Google Domains' },
  { domain: 'secureapp.com', expiry: '2025-07-14', daysLeft: 39, registrar: 'GoDaddy' },
];

export const monitoringDomains = [
  { domain: 'workspace.io', registrar: 'Namecheap', expires: '2025-06-14', renewal: '$12.99', status: 'Active', lastChecked: '2 hours ago' },
  { domain: 'brandhub.co', registrar: 'Cloudflare', expires: '2025-06-28', renewal: '$14.50', status: 'Review', lastChecked: '6 hours ago' },
  { domain: 'launchpad.dev', registrar: 'Google Domains', expires: '2025-07-03', renewal: '$19.00', status: 'Active', lastChecked: '1 day ago' },
  { domain: 'secureapp.com', registrar: 'GoDaddy', expires: '2025-07-14', renewal: '$18.99', status: 'Pending', lastChecked: '4 hours ago' },
];

export const sslCertificates = [
  { domain: 'workspace.io', issuer: 'Let’s Encrypt', expires: '2025-06-10', daysLeft: 5, status: 'Renew soon' },
  { domain: 'brandhub.co', issuer: 'DigiCert', expires: '2025-07-03', daysLeft: 28, status: 'Valid' },
  { domain: 'secureapp.com', issuer: 'Comodo', expires: '2025-05-20', daysLeft: -10, status: 'Expired' },
];

export const whoisData = {
  domain: 'secureapp.com',
  registrar: 'Namecheap, Inc.',
  registrant: 'Example Corp',
  email: 'admin@secureapp.com',
  nameservers: ['ns1.namecheap.net', 'ns2.namecheap.net'],
  created: '2019-05-10',
  expires: '2025-05-20',
  status: 'Active',
  dnssec: 'Unsigned',
};

export const watchlistDomains = [
  { domain: 'futurestack.ai', status: 'Available', score: 91, price: '$2,900' },
  { domain: 'growthlabs.dev', status: 'Premium', score: 84, price: '$1,650' },
  { domain: 'launchcode.app', status: 'Available', score: 78, price: '$740' },
];

export const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Domain health tracking for small portfolios',
    features: ['Up to 15 domains', 'Basic monitoring', 'WHOIS lookup', 'Email reminders'],
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'All core monitoring features for founders and agencies',
    features: ['Up to 100 domains', 'SSL & uptime alerts', 'Watchlist tracking', 'Priority support'],
    highlight: true,
  },
  {
    name: 'Agency',
    price: '$79',
    description: 'Scale monitoring for teams and domain portfolios',
    features: ['Unlimited domains', 'Custom alerts', 'CSV export', 'Team-ready tools'],
    highlight: false,
  },
];

export const registrarCards = [
  {
    name: 'Namecheap',
    price: '$13.50/yr',
    bestFor: 'Portfolio management',
    features: ['WHOIS privacy included', 'DNS management', 'Renewal alerts'],
    popularity: 'Best value',
  },
  {
    name: 'Cloudflare',
    price: '$12.99/yr',
    bestFor: 'Low renewal costs',
    features: ['Free DNS', 'Fast propagation', 'Privacy protection'],
    popularity: 'Budget-friendly',
  },
  {
    name: 'Google Domains',
    price: '$15.00/yr',
    bestFor: 'Simple pricing',
    features: ['Clean UI', 'Privacy protection', 'Google integrations'],
    popularity: 'Trusted option',
  },
];

export const domainSearchResults = [
  { domain: 'startupflow.com', available: true, price: '$9.99/yr', registrar: 'Namecheap' },
  { domain: 'appstream.io', available: true, price: '$29.99/yr', registrar: 'Cloudflare' },
  { domain: 'launchpad.dev', available: false, price: 'Taken', registrar: 'Owned' },
  { domain: 'brandtrack.ai', available: true, price: '$34.99/yr', registrar: 'Google Domains' },
];

export const recentActivity = [
  { id: 1, message: 'SSL expiration alert created for secureapp.com', time: '2h ago' },
  { id: 2, message: 'WHOIS lookup completed for growthlabs.dev', time: 'Yesterday' },
  { id: 3, message: 'Domain workspace.io renewed for 1 year', time: '3 days ago' },
];

export const searchTlds = ['.com', '.io', '.dev', '.app', '.co', '.ai'];
